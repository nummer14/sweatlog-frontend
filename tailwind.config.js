/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'; // 1. Tailwind의 기본 테마를 가져옵니다.

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 2. fontFamily를 확장하여 'sans' 기본 폰트를 재정의합니다.
      fontFamily: {
        // 'sans'는 sans-serif 폰트 그룹을 의미합니다.
        // 이제 font-sans 클래스는 'Pretendard' 폰트를 최우선으로 사용하게 됩니다.
        sans: ['Quicksand', ...defaultTheme.fontFamily.sans],
        logo: ['Quicksand', 'sans-serif'],        
      },
    },
  },
  plugins: [],
}