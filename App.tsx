import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { POS } from './components/POS';
import { Journal } from './components/Journal';
import { AIAdvisor } from './components/AIAdvisor';
import { Product, Transaction, TransactionType, FinancialSummary } from './types';

// Initial Mock Data
const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Laptop ASUS Vivobook', category: 'Laptop', stock: 15, buyPrice: 7500000, sellPrice: 8900000, sku: 'LPT-001' },
  { id: '2', name: 'Samsung Galaxy S24', category: 'Smartphone', stock: 8, buyPrice: 12000000, sellPrice: 14500000, sku: 'HP-002' },
  { id: '3', name: 'Mouse Logitech Wireless', category: 'Aksesoris', stock: 50, buyPrice: 120000, sellPrice: 185000, sku: 'ACC-003' },
  { id: '4', name: 'Monitor LG 24 inch', category: 'Monitor', stock: 12, buyPrice: 1800000, sellPrice: 2300000, sku: 'MON-004' },
  { id: '5', name: 'Kabel HDMI 2m', category: 'Aksesoris', stock: 100, buyPrice: 35000, sellPrice: 75000, sku: 'ACC-005' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TRX-1001',
    date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    type: TransactionType.SALE,
    totalAmount: 17800000,
    description: 'Penjualan LPT-001 x2',
    items: [
      { productId: '1', productName: 'Laptop ASUS Vivobook', quantity: 2, priceAtTransaction: 8900000, costAtTransaction: 7500000 }
    ]
  },
  {
    id: 'TRX-1002',
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    type: TransactionType.EXPENSE,
    totalAmount: 500000,
    description: 'Biaya Listrik & Air',
    category: 'Utilitas'
  }
];

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalRevenue: 0,
    totalCOGS: 0,
    totalExpenses: 0,
    netProfit: 0,
    lowStockCount: 0,
    inventoryValue: 0
  });

  // Calculate Financial Summary whenever transactions or products change
  useEffect(() => {
    let revenue = 0;
    let cogs = 0;
    let expenses = 0;

    transactions.forEach(tx => {
      if (tx.type === TransactionType.SALE) {
        revenue += tx.totalAmount;
        if (tx.items) {
          cogs += tx.items.reduce((sum, item) => sum + (item.costAtTransaction * item.quantity), 0);
        }
      } else if (tx.type === TransactionType.EXPENSE) {
        expenses += tx.totalAmount;
      }
    });

    const inventoryValue = products.reduce((sum, p) => sum + (p.stock * p.buyPrice), 0);
    const lowStockCount = products.filter(p => p.stock <= 5).length;

    setSummary({
      totalRevenue: revenue,
      totalCOGS: cogs,
      totalExpenses: expenses,
      netProfit: revenue - cogs - expenses,
      lowStockCount,
      inventoryValue
    });
  }, [transactions, products]);

  const handleTransaction = (cartItems: { product: Product; qty: number }[]) => {
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.sellPrice * item.qty), 0);
    
    // Create new Transaction
    const newTx: Transaction = {
      id: `TRX-${1000 + transactions.length + 1}`,
      date: new Date().toISOString(),
      type: TransactionType.SALE,
      totalAmount,
      description: `Penjualan Kasir (${cartItems.length} items)`,
      items: cartItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.qty,
        priceAtTransaction: item.product.sellPrice,
        costAtTransaction: item.product.buyPrice
      }))
    };

    // Update Products Stock
    const updatedProducts = products.map(p => {
      const cartItem = cartItems.find(c => c.product.id === p.id);
      if (cartItem) {
        return { ...p, stock: p.stock - cartItem.qty };
      }
      return p;
    });

    setTransactions(prev => [newTx, ...prev]);
    setProducts(updatedProducts);
    setCurrentView('dashboard'); // Redirect to dashboard after sale
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard summary={summary} recentTransactions={transactions.slice(0, 10)} />;
      case 'inventory':
        return <Inventory products={products} />;
      case 'pos':
        return <POS products={products} onProcessTransaction={handleTransaction} />;
      case 'journal':
        return <Journal transactions={transactions} />;
      case 'ai-advisor':
        return <AIAdvisor summary={summary} recentTransactions={transactions} products={products} />;
      default:
        return <Dashboard summary={summary} recentTransactions={transactions} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {currentView === 'dashboard' ? 'Overview Bisnis' : 
               currentView === 'inventory' ? 'Stok Barang' :
               currentView === 'pos' ? 'Kasir' :
               currentView === 'journal' ? 'Buku Besar & Jurnal' : 'Konsultasi AI'}
            </h1>
            <p className="text-slate-500 text-sm">Update terakhir: {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-right hidden sm:block">
               <p className="text-sm font-semibold text-slate-800">Administrator</p>
               <p className="text-xs text-slate-500">Finance Dept.</p>
             </div>
             <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold">
               AD
             </div>
          </div>
        </header>
        {renderView()}
      </main>
    </div>
  );
}