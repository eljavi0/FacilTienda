import React, { useState, useMemo } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, User } from 'lucide-react';
import { Product, Customer, SaleItem } from '../types';

interface SalesProps {
  products: Product[];
  customers: Customer[];
  onCompleteSale: (items: SaleItem[], total: number, paymentMethod: 'cash' | 'credit', customerId?: string) => void;
}

export const Sales: React.FC<SalesProps> = ({ products, customers, onCompleteSale }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  
  // Checkout State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const [selectedCustomerForCredit, setSelectedCustomerForCredit] = useState<string>('');

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return; // Prevent negative stock logic
    
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev; // Limit to stock
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { productId: product.id, productName: product.name, quantity: 1, priceAtSale: product.price }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const product = products.find(p => p.id === productId);
        const maxStock = product ? product.stock : 999;
        const newQty = Math.min(maxStock, Math.max(0, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const total = useMemo(() => cart.reduce((acc, item) => acc + (item.priceAtSale * item.quantity), 0), [cart]);

  const handleCheckout = () => {
    if (paymentMethod === 'credit' && !selectedCustomerForCredit) {
      alert("Por favor seleccione un cliente para fiar.");
      return;
    }
    
    onCompleteSale(cart, total, paymentMethod, selectedCustomerForCredit);
    // Reset
    setCart([]);
    setIsCheckoutOpen(false);
    setPaymentMethod('cash');
    setSelectedCustomerForCredit('');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-24 h-full relative">
      <div className="flex flex-col h-full">
        {/* Header & Filter */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4 sticky top-0 z-10">
            <h2 className="text-xl font-bold text-slate-800 mb-3">Nueva Venta</h2>
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-orange-500 text-white font-medium' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto pb-32">
            {filteredProducts.map(product => (
                <div 
                    key={product.id}
                    onClick={() => addToCart(product)}
                    className={`bg-white p-3 rounded-xl border border-slate-100 shadow-sm transition-all flex flex-col justify-between h-32 ${product.stock > 0 ? 'hover:shadow-md active:scale-95 cursor-pointer' : 'opacity-60 grayscale cursor-not-allowed'}`}
                >
                    <div>
                        <h4 className="font-semibold text-slate-800 text-sm line-clamp-2">{product.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{product.stock} unid. disp.</p>
                    </div>
                    <div className="flex justify-between items-end">
                        <span className="font-bold text-orange-600">${product.price.toLocaleString()}</span>
                        {product.stock > 0 && (
                            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                <Plus size={16} />
                            </div>
                        )}
                    </div>
                </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center text-slate-400 py-10">
                No se encontraron productos
              </div>
            )}
        </div>
      </div>

      {/* Floating Cart / Bottom Sheet */}
      <div className={`fixed bottom-20 left-4 right-4 md:left-64 md:right-8 bg-white rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border border-slate-200 transition-transform duration-300 ${cart.length === 0 ? 'translate-y-[150%]' : 'translate-y-0'}`}>
          <div className="p-4">
              {/* Cart Items Preview (First 2) */}
              {isCheckoutOpen ? (
                   <div className="space-y-4">
                       <div className="flex justify-between items-center border-b pb-2">
                           <h3 className="font-bold text-lg">Confirmar Venta</h3>
                           <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400"><Trash2 size={20}/></button>
                       </div>
                       
                       <div className="space-y-2 max-h-40 overflow-y-auto">
                           {cart.map(item => (
                               <div key={item.productId} className="flex justify-between text-sm">
                                   <span>{item.quantity}x {item.productName}</span>
                                   <span className="font-medium">${(item.priceAtSale * item.quantity).toLocaleString()}</span>
                               </div>
                           ))}
                       </div>

                       <div className="border-t pt-4">
                           <div className="flex gap-2 mb-4">
                               <button 
                                   onClick={() => setPaymentMethod('cash')}
                                   className={`flex-1 py-2 rounded-lg border font-medium text-sm ${paymentMethod === 'cash' ? 'bg-green-50 border-green-500 text-green-700' : 'border-slate-200 text-slate-500'}`}
                                >
                                   Efectivo
                               </button>
                               <button 
                                   onClick={() => setPaymentMethod('credit')}
                                   className={`flex-1 py-2 rounded-lg border font-medium text-sm ${paymentMethod === 'credit' ? 'bg-red-50 border-red-500 text-red-700' : 'border-slate-200 text-slate-500'}`}
                                >
                                   Fiado
                               </button>
                           </div>

                           {paymentMethod === 'credit' && (
                               <div className="mb-4">
                                   <label className="block text-xs font-bold text-slate-500 mb-1">Cliente a Fiar</label>
                                   <select 
                                       value={selectedCustomerForCredit}
                                       onChange={(e) => setSelectedCustomerForCredit(e.target.value)}
                                       className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                                   >
                                       <option value="">Seleccionar Cliente...</option>
                                       {customers.map(c => (
                                           <option key={c.id} value={c.id}>{c.name}</option>
                                       ))}
                                   </select>
                               </div>
                           )}

                           <button 
                               onClick={handleCheckout}
                               className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-colors"
                           >
                               Cobrar ${total.toLocaleString()}
                           </button>
                       </div>
                   </div>
              ) : (
                  <div className="flex justify-between items-center" onClick={() => setIsCheckoutOpen(true)}>
                      <div className="flex items-center gap-3">
                          <div className="bg-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                              {cart.reduce((a,b) => a + b.quantity, 0)}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-xs text-slate-500">Total a pagar</span>
                             <span className="font-bold text-xl text-slate-800">${total.toLocaleString()}</span>
                          </div>
                      </div>
                      <button className="bg-slate-900 text-white px-6 py-2 rounded-xl font-medium shadow-md">
                          Ver Carrito
                      </button>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};