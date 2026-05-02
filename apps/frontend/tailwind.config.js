/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary brand colors (from Petpooja screenshots)
        brand: {
          red: '#E53935',      // Primary red (New Order button, active states)
          darkRed: '#C62828',  // Hover state
          green: '#4CAF50',    // Success / Printed table
          blue: '#2196F3',     // Running table
          yellow: '#FFC107',   // Warnings / Running KOT
          orange: '#FF9800',   // Paid table
        },
        // UI colors
        sidebar: {
          bg: '#424242',       // Dark sidebar background
          text: '#FFFFFF',
          hover: '#616161',
          active: '#757575',
        },
        // Table status colors (from screenshot)
        table: {
          blank: '#E5E7EB',
          running: '#93C5FD',
          printed: '#86EFAC',
          paid: '#FDBA74',
          runningKot: '#FDE68A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
