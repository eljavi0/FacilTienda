import React from 'react';
import { LayoutDashboard, ShoppingCart, Box, Users, MessageSquareText, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface LayoutProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  children: React.ReactNode;
  storeName?: string;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children, storeName = "FacilTienda", onLogout }) => {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Inicio' },
    { id: 'pos', icon: ShoppingCart, label: 'Vender' },
    { id: 'inventory', icon: Box, label: 'Inventario' },
    { id: 'credits', icon: Users, label: 'Fiados' },
    { id: 'advisor', icon: MessageSquareText, label: 'Asesor IA' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
        <div className="p-6">
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent break-words leading-tight">
            {storeName}
          </h1>
          <p className="text-xs text-slate-400 mt-1">Gestión digital</p>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as ViewState)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                currentView === item.id 
                  ? 'bg-orange-50 text-orange-600 font-semibold' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100 space-y-2">
          {onLogout && (
            <button 
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-2 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Salir</span>
            </button>
          )}
          <div className="bg-slate-100 rounded-xl p-3 text-center">
            <p className="text-xs text-slate-400 font-medium">Versión 1.0.0</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
         {/* Mobile Header */}
         <div className="md:hidden flex justify-between items-center mb-6">
            <h1 className="text-lg font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent truncate max-w-[70%]">
              {storeName}
            </h1>
            {onLogout && (
              <button onClick={onLogout} className="text-slate-500 hover:text-red-500">
                <LogOut size={20} />
              </button>
            )}
         </div>
         {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-between items-center z-40 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id as ViewState)}
            className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
              currentView === item.id ? 'text-orange-600' : 'text-slate-400'
            }`}
          >
            <item.icon size={24} className={currentView === item.id ? "stroke-[2.5px]" : "stroke-2"} />
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};