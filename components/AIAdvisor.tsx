import React, { useState } from 'react';
import { FinancialSummary, Product, Transaction } from '../types';
import { analyzeFinancials } from '../services/geminiService';
import { Sparkles, Send, Loader2 } from 'lucide-react';

interface AIAdvisorProps {
  summary: FinancialSummary;
  recentTransactions: Transaction[];
  products: Product[];
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({ summary, recentTransactions, products }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleAskAI = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const result = await analyzeFinancials(summary, recentTransactions, products, query);
    setResponse(result);
    setLoading(false);
  };

  const suggestions = [
    "Analisis performa penjualan minggu ini",
    "Produk apa yang memberikan margin laba tertinggi?",
    "Apakah arus kas saya sehat?",
    "Saran untuk mengurangi biaya operasional"
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
        <h2 className="text-3xl font-bold flex items-center gap-3 mb-2">
          <Sparkles className="text-yellow-300" />
          AI Financial Advisor
        </h2>
        <p className="text-blue-100 opacity-90 max-w-2xl">
          Tanyakan apa saja mengenai kesehatan finansial tokomu. Saya akan menganalisis data jurnal, inventaris, dan transaksi untuk memberikan wawasan akuntansi yang mendalam.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Contoh: Bagaimana cara meningkatkan margin keuntungan bulan depan?"
            className="flex-1 border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
          />
          <button
            onClick={handleAskAI}
            disabled={loading || !query}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
            Analisis
          </button>
        </div>

        {/* Quick Suggestions */}
        {!response && (
           <div className="space-y-3">
             <p className="text-sm text-slate-500 font-medium">Saran pertanyaan:</p>
             <div className="flex flex-wrap gap-2">
               {suggestions.map((s, idx) => (
                 <button
                   key={idx}
                   onClick={() => setQuery(s)}
                   className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm px-3 py-2 rounded-full transition-colors"
                 >
                   {s}
                 </button>
               ))}
             </div>
           </div>
        )}

        {/* Response Area */}
        {response && (
          <div className="mt-8 animate-fade-in">
             <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
               <div className="flex items-center gap-2 mb-4">
                 <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                   <Sparkles size={16} />
                 </div>
                 <h3 className="font-bold text-slate-800">Hasil Analisis</h3>
               </div>
               <div className="prose prose-slate text-slate-700 max-w-none whitespace-pre-wrap leading-relaxed">
                 {response}
               </div>
             </div>
             <button 
                onClick={() => { setResponse(''); setQuery(''); }}
                className="mt-4 text-sm text-slate-500 hover:text-slate-800 underline"
             >
                Reset Percakapan
             </button>
          </div>
        )}
      </div>
    </div>
  );
};