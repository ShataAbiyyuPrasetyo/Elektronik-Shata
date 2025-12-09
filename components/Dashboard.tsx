import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartTooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Package } from 'lucide-react';
import { FinancialSummary, Transaction } from '../types';

interface DashboardProps {
  summary: FinancialSummary;
  recentTransactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ summary, recentTransactions }) => {
  // Mock data for the chart based on summary (in a real app, this would be historical)
  const chartData = [
    { name: 'Pendapatan', amount: summary.totalRevenue, fill: '#3b82f6' },
    { name: 'HPP (COGS)', amount: summary.totalCOGS, fill: '#f59e0b' },
    { name: 'Beban Ops', amount: summary.totalExpenses, fill: '#ef4444' },
    { name: 'Laba Bersih', amount: summary.netProfit, fill: '#10b981' },
  ];

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800">Dashboard Keuangan</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Pendapatan</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatRupiah(summary.totalRevenue)}</h3>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <DollarSign size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Laba Bersih</p>
              <h3 className={`text-2xl font-bold mt-1 ${summary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatRupiah(summary.netProfit)}
              </h3>
            </div>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Nilai Persediaan</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatRupiah(summary.inventoryValue)}</h3>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <Package size={20} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Beban Operasional</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{formatRupiah(summary.totalExpenses)}</h3>
            </div>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <TrendingDown size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Ringkasan Laba Rugi</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <RechartTooltip formatter={(value: number) => formatRupiah(value)} />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-semibold mb-4 text-slate-800">Transaksi Terakhir</h3>
          <div className="overflow-auto max-h-64">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-slate-500 font-medium">Tanggal</th>
                  <th className="px-4 py-2 text-left text-slate-500 font-medium">Tipe</th>
                  <th className="px-4 py-2 text-right text-slate-500 font-medium">Jumlah</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="px-4 py-2 text-slate-600">{new Date(tx.date).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type === 'PENJUALAN' ? 'bg-blue-100 text-blue-700' :
                        tx.type === 'PEMBELIAN' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right font-medium text-slate-700">
                      {formatRupiah(tx.totalAmount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};