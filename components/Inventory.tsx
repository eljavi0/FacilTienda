import React, { useState } from 'react';
import { Plus, Search, Edit2, AlertCircle, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface InventoryProps {
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onDeleteProduct: (id: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ products, onAddProduct, onUpdateProduct, onDeleteProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newCategory, setNewCategory] = useState('');

  const openAddModal = () => {
    setEditingId(null);
    setNewName('');
    setNewPrice('');
    setNewStock('');
    setNewCategory('');
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingId(product.id);
    setNewName(product.name);
    setNewPrice(product.price.toString());
    setNewStock(product.stock.toString());
    setNewCategory(product.category);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${name}"?`)) {
      onDeleteProduct(id);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: newName,
      price: Number(newPrice),
      stock: Number(newStock),
      category: newCategory || 'General'
    };

    if (editingId) {
      onUpdateProduct(editingId, productData);
    } else {
      onAddProduct(productData);
    }

    setIsModalOpen(false);
    setEditingId(null);
    // Reset form
    setNewName('');
    setNewPrice('');
    setNewStock('');
    setNewCategory('');
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Inventario</h2>
        <button 
          onClick={openAddModal}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center shadow-md transition-colors w-full sm:w-auto justify-center"
        >
          <Plus size={20} className="mr-2" /> Nuevo Producto
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Buscar producto..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-10 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
            <p>No hay productos en inventario.</p>
            <p className="text-xs mt-1">¡Agrega tu primer producto arriba!</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center group">
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">{product.name}</h3>
                <p className="text-sm text-slate-500">{product.category}</p>
                <p className="text-lg font-bold text-orange-600 mt-1">${product.price.toLocaleString()}</p>
              </div>
              <div className="text-right flex flex-col items-end gap-2 ml-4">
                 <div className={`flex items-center px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${product.stock < 5 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                   {product.stock < 5 && <AlertCircle size={12} className="mr-1" />}
                   Unid: {product.stock}
                 </div>
                 <div className="flex gap-2">
                   <button 
                     onClick={() => openEditModal(product)}
                     className="p-2 text-slate-400 hover:text-blue-500 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors"
                     title="Editar"
                    >
                     <Edit2 size={16} />
                   </button>
                   <button 
                     onClick={() => handleDelete(product.id, product.name)}
                     className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors"
                     title="Eliminar"
                    >
                     <Trash2 size={16} />
                   </button>
                 </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4 text-slate-800">
              {editingId ? 'Editar Producto' : 'Agregar Producto'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input required value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio</label>
                  <input required type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Unidades</label>
                  <input required type="number" value={newStock} onChange={e => setNewStock(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Ej: Bebidas, Abarrotes" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
              </div>
              <div className="flex gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-medium">Cancelar</button>
                <button type="submit" className="flex-1 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 font-medium shadow-md">
                  {editingId ? 'Actualizar' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};