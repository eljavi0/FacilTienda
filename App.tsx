import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Credits } from './components/Credits';
import { Sales } from './components/Sales';
import { AIAssistant } from './components/AIAssistant';
import { Auth } from './components/Auth';
import { OnboardingTour } from './components/OnboardingTour';
import { Product, Customer, Sale, ViewState, SaleItem, Transaction } from './types';

const App: React.FC = () => {
  // Session State
  const [isRegistered, setIsRegistered] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [showTour, setShowTour] = useState(false);
  
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  // Application Data State - Starts Empty
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  // --- Auth Handlers ---
  const handleRegister = (name: string, owner: string) => {
    setStoreName(name);
    setOwnerName(owner);
    setIsRegistered(true);
    setShowTour(true); // Show tour immediately after registration
    
    // Initialize clean state
    setProducts([]);
    setCustomers([]);
    setSales([]);
  };

  const handleLogout = () => {
    if (window.confirm("¿Estás seguro de que deseas cerrar sesión?")) {
      setIsRegistered(false);
      setStoreName('');
      setOwnerName('');
      setCurrentView('dashboard');
    }
  };

  const handleCompleteTour = () => {
    setShowTour(false);
  };

  // --- Data Handlers ---

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    const product = { ...newProduct, id: Math.random().toString(36).substr(2, 9) };
    setProducts(prev => [...prev, product]);
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleAddCustomer = (newCustomer: Omit<Customer, 'id' | 'currentDebt' | 'history'>) => {
    const customer = { ...newCustomer, id: Math.random().toString(36).substr(2, 9), currentDebt: 0, history: [] };
    setCustomers(prev => [...prev, customer]);
  };

  const handleTransaction = (customerId: string, amount: number, type: 'debt' | 'payment', description: string) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        const newDebt = type === 'debt' ? c.currentDebt + amount : c.currentDebt - amount;
        const newTransaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString(),
          amount,
          type,
          description
        };
        return { ...c, currentDebt: newDebt, history: [...c.history, newTransaction] };
      }
      return c;
    }));
  };

  const handleCompleteSale = (items: SaleItem[], total: number, paymentMethod: 'cash' | 'credit', customerId?: string) => {
    // 1. Record Sale
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      total,
      items,
      paymentMethod,
      customerId
    };
    setSales(prev => [...prev, newSale]);

    // 2. Update Inventory
    items.forEach(item => {
      setProducts(prev => prev.map(p => {
        if (p.id === item.productId) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
      }));
    });

    // 3. Update Credit if needed
    if (paymentMethod === 'credit' && customerId) {
      handleTransaction(customerId, total, 'debt', 'Compra a crédito (POS)');
    }
  };

  // Render current view
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard sales={sales} customers={customers} products={products} />;
      case 'inventory':
        return <Inventory 
          products={products} 
          onAddProduct={handleAddProduct} 
          onUpdateProduct={handleUpdateProduct} 
          onDeleteProduct={handleDeleteProduct}
        />;
      case 'credits':
        return <Credits customers={customers} onAddCustomer={handleAddCustomer} onAddTransaction={handleTransaction} />;
      case 'pos':
        return <Sales products={products} customers={customers} onCompleteSale={handleCompleteSale} />;
      case 'advisor':
        return <AIAssistant products={products} customers={customers} sales={sales} />;
      default:
        return <Dashboard sales={sales} customers={customers} products={products} />;
    }
  };

  if (!isRegistered) {
    return <Auth onRegister={handleRegister} />;
  }

  return (
    <>
      <Layout currentView={currentView} onChangeView={setCurrentView} storeName={storeName} onLogout={handleLogout}>
        {renderView()}
      </Layout>
      {showTour && <OnboardingTour onComplete={handleCompleteTour} ownerName={ownerName} />}
    </>
  );
};

export default App;