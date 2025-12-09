import React, { useMemo } from 'react';
import { Transaction, LedgerEntry, TransactionType } from '../types';

interface JournalProps {
  transactions: Transaction[];
}

export const Journal: React.FC<JournalProps> = ({ transactions }) => {
  // Logic to convert Transactions to Double-Entry Ledger format
  const ledgerEntries = useMemo(() => {
    const entries: LedgerEntry[] = [];
    let idCounter = 1;

    transactions.forEach(tx => {
      // 1. Entry for Sales (Revenue vs Cash/Bank)
      if (tx.type === TransactionType.SALE) {
        // Debit Cash
        entries.push({
          id: `LE-${idCounter++}`,
          date: tx.date,
          refId: tx.id,
          description: `Penerimaan Penjualan (${tx.description || 'POS'})`,
          account: '101 - Kas / Bank',
          debit: tx.totalAmount,
          credit: 0
        });
        // Credit Revenue
        entries.push({
          id: `LE-${idCounter++}`,
          date: tx.date,
          refId: tx.id,
          description: `Pendapatan Penjualan`,
          account: '401 - Pendapatan Usaha',
          debit: 0,
          credit: tx.totalAmount
        });

        // 2. Entry for COGS (HPP vs Inventory) - Perpetual Method
        if (tx.items) {
          const totalCost = tx.items.reduce((sum, item) => sum + (item.costAtTransaction * item.quantity), 0);
          
          // Debit COGS
          entries.push({
            id: `LE-${idCounter++}`,
            date: tx.date,
            refId: tx.id,
            description: `Beban Pokok Penjualan`,
            account: '501 - Harga Pokok Penjualan',
            debit: totalCost,
            credit: 0
          });
          // Credit Inventory
          entries.push({
            id: `LE-${idCounter++}`,
            date: tx.date,
            refId: tx.id,
            description: `Pengurangan Stok`,
            account: '105 - Persediaan Barang',
            debit: 0,
            credit: totalCost
          });
        }
      } 
      else if (tx.type === TransactionType.PURCHASE) {
          // Simplification for demo: Cash Purchase
          entries.push({
            id: `LE-${idCounter++}`,
            date: tx.date,
            refId: tx.id,
            description: `Pembelian Stok`,
            account: '105 - Persediaan Barang',
            debit: tx.totalAmount,
            credit: 0
          });
          entries.push({
            id: `LE-${idCounter++}`,
            date: tx.date,
            refId: tx.id,
            description: `Pembayaran Tunai`,
            account: '101 - Kas / Bank',
            debit: 0,
            credit: tx.totalAmount
          });
      }
      else if (tx.type === TransactionType.EXPENSE) {
          entries.push({
            id: `LE-${idCounter++}`,
            date: tx.date,
            refId: tx.id,
            description: tx.description,
            account: '601 - Beban Operasional',
            debit: tx.totalAmount,
            credit: 0
          });
          entries.push({
            id: `LE-${idCounter++}`,
            date: tx.date,
            refId: tx.id,
            description: `Pembayaran Beban`,
            account: '101 - Kas / Bank',
            debit: 0,
            credit: tx.totalAmount
          });
      }
    });

    // Sort by ID (reverse chronological usually better for journals, but standard is chronological)
    return entries.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions]);

  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Jurnal Umum</h2>
        <button className="text-sm bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-1 rounded">
          Export Excel
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 w-32">Tanggal</th>
              <th className="px-4 py-3 w-24">Ref ID</th>
              <th className="px-4 py-3">Akun / Keterangan</th>
              <th className="px-4 py-3 text-right w-40">Debit</th>
              <th className="px-4 py-3 text-right w-40">Kredit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ledgerEntries.map((entry) => (
              <tr key={entry.id} className="hover:bg-slate-50">
                <td className="px-4 py-2 text-slate-500">{new Date(entry.date).toLocaleDateString('id-ID')}</td>
                <td className="px-4 py-2 text-slate-400 text-xs font-mono">{entry.refId}</td>
                <td className="px-4 py-2">
                  <div className={`font-medium ${entry.credit > 0 ? 'pl-8 text-slate-600' : 'text-slate-800'}`}>
                    {entry.account}
                  </div>
                  <div className={`text-xs text-slate-400 ${entry.credit > 0 ? 'pl-8' : ''}`}>
                    {entry.description}
                  </div>
                </td>
                <td className="px-4 py-2 text-right font-mono text-slate-700">
                  {entry.debit > 0 ? formatRupiah(entry.debit) : '-'}
                </td>
                <td className="px-4 py-2 text-right font-mono text-slate-700">
                  {entry.credit > 0 ? formatRupiah(entry.credit) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {ledgerEntries.length === 0 && (
          <div className="p-8 text-center text-slate-500">Belum ada transaksi jurnal.</div>
        )}
      </div>
    </div>
  );
};