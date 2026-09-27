import React, { useState } from 'react';
import { Product } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { AlertTriangle, Plus, Minus, Search, CheckCircle2, RotateCcw, Trash2 } from 'lucide-react';

export const AdminInventoryTab: React.FC<{
  products: Product[];
  onRefresh: () => void;
}> = ({ products, onRefresh }) => {
  const { showToast } = useStore();
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');
  const [search, setSearch] = useState('');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filtered = products.filter(p => {
    if (filterMode === 'low' && p.stock > p.lowStockThreshold) return false;
    if (filterMode === 'out' && p.stock > 0) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const handleAdjustStock = async (product: Product, delta: number) => {
    const newStock = Math.max(0, product.stock + delta);
    try {
      await api.updateProduct(product.id, { stock: newStock });
      showToast(`Updated stock for ${product.sku} to ${newStock}`, 'info');
      onRefresh();
    } catch {
      showToast('Failed to update inventory', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteProduct(productToDelete.id);
      showToast(`Product "${productToDelete.name}" deleted successfully`, 'info');
      setProductToDelete(null);
      onRefresh();
    } catch {
      showToast('Could not delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by product name or SKU..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex gap-1.5 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                filterMode === 'all' ? 'bg-[#124DA6] text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              All Items ({products.length})
            </button>
            <button
              onClick={() => setFilterMode('low')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1 ${
                filterMode === 'low' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Low Stock ({products.filter(p => p.stock <= p.lowStockThreshold).length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Hardware SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Stock</th>
                <th className="py-3 px-4">Threshold</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Quick Stock Adjust</th>
                <th className="py-3 px-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => {
                const isOut = p.stock === 0;
                const isLow = p.stock > 0 && p.stock <= p.lowStockThreshold;

                return (
                  <tr key={p.id} className="hover:bg-blue-50/30">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img src={p.images[0]} alt="" className="w-8 h-8 rounded object-cover border p-0.5" />
                        <div>
                          <strong className="text-gray-900 block truncate max-w-xs">{p.name}</strong>
                          <span className="text-[10px] text-gray-400">SKU: {p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{p.category}</td>
                    <td className="py-3 px-4 font-black text-gray-900 text-sm">{p.stock}</td>
                    <td className="py-3 px-4 text-gray-500">{p.lowStockThreshold} units</td>
                    <td className="py-3 px-4">
                      {isOut ? (
                        <span className="text-[10px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="text-[10px] font-black uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Healthy
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="inline-flex items-center gap-1.5 border border-gray-200 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(p, -5)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-bold"
                          title="Subtract 5 units"
                        >
                          -5
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(p, -1)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-bold"
                          title="Subtract 1 unit"
                        >
                          -1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(p, +1)}
                          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-bold"
                          title="Add 1 unit"
                        >
                          +1
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdjustStock(p, +10)}
                          className="px-2 py-1 bg-[#124DA6] text-white hover:bg-[#083B82] rounded font-bold"
                          title="Restock 10 units"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setProductToDelete(p)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Product from Inventory"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        title="Delete Hardware Product?"
        message={`Are you sure you want to permanently delete "${productToDelete?.name}" (SKU: ${productToDelete?.sku}) from inventory?`}
        confirmText="Yes, Delete Product"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProductToDelete(null)}
      />
    </div>
  );
};
