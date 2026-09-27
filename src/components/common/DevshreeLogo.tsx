import React from 'react';
import { useStore } from '../../context/StoreContext';

interface DevshreeLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  inverted?: boolean;
  customLogoUrl?: string;
}

export const DevshreeLogo: React.FC<DevshreeLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  inverted = false,
  customLogoUrl
}) => {
  // Height configurations
  const heightClasses = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-16',
    xl: 'h-20'
  };

  const primaryBlue = inverted ? '#FFFFFF' : '#124DA6';
  const brandOrange = '#E87500';
  const taglineColor = inverted ? '#E2E8F0' : '#15191F';

  // Read logo from store settings if available
  let activeLogoUrl = customLogoUrl;
  let activeTagline = 'The Hardware Gallery';
  let activeBrandName = 'Devshree - The Hardware Gallery';

  try {
    const store = useStore();
    if (!activeLogoUrl && store.settings?.logoUrl && store.settings.logoUrl.trim() !== '') {
      activeLogoUrl = store.settings.logoUrl.trim();
    }
    if (store.settings?.tagline) {
      activeTagline = store.settings.tagline;
    }
    if (store.settings?.businessName) {
      activeBrandName = store.settings.businessName;
    }
  } catch {
    // If rendered outside StoreProvider fallback gracefully
  }

  const [imageError, setImageError] = React.useState(false);

  // If a custom logo URL is uploaded or provided, display the image
  if (activeLogoUrl && !imageError) {
    return (
      <div className={`inline-flex flex-col items-start select-none ${className}`}>
        <img
          src={activeLogoUrl}
          alt={activeBrandName}
          onError={() => setImageError(true)}
          className={`${heightClasses[size]} w-auto object-contain transition-transform duration-200 hover:scale-[1.02]`}
        />
        {showTagline && activeTagline && (
          <span
            className={`text-[10px] font-bold tracking-wider mt-1 ${
              inverted ? 'text-gray-200' : 'text-gray-800'
            }`}
          >
            {activeTagline}
          </span>
        )}
      </div>
    );
  }

  // Default Authentic Devshree Vector Logo (Royal Blue "Dev", Saffron Orange "श्री" with Ganesha auspicious curve)
  return (
    <div className={`inline-flex flex-col items-start select-none ${className}`}>
      <svg
        viewBox="0 0 260 82"
        className={`${heightClasses[size]} w-auto transition-transform duration-200 hover:scale-[1.02]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Devshree - The Hardware Gallery"
      >
        {/* Top Horizontal Bar in Saffron Orange */}
        <path
          d="M106 33.5 H232"
          stroke={brandOrange}
          strokeWidth="4.8"
          strokeLinecap="round"
        />

        {/* Dev Text - Hand-crafted stylized royal blue script */}
        <g fill={primaryBlue}>
          {/* Letter D */}
          <path
            d="M20 56 C28 54 44 48 58 38 C74 27 96 15 106 20 C114 24 112 34 104 42 C92 53 70 60 48 61 C34 61.5 22 60 16 57 Z
               M36 53 C52 52 74 46 88 38 C96 33 98 28 94 26 C88 23 74 30 58 40 C46 47 39 51 36 53 Z"
            fillRule="evenodd"
          />
          {/* Swash tail of D */}
          <path
            d="M16 57 C24 55 42 54 60 52 C45 54 28 56 12 60 C8 61 5 62 4 60 C3 57 7 53 14 47 C25 38 42 28 58 20 C64 17 68 18 64 21 C52 28 32 40 20 52 C18 54 16 55 16 57 Z"
          />

          {/* Letter e */}
          <path
            d="M90 49 C89 42 94 36 103 36 C112 36 117 41 116 48 C115 54 107 58 97 58 C86 58 82 50 83 45 C84 39 90 33 99 30 C108 27 118 29 119 35 C120 40 116 45 111 47 C104 49 97 49 90 49 Z
               M92 46 C97 46 104 45 108 43 C111 41 112 38 109 37 C105 36 99 39 94 43 C93 44 92 45 92 46 Z"
            fillRule="evenodd"
          />

          {/* Letter v */}
          <path
            d="M122 36 C124 36 126 39 127 43 C129 48 132 54 135 57 C138 60 142 59 146 54 C151 48 156 39 161 32 C163 29 166 30 165 33 C159 44 151 57 143 61 C135 65 129 61 125 54 C122 48 119 40 119 37 C119 35 120 35 122 36 Z"
          />
        </g>

        {/* Devanagari "श्री" in Saffron Orange with Auspicious Ganesha Loop */}
        <g fill={brandOrange} stroke={brandOrange}>
          {/* Main Sh loop with curve */}
          <path
            d="M168 33.5 C168 33.5 174 42 181 45 C187 48 190 46 189 41 C188 36 182 34 177 34 C170 34 163 38 160 45 C156 53 158 64 167 70 C175 76 186 76 193 70 C198 66 200 58 195 53 C191 49 184 50 181 54 C178 58 180 62 183 63 C187 64 189 61 189 59 C189 57 186 56 184 57 C183 58 183 59 184 60 C185 61 187 60 186 59 C185 58 184 58 184 59"
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Ganesha eye/tilak dot inside loop */}
          <circle cx="178" cy="54" r="1.8" fill={brandOrange} />

          {/* Diagonal connecting stroke for 'ra' stroke */}
          <path
            d="M174 43 L158 59"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Vertical stem of 'श्री' */}
          <path
            d="M198 33.5 V65"
            strokeWidth="4.2"
            strokeLinecap="round"
          />

          {/* Dirgha 'ee' matra (ी) looping gracefully from top right down */}
          <path
            d="M198 35 C200 24 212 18 220 22 C227 26 226 36 226 65"
            strokeWidth="4.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Foot flourish on vertical stem */}
          <path
            d="M222 65 H230"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>

        {/* The Hardware Gallery Subtitle */}
        {showTagline && (
          <text
            x="48"
            y="76"
            fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="700"
            fontSize="10.8"
            letterSpacing="0.08em"
            fill={taglineColor}
          >
            {activeTagline}
          </text>
        )}
      </svg>
    </div>
  );
};
