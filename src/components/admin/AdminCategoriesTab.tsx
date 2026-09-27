import React, { useState } from 'react';
import { Category } from '../../types';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { ConfirmModal } from '../common/ConfirmModal';
import { Plus, Edit2, Trash2, X, Save, Layers, CheckCircle2, Power, Eye, EyeOff } from 'lucide-react';

export const AdminCategoriesTab: React.FC<{
  categories: Category[];
  onRefresh: () => void;
}> = ({ categories, onRefresh }) => {
  const { showToast } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<Partial<Category> | null>(null);
  const [catToDelete, setCatToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenAdd = () => {
    setEditingCat({
      name: '',
      slug: '',
      description: 'Architectural hardware fittings.',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      iconName: 'Wrench',
      subcategories: ['General Hardware'],
      itemCount: 0,
      displayOrder: categories.length + 1,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCat({ ...c });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (cat: Category) => {
    try {
      const nextActive = cat.isActive === false ? true : false;
      await api.updateCategory(cat.id, { ...cat, isActive: nextActive });
      showToast(
        `Category "${cat.name}" is now ${nextActive ? 'Active (Live)' : 'Paused (Hidden)'}`,
        'success'
      );
      onRefresh();
    } catch {
      showToast('Failed to update category status', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!catToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteCategory(catToDelete.id);
      showToast(`Category "${catToDelete.name}" deleted successfully`, 'info');
      setCatToDelete(null);
      onRefresh();
    } catch {
      showToast('Failed to delete category', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat?.name) return;

    try {
      if (editingCat.id) {
        await api.updateCategory(editingCat.id, editingCat);
        showToast('Category updated successfully', 'success');
      } else {
        await api.createCategory(editingCat);
        showToast('Category created successfully', 'success');
      }
      setIsModalOpen(false);
      onRefresh();
    } catch {
      showToast('Failed to save category', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div>
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#124DA6]" />
            <span>Hardware Departments & Categories ({categories.length})</span>
          </h3>
          <p className="text-[11px] text-gray-500">
            Manage product collections, storefront visibility, ordering, and subcategories.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#124DA6] hover:bg-[#083B82] text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(cat => {
          const isCatActive = cat.isActive !== false;

          return (
            <div
              key={cat.id}
              className={`bg-white p-4 rounded-2xl border transition-all shadow-2xs flex flex-col justify-between ${
                isCatActive ? 'border-gray-200' : 'border-dashed border-gray-300 bg-gray-50/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className={`w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0 ${
                    !isCatActive ? 'opacity-50 grayscale' : ''
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="font-bold text-gray-900 text-sm truncate">{cat.name}</h4>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(cat)}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition-colors ${
                        isCatActive
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      }`}
                      title={isCatActive ? 'Click to pause category' : 'Click to start/activate category'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isCatActive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                      <span>{isCatActive ? 'Active' : 'Paused'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-gray-500 line-clamp-2">{cat.description}</p>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {cat.subcategories.map((sub, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 text-[10px] px-1.5 py-0.2 rounded font-medium">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>Order: #{cat.displayOrder}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(cat)}
                    className="p-1.5 text-gray-600 hover:text-[#124DA6] hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit Category Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCatToDelete(cat)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal (Reliable in sandboxed iframes) */}
      <ConfirmModal
        isOpen={Boolean(catToDelete)}
        title="Delete Hardware Category?"
        message={`Are you sure you want to remove "${catToDelete?.name}" from your catalog? Products assigned to this category will remain in the database.`}
        confirmText="Yes, Delete Category"
        cancelText="Keep Category"
        confirmVariant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCatToDelete(null)}
      />

      {/* Edit / Create Modal */}
      {isModalOpen && editingCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">{editingCat.id ? 'Edit Category' : 'Create Category'}</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Category Title *</label>
                <input
                  type="text"
                  required
                  value={editingCat.name || ''}
                  onChange={e => setEditingCat({ ...editingCat, name: e.target.value })}
                  placeholder="e.g. Bed Fittings & Hydraulic Lifts"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-[#124DA6]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingCat.image || ''}
                  onChange={e => setEditingCat({ ...editingCat, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-[#124DA6]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Subcategories (Comma separated)</label>
                <input
                  type="text"
                  value={(editingCat.subcategories || []).join(', ')}
                  onChange={e => setEditingCat({ ...editingCat, subcategories: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                  placeholder="e.g. Heavy Duty Lifts, Gas Springs, End Hinges"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-[#124DA6]"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingCat.description || ''}
                  onChange={e => setEditingCat({ ...editingCat, description: e.target.value })}
                  placeholder="Brief summary of hardware items in this category"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:border-[#124DA6]"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="catIsActive"
                  checked={editingCat.isActive !== false}
                  onChange={e => setEditingCat({ ...editingCat, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#124DA6] rounded border-gray-300"
                />
                <label htmlFor="catIsActive" className="font-bold text-gray-800 text-xs cursor-pointer">
                  Category is Active (Live on Storefront)
                </label>
              </div>
              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#124DA6] hover:bg-[#083B82] text-white rounded-lg font-bold shadow-xs transition-colors"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
