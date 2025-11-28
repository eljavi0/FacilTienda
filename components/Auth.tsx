import React, { useState } from 'react';
import { Store, User, ArrowRight } from 'lucide-react';

interface AuthProps {
  onRegister: (storeName: string, ownerName: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onRegister }) => {
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (storeName && ownerName) {
      onRegister(storeName, ownerName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
            <Store size={40} />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800 mb-2">FacilTienda</h1>
          <p className="text-slate-500">Tu compañero digital para el éxito de tu negocio.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre de tu Tienda</label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Ej: Tienda La Esperanza" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tu Nombre (Dueño)</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Ej: Juan Pérez" 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 transition-transform active:scale-95 flex items-center justify-center"
          >
            Abrir mi Tienda <ArrowRight size={20} className="ml-2" />
          </button>
        </form>
        
        <p className="text-center text-xs text-slate-400 mt-8">
          Al continuar, aceptas organizar tu negocio y dejar atrás el cuaderno.
        </p>
      </div>
    </div>
  );
};