/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        signal: '#2DD4FF',
        beacon: '#FFB454',
        pulse: '#8B6CFF',
        paper: '#E9EEF7',
        mist: '#8B96AC',
        void: '#060A12',
        accent: '#FF6B6B',
        success: '#4ADE80',
        warning: '#FBBF24',
        glass: 'rgba(13, 19, 32, 0.62)',
      },
      boxShadow: {
        panel: '0 8px 32px rgba(0,0,0,0.5)',
        glow: '0 0 12px rgba(45,212,255,0.6)',
        'glow-lg': '0 0 24px rgba(45,212,255,0.3)',
      },
      animation: {
        'fade-up': 'fadeUp 0.3s ease-out',
        'pulse-ring': 'pulseRing 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: 0.8 },
          '100%': { transform: 'scale(2.2)', opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};