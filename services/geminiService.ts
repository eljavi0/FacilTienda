import { GoogleGenAI } from "@google/genai";
import { Product, Customer, Sale } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessAdvice = async (
  query: string, 
  inventory: Product[], 
  customers: Customer[], 
  recentSales: Sale[]
): Promise<string> => {
  
  // Prepare a concise context summary
  const lowStock = inventory.filter(p => p.stock < 5).map(p => p.name).join(", ");
  const topDebtors = customers
    .sort((a, b) => b.currentDebt - a.currentDebt)
    .slice(0, 3)
    .map(c => `${c.name} ($${c.currentDebt})`)
    .join(", ");
  
  const totalSales = recentSales.reduce((sum, s) => sum + s.total, 0);

  const context = `
    Contexto de la Tienda de Barrio (Colombia):
    - Productos con bajo inventario: ${lowStock || "Ninguno"}
    - Clientes con mayor deuda (Fiado): ${topDebtors || "Ninguno"}
    - Ventas recientes (Total): $${totalSales}
    
    Actúa como un consultor experto en micronegocios y tiendas de barrio en Colombia.
    Usa un tono amable, motivador y práctico.
    Responde a la pregunta del usuario basándote en los datos anteriores si es relevante.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `${context}\n\nPregunta del usuario: ${query}`,
      config: {
        systemInstruction: "Eres 'Don Facil', un asistente virtual experto en administración de tiendas de barrio. Das consejos cortos y accionables.",
      }
    });

    return response.text || "Lo siento, no pude generar un consejo en este momento.";
  } catch (error) {
    console.error("Error fetching Gemini advice:", error);
    return "Ocurrió un error al consultar con el asistente inteligente. Por favor intenta más tarde.";
  }
};