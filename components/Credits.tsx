import React, { useState } from 'react';
import { UserPlus, Search, Phone, History, DollarSign, ArrowUpRight, ArrowDownLeft, X } from 'lucide-react';
import { Customer } from '../types';

interface CreditsProps {
  customers: Customer[];
  onAddCustomer: (customer: Omit<Customer, 'id' | 'currentDebt' | 'history'>) => void;
  onAddTransaction: (customerId: string, amount: number, type: 'debt' | 'payment', description: string) => void;
}

export const Credits: React.FC<CreditsProps> = ({ customers, onAddCustomer, onAddTransaction }) => {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // New Customer State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');

  // Transaction State
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCustomer({ name: newName, phone: newPhone });
    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('');
  };

  const handleTransaction = (type: 'debt' | 'payment') => {
    if (selectedCustomer && amount) {
      onAddTransaction(selectedCustomer.id, Number(amount), type, desc || (type === 'debt' ? 'Fiado manual' : 'Abono a cuenta'));
      setAmount('');
      setDesc('');
      // Optimistically update local selected view
      // In a real app, we'd wait for prop propagation, but for UX snapiness we can close or keep open
    }
  };

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="pb-20 h-full flex flex-col">
      {/* Header */}
      {!selectedCustomer ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">Libro de Fiados</h2>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md flex items-center"
            >
              <UserPlus size={20} className="mr-2" /> Nuevo Cliente
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar cliente..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
            {filteredCustomers.map(customer => (
              <div 
                key={customer.id} 
                onClick={() => setSelectedCustomer(customer)}
                className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center"
              >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {customer.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-800">{customer.name}</h3>
                        <div className="flex items-center text-xs text-slate-500">
                            <Phone size={12} className="mr-1" /> {customer.phone}
                        </div>
                    </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 mb-1">Deuda Actual</p>
                  <p className={`font-bold text-lg ${customer.currentDebt > 0 ? 'text-red-500' : 'text-green-500'}`}>
                    ${customer.currentDebt.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col">
           {/* Detail View */}
           <div className="flex items-center gap-2 mb-6">
             <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-slate-100 rounded-full">
               <X size={24} className="text-slate-600" />
             </button>
             <div>
                <h2 className="text-2xl font-bold text-slate-800">{selectedCustomer.name}</h2>
                <p className="text-slate-500 text-sm flex items-center"><Phone size={14} className="mr-1"/> {selectedCustomer.phone}</p>
             </div>
           </div>

           {/* Balance Card */}
           <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white shadow-lg mb-6">
              <p className="text-blue-100 text-sm mb-1">Total a Deber</p>
              <h3 className="text-4xl font-bold">${selectedCustomer.currentDebt.toLocaleString()}</h3>
           </div>

           {/* Actions */}
           <div className="grid grid-cols-2 gap-4 mb-6">
             <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase">Registrar</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder="$ 0" 
                  className="w-full text-lg font-bold border-b border-slate-200 focus:border-blue-500 outline-none mb-3 py-1"
                />
                <input 
                  type="text" 
                  value={desc} 
                  onChange={(e) => setDesc(e.target.value)} 
                  placeholder="Nota (opcional)" 
                  className="w-full text-sm text-slate-600 border-b border-slate-200 focus:border-blue-500 outline-none mb-4 py-1"
                />
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleTransaction('debt')}
                        className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg font-medium hover:bg-red-200 transition-colors flex justify-center items-center gap-1"
                    >
                        <ArrowUpRight size={16}/> Fiar
                    </button>
                    <button 
                        onClick={() => handleTransaction('payment')}
                        className="flex-1 bg-green-100 text-green-600 py-2 rounded-lg font-medium hover:bg-green-200 transition-colors flex justify-center items-center gap-1"
                    >
                         <ArrowDownLeft size={16}/> Pagar
                    </button>
                </div>
             </div>

             <div className="bg-slate-50 rounded-xl p-4 overflow-y-auto max-h-64 border border-slate-100">
                <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2"><History size={16}/> Historial</h4>
                <div className="space-y-3">
                    {/* Reverse array to show newest first */}
                    {[...selectedCustomer.history].reverse().map(t => (
                        <div key={t.id} className="flex justify-between items-start text-sm border-b border-slate-200 pb-2 last:border-0">
                            <div>
                                <p className="font-medium text-slate-800">{t.description}</p>
                                <p className="text-xs text-slate-400">{new Date(t.date).toLocaleDateString()}</p>
                            </div>
                            <span className={`font-bold ${t.type === 'debt' ? 'text-red-500' : 'text-green-500'}`}>
                                {t.type === 'debt' ? '+' : '-'}${t.amount.toLocaleString()}
                            </span>
                        </div>
                    ))}
                    {selectedCustomer.history.length === 0 && <p className="text-center text-slate-400 text-sm py-4">Sin movimientos</p>}
                </div>
             </div>
           </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-slate-800">Nuevo Cliente</h3>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre Completo</label>
                <input required value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
                <input required type="tel" value={newPhone} onChange={e => setNewPhone(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-medium">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium shadow-md">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};