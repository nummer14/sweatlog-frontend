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
      
      // 'token'을 'accessToken'으로 변경하여 axios 인터셉터와 통일합니다.
      accessToken: null,    // 서버로부터 받은 인증 토큰 (JWT)

      // --- 상태를 변경하는 함수 (Actions) ---
      
      // 파라미터 이름도 명확하게 authToken -> token 으로 변경하는 것이 좋습니다.
      login: (userData, token) => set({
        isLoggedIn: true,
        user: userData,
        accessToken: token, // 저장할 때도 accessToken으로 저장합니다.
      }),

      logout: () => {
        set({ isLoggedIn: false, user: null, accessToken: null });
        window.location.href = '/login';
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;