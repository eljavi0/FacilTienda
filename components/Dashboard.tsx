import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import { Sale, Customer, Product } from '../types';
import { StatCard } from './StatCard';

interface DashboardProps {
  sales: Sale[];
  customers: Customer[];
  products: Product[];
}

export const Dashboard: React.FC<DashboardProps> = ({ sales, customers, products }) => {
  // Calculate Stats
  const totalSales = sales.reduce((acc, curr) => acc + curr.total, 0);
  const totalDebt = customers.reduce((acc, curr) => acc + curr.currentDebt, 0);
  const lowStockCount = products.filter((p) => p.stock < 5).length;
  
  // Prepare Chart Data
  const salesData = sales.slice(-7).map((s) => ({
    name: new Date(s.date).toLocaleDateString('es-CO', { weekday: 'short' }),
    monto: s.total,
  }));

  const debtData = [
    { name: 'Pagado', value: totalSales }, 
    { name: 'Fiado (Deuda)', value: totalDebt },
  ];
  // Prevent empty chart data issues
  const finalDebtData = totalSales === 0 && totalDebt === 0 
    ? [{ name: 'Sin Datos', value: 1 }] 
    : debtData;
  const COLORS = ['#22c55e', '#ef4444', '#cbd5e1'];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Resumen del Negocio</h2>
        <span className="text-sm text-slate-500">{new Date().toLocaleDateString('es-CO', {dateStyle: 'full'})}</span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Ventas Totales" 
          value={`$${totalSales.toLocaleString()}`} 
          icon={DollarSign} 
          colorClass="bg-orange-500" 
          trend="Hoy"
        />
        <StatCard 
          title="Cartera (Fiado)" 
          value={`$${totalDebt.toLocaleString()}`} 
          icon={Users} 
          colorClass="bg-blue-500"
        />
        <StatCard 
          title="Pocas Unidades" 
          value={lowStockCount} 
          icon={AlertTriangle} 
          colorClass="bg-red-500"
          trend={lowStockCount > 0 ? "Reponer urgente" : "Inventario sano"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
            Tendencia de Ventas
          </h3>
          <div className="h-64">
            {sales.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="monto" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                No hay ventas registradas aún
              </div>
            )}
          </div>
        </div>

        {/* Debt Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Distribución Financiera</h3>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={finalDebtData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {finalDebtData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={totalSales === 0 && totalDebt === 0 ? '#e2e8f0' : COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center pointer-events-none">
              <span className="text-sm text-slate-400">Total Fiado</span>
              <p className="text-xl font-bold text-slate-800">${totalDebt.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};