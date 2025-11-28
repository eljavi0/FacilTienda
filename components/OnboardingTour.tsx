import React, { useState } from 'react';
import { X, ArrowRight, Check, LayoutDashboard, ShoppingCart, Box, Users, MessageSquareText } from 'lucide-react';

interface OnboardingTourProps {
  onComplete: () => void;
  ownerName: string;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({ onComplete, ownerName }) => {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: `¡Bienvenido, ${ownerName}!`,
      description: "FacilTienda es tu nueva herramienta para administrar tu negocio sin complicaciones. Te enseñaré rápido cómo funciona.",
      icon: <div className="text-4xl">👋</div>,
      color: "bg-blue-500"
    },
    {
      title: "Inicio (Dashboard)",
      description: "Aquí verás cuánto has vendido hoy, cuánto te deben tus clientes y qué productos se están acabando.",
      icon: <LayoutDashboard size={40} className="text-white" />,
      color: "bg-orange-500"
    },
    {
      title: "Vender (Caja)",
      description: "Registra tus ventas en segundos. Puedes cobrar en efectivo o anotar 'fiados' automáticamente.",
      icon: <ShoppingCart size={40} className="text-white" />,
      color: "bg-green-500"
    },
    {
      title: "Inventario",
      description: "Agrega tus productos aquí. Controla tus precios y las unidades disponibles. ¡Adiós a contar a ojo!",
      icon: <Box size={40} className="text-white" />,
      color: "bg-purple-500"
    },
    {
      title: "Fiados (Cartera)",
      description: "El cuaderno digital. Mira quién te debe, cuánto te debe y registra abonos o nuevas deudas fácilmente.",
      icon: <Users size={40} className="text-white" />,
      color: "bg-red-500"
    },
    {
      title: "Asesor IA (Don Facil)",
      description: "Tu experto personal. Pregúntale cómo mejorar ventas o consejos para tu negocio. ¡Siempre está disponible!",
      icon: <MessageSquareText size={40} className="text-white" />,
      color: "bg-indigo-600"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className={`${currentStep.color} p-8 flex justify-center items-center transition-colors duration-300`}>
          <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
            {currentStep.icon}
          </div>
        </div>
        
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">{currentStep.title}</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            {currentStep.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {steps.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-2 rounded-full transition-all duration-300 ${idx === step ? `w-6 ${currentStep.color}` : 'w-2 bg-slate-200'}`} 
                />
              ))}
            </div>

            <button 
              onClick={handleNext}
              className={`${currentStep.color} text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:opacity-90 transition-all active:scale-95 flex items-center`}
            >
              {step === steps.length - 1 ? 'Empezar' : 'Siguiente'}
              {step === steps.length - 1 ? <Check size={18} className="ml-2" /> : <ArrowRight size={18} className="ml-2" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};