/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Switzer', 'system-ui', 'sans-serif'],
        display: ['Switzer', 'system-ui', 'sans-serif'],
        body: ['Switzer', 'system-ui', 'sans-serif'],
      },
      colors: {
        'versyo': {
          'cream': '#f8f6f1',       // crema suave (color 1)
          'light': '#e1eae5',       // verde claro (color 2)
          'mint': '#a7d7b8',        // verde menta (color 3)
          'primary': '#66b2a0',     // turquesa/aqua (color 4 - principal)
          'dark': '#4e796b',        // verde oscuro (color 5)
          'hover': '#5a9d8d',       // hover state del primary
          'black': '#1a1a1a',       // negro para textos
          'accent': '#a7d7b8',      // accent = mint
          'deep': '#2d4640',        // profundo para fondos oscuros
        },
        'neutral': {
          '50': '#f9fafb',
          '100': '#f3f4f6',
          '200': '#e5e7eb',
          '300': '#d1d5db',
          '400': '#9ca3af',
          '500': '#6b7280',
          '600': '#4b5563',
          '700': '#374151',
          '800': '#1f2937',
          '900': '#111827',
        },
      },
      boxShadow: {
        'elegant': '0 4px 20px rgba(0, 0, 0, 0.08)',
        'card': '0 2px 10px rgba(0, 0, 0, 0.05)',
        'hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}