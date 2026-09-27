import React from 'react';
import { Category } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const { setCurrentPage } = useStore();

  const activeCategories = categories
    .filter(c => c.isActive)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section className="py-8 sm:py-12 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6 sm:mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#E87500]">
              Browse Hardware Departments
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#083B82] tracking-tight">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => setCurrentPage('shop')}
            className="text-xs sm:text-sm font-bold text-[#124DA6] hover:text-[#083B82] flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Hardware</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Visual Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-5">
          {activeCategories.map(cat => (
            <div
              key={cat.id}
              onClick={() => setCurrentPage('category', { slug: cat.slug })}
              className="group relative bg-[#F7F9FC] hover:bg-white border border-gray-200 hover:border-[#124DA6]/40 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md flex flex-col"
            >
              {/* Category Image Box */}
              <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 p-2 relative">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {cat.itemCount} items
                </span>
              </div>

              {/* Title & Arrow */}
              <div className="p-3 flex items-center justify-between">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#124DA6] transition-colors leading-snug">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                    {cat.subcategories.slice(0, 2).join(', ')}
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full bg-white group-hover:bg-[#124DA6] group-hover:text-white border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 transition-colors">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
