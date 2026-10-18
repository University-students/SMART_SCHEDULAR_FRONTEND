/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [],
  // The existing UniSchedule styles in index.css already include their own reset,
  // so Tailwind's preflight is turned off to avoid changing how current pages look.
  corePlugins: { preflight: false },
};
