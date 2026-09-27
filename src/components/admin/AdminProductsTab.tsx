import React, { useState } from 'react';
import { Product, Category } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { ConfirmModal } from '../common/ConfirmModal';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  CheckCircle2,
  AlertTriangle,
  X,
  Layers,
  Save,
  CheckSquare,
  Square,
  Image as ImageIcon
} from 'lucide-react';

interface AdminProductsTabProps {
  products: Product[];
  categories: Category[];
  onRefresh: () => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  products,
  categories,
  onRefresh
}) => {
  const { showToast } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);

  const filtered = products.filter(p => {
    if (selectedCat && p.category !== selectedCat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProduct({
      name: '',
      sku: 'DS-' + Math.floor(1000 + Math.random() * 9000),
      brand: 'Devshree Pro',
      category: categories[0]?.name || 'Furniture Hardware',
      price: 499,
      mrp: 799,
      discountPercentage: 35,
      stock: 50,
      lowStockThreshold: 10,
      images: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80'],
      description: 'Engineered hardware fitting manufactured with high precision.',
      shortDescription: 'Premium quality architectural fitting.',
      material: 'Cold Rolled Steel',
      specifications: { Warranty: '2 Years' },
      features: ['Corrosion resistant', 'Tested for 50,000 cycles'],
      isActive: true,
      tags: ['hardware']
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setIsModalOpen(true);
  };

  const handleDuplicate = async (product: Product) => {
    try {
      const dup = {
        ...product,
        name: `${product.name} (Copy)`,
        sku: `${product.sku}-COPY`,
        id: undefined
      };
      await api.createProduct(dup);
      showToast('Product duplicated successfully', 'success');
      onRefresh();
    } catch {
      showToast('Could not duplicate product', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteProduct(productToDelete.id);
      showToast(`Product "${productToDelete.name}" deleted successfully`, 'info');
      setProductToDelete(null);
      setSelectedProductIds(prev => prev.filter(id => id !== productToDelete.id));
      onRefresh();
    } catch {
      showToast('Could not delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    setIsBulkDeleting(true);
    try {
      await Promise.all(selectedProductIds.map(id => api.deleteProduct(id)));
      showToast(`Deleted ${selectedProductIds.length} products successfully`, 'info');
      setSelectedProductIds([]);
      setIsBulkDeleteModalOpen(false);
      onRefresh();
    } catch {
      showToast('Failed to delete selected products', 'error');
    } finally {
      setIsBulkDeleting(false);
    }
  };

  const toggleSelectProduct = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedProductIds.length === filtered.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filtered.map(p => p.id));
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;

    try {
      const discount = editingProduct.mrp && editingProduct.mrp > editingProduct.price
        ? Math.round(((editingProduct.mrp - editingProduct.price) / editingProduct.mrp) * 100)
        : 0;

      const payload = {
        ...editingProduct,
        discountPercentage: discount
      };

      if (editingProduct.id) {
        await api.updateProduct(editingProduct.id, payload);
        showToast('Product updated successfully', 'success');
      } else {
        await api.createProduct(payload as Product);
        showToast('New product created successfully', 'success');
      }
      setIsModalOpen(false);
      onRefresh();
    } catch (err: any) {
      showToast(err.message || 'Error saving product', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex flex-1 items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products by title, SKU, brand..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden focus:border-[#124DA6]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="text-xs px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl focus:outline-hidden"
          >
            <option value="">All Categories ({categories.length})</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="w-full sm:w-auto bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Bulk Delete Notification Strip */}
      {selectedProductIds.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 text-xs text-red-900 font-bold">
            <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-black">
              {selectedProductIds.length}
            </span>
            <span>
              {selectedProductIds.length} product{selectedProductIds.length > 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedProductIds([])}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-red-100/60 transition-colors"
            >
              Clear Selection
            </button>
            <button
              type="button"
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedProductIds.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedProductIds.length === filtered.length}
                    onChange={toggleSelectAll}
                    title="Select All Products"
                    className="w-4 h-4 text-[#124DA6] rounded border-gray-300 focus:ring-0 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Product Info</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / MRP</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Flags</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => {
                const isLowStock = p.stock <= p.lowStockThreshold;
                const isSelected = selectedProductIds.includes(p.id);

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-red-50/40' : 'hover:bg-blue-50/30'
                    }`}
                  >
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectProduct(p.id)}
                        className="w-4 h-4 text-[#124DA6] rounded border-gray-300 focus:ring-0 cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 rounded-lg object-contain bg-gray-50 border border-gray-200 p-1 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <h4 className="font-bold text-gray-900 truncate">{p.name}</h4>
                          <span className="text-[10px] text-gray-400">SKU: {p.sku} · {p.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-gray-700">{p.category}</td>
                    <td className="py-3 px-4">
                      <div className="font-black text-gray-900">₹{p.price}</div>
                      <div className="text-[10px] text-gray-400 line-through">₹{p.mrp}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`font-bold text-xs ${isLowStock ? 'text-red-600' : 'text-emerald-700'}`}>
                        {p.stock} units
                      </span>
                      {isLowStock && (
                        <span className="block text-[9px] font-black text-red-500 uppercase">
                          Low Stock Alert
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.isBestSeller && (
                          <span className="bg-blue-100 text-[#083B82] text-[9px] font-bold px-1.5 py-0.2 rounded">
                            Bestseller
                          </span>
                        )}
                        {p.isFeatured && (
                          <span className="bg-amber-100 text-[#E87500] text-[9px] font-bold px-1.5 py-0.2 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 text-gray-600 hover:text-[#124DA6] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Product Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDuplicate(p)}
                          className="p-1.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Duplicate Product"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(p)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 z-10 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">
                {editingProduct.id ? 'Edit Hardware Product' : 'Add New Hardware Product'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  placeholder="e.g. Devshree Hydraulic Bed Lift Mechanism 1500N"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124DA6] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">SKU / Model Number *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124DA6] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brand Name *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.brand || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124DA6] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={editingProduct.category || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124DA6] focus:outline-hidden"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Material</label>
                  <input
                    type="text"
                    value={editingProduct.material || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, material: e.target.value })}
                    placeholder="e.g. Cold Rolled High Tensile Steel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124DA6] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124DA6] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">MRP (₹) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.mrp || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, mrp: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124DA6] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124DA6] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Low Stock Limit</label>
                  <input
                    type="number"
                    value={editingProduct.lowStockThreshold || 10}
                    onChange={e => setEditingProduct({ ...editingProduct, lowStockThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124DA6] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Primary Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingProduct.images?.[0] || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124DA6] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-[#124DA6] focus:outline-hidden"
                />
              </div>

              {/* Toggles */}
              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isBestSeller)}
                    onChange={e => setEditingProduct({ ...editingProduct, isBestSeller: e.target.checked })}
                    className="rounded text-[#124DA6] border-gray-300"
                  />
                  <span className="font-semibold text-gray-800">Mark as Best Seller</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingProduct.isFeatured)}
                    onChange={e => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                    className="rounded text-[#124DA6] border-gray-300"
                  />
                  <span className="font-semibold text-gray-800">Featured Collection</span>
                </label>
              </div>

              {/* Modal Footer with Delete Option */}
              <div className="pt-3 border-t border-gray-200 flex items-center justify-between">
                <div>
                  {editingProduct.id && (
                    <button
                      type="button"
                      onClick={() => {
                        const prod = products.find(p => p.id === editingProduct.id) || (editingProduct as Product);
                        setIsModalOpen(false);
                        setProductToDelete(prod);
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
                      title="Permanently delete this product"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Product</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#124DA6] hover:bg-[#083B82] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Product</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Single Product Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        title="Delete Hardware Product?"
        message={`Are you sure you want to permanently delete "${productToDelete?.name}" (SKU: ${productToDelete?.sku}) from the catalog? This action cannot be undone.`}
        confirmText="Yes, Delete Product"
        cancelText="Cancel"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProductToDelete(null)}
      />

      {/* Bulk Products Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isBulkDeleteModalOpen}
        title={`Delete ${selectedProductIds.length} Selected Products?`}
        message={`Are you sure you want to permanently delete these ${selectedProductIds.length} hardware products from your database? This action cannot be undone.`}
        confirmText={`Yes, Delete ${selectedProductIds.length} Products`}
        cancelText="Keep Products"
        confirmVariant="danger"
        isLoading={isBulkDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setIsBulkDeleteModalOpen(false)}
      />
    </div>
  );
};
