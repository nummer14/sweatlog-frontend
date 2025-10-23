// 수정해야 할 코드 (예: src/api/axios.js)
import axios from "axios";
import useAuthStore from "../store/authStore";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json", // 기본 Content-Type 지정
  },
});

// 요청 인터셉터 (API 요청을 보내기 직전에 가로채는 로직)
api.interceptors.request.use(
  (config) => {
    // 2. 훅(useAuthStore)을 호출하는 대신, .getState() 메소드를 사용해 스토어의 상태에 직접 접근합니다.
    //    이 방식은 순환 참조를 일으키지 않습니다.
    const { accessToken } = useAuthStore.getState();

    // 토큰이 스토어에 존재하면...
    if (accessToken) {
      // 요청 헤더에 'Authorization' 값을 추가합니다.
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config; // 수정된 요청 정보를 반환합니다.
  },
  (error) => {
    // 요청 단계에서 에러가 발생하면 처리합니다.
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가 (중요)
api.interceptors.response.use(
  (response) => response, // 정상 응답은 그대로 전달
  (error) => {
    // 백엔드에서 인증 실패(401) 응답이 오면 자동 로그아웃 처리
    if (error.response?.status === 401) {
      const { logout } = useAuthStore.getState();
      logout?.(); // Zustand store에 logout 액션 정의되어 있어야 함
      // 또는 window.location.href = '/login';
    }

    // 개발 중 에러 로그 확인용
    console.error("API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    return Promise.reject(error);
  }
);

export default api;
