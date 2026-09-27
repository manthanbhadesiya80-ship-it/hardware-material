import React from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { openWhatsAppEnquiry } = useStore();

  return (
    <button
      onClick={() => openWhatsAppEnquiry()}
      className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-40 bg-[#25D366] hover:bg-[#1EBE5D] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:shadow-green-900/30 flex items-center gap-2.5 transition-all transform hover:scale-105 group"
      aria-label="Contact Devshree on WhatsApp"
      title="Contact Devshree on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
      <span className="hidden sm:inline text-xs font-bold tracking-wide">
        WhatsApp Us
      </span>
    </button>
  );
};
