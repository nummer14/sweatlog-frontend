import axios from 'axios';
// 1. useAuthStore 훅 대신, 스토어의 원본 자체를 가져옵니다.
import useAuthStore from '../store/authStore'; 

const api = axios.create({
  baseURL: 'http://localhost:8080', // 백엔드 서버 주소
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
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return config; // 수정된 요청 정보를 반환합니다.
  },
  (error) => {
    // 요청 단계에서 에러가 발생하면 처리합니다.
    return Promise.reject(error);
  }
);

export default api;