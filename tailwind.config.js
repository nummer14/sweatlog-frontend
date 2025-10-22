/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 👇 1. 기본 본문 폰트를 'Quicksand'로 설정합니다. (기존 코드 유지)f
        //    이제 별도로 폰트를 지정하지 않은 모든 텍스트는 Quicksand가 됩니다.
        sans: ['Quicksand', ...defaultTheme.fontFamily.sans],
        
        // 👇 2. 로고를 위한 'oswald' 폰트를 'font-oswald' 이라는 이름으로 추가합니다.
        oswald: ['oswald', 'sans-serif'],     
      },
      colors: {
        'brand-red-dark': '#990000', // 더 어두운 빨강 (예시 색상)
      }
    },
  },
  plugins: [],
}