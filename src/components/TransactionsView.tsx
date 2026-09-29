import React, { useEffect, useState } from 'react';
import { Receipt, Search, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TransactionsView() {
  const [data, setData] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('ALL');
  const [method, setMethod] = useState('ALL');
  const [provider, setProvider] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const fetchTxs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '25',
        status,
        payment_method: method,
        provider,
        search
      });
      const res = await fetch(`/api/transactions?${params}`);
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTxs();
  }, [page, status, method, provider, search]);

  const summary = data?.summary || {
    total_transactions: 0,
    successful_transactions: 0,
    failed_transactions: 0,
    failure_rate: 0.0,
    revenue_at_risk: 0
  };

  const transactions = data?.transactions || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-2xl border border-gray-800">
        <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
          <Receipt className="w-5 h-5 text-blue-400" />
          <span>Real-Time Payment Transactions Ledger</span>
        </h2>
        <p className="text-xs text-gray-400">Canonical database ledger monitoring 10,500+ merchant transaction events</p>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
        <div className="glass-panel p-4 rounded-xl border border-gray-800">
          <span className="text-gray-400">Total Transactions</span>
          <p className="text-lg font-extrabold text-white mt-0.5">{summary.total_transactions?.toLocaleString()}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-emerald-500/20 bg-emerald-950/10">
          <span className="text-gray-400">Successful</span>
          <p className="text-lg font-extrabold text-emerald-400 mt-0.5">{summary.successful_transactions?.toLocaleString()}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-rose-500/20 bg-rose-950/10">
          <span className="text-gray-400">Failed / Abandoned</span>
          <p className="text-lg font-extrabold text-rose-400 mt-0.5">{summary.failed_transactions?.toLocaleString()}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-amber-500/20 bg-amber-950/10">
          <span className="text-gray-400">Failure Rate</span>
          <p className="text-lg font-extrabold text-amber-400 mt-0.5">{summary.failure_rate}%</p>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-blue-500/20 bg-blue-950/10">
          <span className="text-gray-400">Revenue At Risk</span>
          <p className="text-lg font-extrabold text-blue-400 mt-0.5">₹{summary.revenue_at_risk?.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-xl border border-gray-800 flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 px-3 py-1.5 rounded-lg text-xs">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Transaction ID..."
              className="bg-transparent text-white focus:outline-none w-36"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
            <option value="ABANDONED">ABANDONED</option>
          </select>

          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="CARD">CARD</option>
            <option value="NETBANKING">NETBANKING</option>
            <option value="WALLET">WALLET</option>
          </select>

          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="bg-gray-900 border border-gray-700 text-white text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Providers</option>
            <option value="HDFC">HDFC</option>
            <option value="ICICI">ICICI</option>
            <option value="SBI">SBI</option>
            <option value="AXIS">AXIS</option>
            <option value="RAZORPAY_GATEWAY">RAZORPAY_GATEWAY</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-gray-400">Page {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={transactions.length < 25}
            className="p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-panel rounded-2xl border border-gray-800 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-blue-400">Loading transactions from database...</div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-gray-400">No transactions found matching your filters.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-900 text-gray-400 uppercase font-semibold">
              <tr>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Provider</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Failure Code</th>
                <th className="p-3.5">OS / Device</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-200">
              {transactions.map((tx: any) => (
                <tr key={tx.id} className="hover:bg-gray-800/40 font-mono">
                  <td className="p-3.5 font-bold text-white">{tx.transaction_id}</td>
                  <td className="p-3.5">{tx.payment_method}</td>
                  <td className="p-3.5 text-gray-400">{tx.payment_provider}</td>
                  <td className="p-3.5 font-bold text-gray-100">₹{tx.amount?.toLocaleString()}</td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                      tx.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' :
                      tx.status === 'FAILED' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-rose-400">{tx.failure_code || '-'}</td>
                  <td className="p-3.5 text-gray-400">{tx.os} ({tx.device})</td>
                  <td className="p-3.5 text-right font-sans">
                    <button
                      onClick={() => setSelectedTx(tx)}
                      className="px-2.5 py-1 rounded bg-gray-800 hover:bg-gray-700 text-blue-400 font-semibold text-[11px]"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1322] border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center pb-3 border-b border-gray-800">
              <span className="font-bold text-white text-sm">Transaction {selectedTx.transaction_id}</span>
              <button onClick={() => setSelectedTx(null)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                <span className="text-gray-500">Merchant ID:</span>
                <span className="text-white">{selectedTx.merchant_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="text-emerald-400 font-bold">₹{selectedTx.amount?.toLocaleString()} INR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method:</span>
                <span className="text-white">{selectedTx.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Provider / Bank:</span>
                <span className="text-white">{selectedTx.payment_provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className={selectedTx.status === 'SUCCESS' ? 'text-emerald-400' : 'text-rose-400'}>{selectedTx.status}</span>
              </div>
              {selectedTx.failure_code && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Failure Code:</span>
                  <span className="text-rose-400 font-bold">{selectedTx.failure_code}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Device & OS:</span>
                <span className="text-white">{selectedTx.device} / {selectedTx.os}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Location:</span>
                <span className="text-white">{selectedTx.city}, {selectedTx.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Timestamp:</span>
                <span className="text-gray-400">{new Date(selectedTx.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-800 flex justify-end">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-sans font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
