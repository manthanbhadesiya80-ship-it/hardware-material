import React from 'react';
import { useStore, PageRoute } from '../../context/StoreContext';
import { Home, Grid, Search, ShoppingBag, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { currentPage, setCurrentPage, cartCount } = useStore();

  const navItems: { label: string; page: PageRoute; icon: React.ReactNode; badge?: number }[] = [
    { label: 'Home', page: 'home', icon: <Home className="w-5 h-5" /> },
    { label: 'Categories', page: 'shop', icon: <Grid className="w-5 h-5" /> },
    { label: 'Search', page: 'shop', icon: <Search className="w-5 h-5" /> },
    { label: 'Cart', page: 'cart', icon: <ShoppingBag className="w-5 h-5" />, badge: cartCount },
    { label: 'Orders', page: 'my-orders', icon: <User className="w-5 h-5" /> }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-2 py-1.5 shadow-lg safe-bottom">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map(item => {
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.label}
              onClick={() => setCurrentPage(item.page)}
              className={`flex flex-col items-center justify-center py-1 relative transition-colors ${
                isActive ? 'text-[#124DA6] font-bold' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <div className="relative">
                {item.icon}
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2 bg-[#E87500] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 leading-tight">{item.label}</span>
              {isActive && (
                <div className="w-4 h-0.5 bg-[#124DA6] rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
