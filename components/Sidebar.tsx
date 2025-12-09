import React from 'react';
import { LayoutDashboard, ShoppingCart, Package, BookOpen, BrainCircuit } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setView: (view: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'inventory', label: 'Inventaris', icon: Package },
    { id: 'pos', label: 'Kasir (POS)', icon: ShoppingCart },
    { id: 'journal', label: 'Jurnal Umum', icon: BookOpen },
    { id: 'ai-advisor', label: 'AI Akuntan', icon: BrainCircuit },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-full fixed left-0 top-0 z-10 shadow-xl">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">E</div>
          ElectroLedger
        </h1>
        <p className="text-xs text-slate-400 mt-1">Sistem Akuntansi Toko</p>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentView === item.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800 p-3 rounded text-xs text-slate-400">
          <p>Login sebagai:</p>
          <p className="font-semibold text-white">Kepala Akuntan</p>
        </div>
      </div>
    </div>
  );
};