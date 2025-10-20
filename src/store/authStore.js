import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 'authStore'라는 이름의 저장소를 만듭니다.
const useAuthStore = create(
  // persist 미들웨어를 사용해서, 상태를 localStorage에 자동으로 저장합니다.
  // 이렇게 하면 사용자가 브라우저를 껐다 켜도 로그인 상태가 유지됩니다.
  persist(
    (set) => ({
      // --- 상태 (State) ---
      isLoggedIn: false,    // 로그인 여부
      user: null,           // 로그인한 사용자 정보 (예: { nickname: '운동고수' })
      token: null,          // 서버로부터 받은 인증 토큰 (JWT)

      // --- 상태를 변경하는 함수 (Actions) ---
      login: (userData, authToken) => set({
        isLoggedIn: true,
        user: userData,
        token: authToken,
      }),

      logout: () => set({
        isLoggedIn: false,
        user: null,
        token: null,
      }),
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 때 사용될 키 이름
    }
  )
);

export default useAuthStore;