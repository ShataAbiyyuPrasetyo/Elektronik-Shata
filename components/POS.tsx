import React, { useState } from 'react';
import { Product, TransactionType } from '../types';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';

interface POSProps {
  products: Product[];
  onProcessTransaction: (items: { product: Product; qty: number }[]) => void;
}

export const POS: React.FC<POSProps> = ({ products, onProcessTransaction }) => {
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  const addToCart = () => {
    if (!selectedProductId) return;
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    if (product.stock === 0) {
      alert("Stok habis!");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.qty + 1 > product.stock) {
           alert("Stok tidak mencukupi untuk menambah item ini.");
           return prev;
        }
        return prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { product, qty: 1 }];
    });
    setSelectedProductId('');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = item.qty + delta;
        if (newQty > item.product.stock) return item;
        if (newQty < 1) return item;
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.product.sellPrice * item.qty), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (confirm(`Proses transaksi penjualan senilai ${formatRupiah(calculateTotal())}?`)) {
      onProcessTransaction(cart);
      setCart([]);
    }
  };

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
      {/* Left Panel: Product Selection */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Point of Sales</h2>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <label className="block text-sm font-medium text-slate-700 mb-2">Pilih Produk</label>
           <div className="flex gap-2">
             <select
               className="flex-1 border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
               value={selectedProductId}
               onChange={(e) => setSelectedProductId(e.target.value)}
             >
               <option value="">-- Pilih Produk --</option>
               {products.map(p => (
                 <option key={p.id} value={p.id} disabled={p.stock === 0}>
                   {p.name} - Stok: {p.stock}
                 </option>
               ))}
             </select>
             <button
               onClick={addToCart}
               disabled={!selectedProductId}
               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
             >
               <Plus size={18} /> Tambah
             </button>
           </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.slice(0, 6).map(p => (
             <button
               key={p.id}
               onClick={() => {
                 setSelectedProductId(p.id);
               }}
               className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-left"
             >
               <p className="font-semibold text-slate-800 truncate">{p.name}</p>
               <p className="text-blue-600 text-sm">{formatRupiah(p.sellPrice)}</p>
               <p className="text-xs text-slate-500 mt-1">Stok: {p.stock}</p>
             </button>
          ))}
        </div>
      </div>

      {/* Right Panel: Cart */}
      <div className="lg:col-span-1 bg-white rounded-xl shadow-lg border border-slate-200 flex flex-col h-full">
        <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart size={20} /> Keranjang Belanja
          </h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-slate-400 mt-10">Keranjang kosong</div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-slate-800 text-sm">{item.product.name}</p>
                  <p className="text-xs text-slate-500">{formatRupiah(item.product.sellPrice)} x {item.qty}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.product.id, -1)} className="w-6 h-6 bg-white border rounded flex items-center justify-center text-slate-600 hover:bg-slate-100">-</button>
                  <span className="w-4 text-center text-sm">{item.qty}</span>
                  <button onClick={() => updateQty(item.product.id, 1)} className="w-6 h-6 bg-white border rounded flex items-center justify-center text-slate-600 hover:bg-slate-100">+</button>
                  <button onClick={() => removeFromCart(item.product.id)} className="ml-2 text-red-500 hover:text-red-700">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl">
          <div className="flex justify-between items-center mb-4">
             <span className="text-slate-600">Total</span>
             <span className="text-xl font-bold text-slate-900">{formatRupiah(calculateTotal())}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:shadow-none transition-all"
          >
            Proses Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
};