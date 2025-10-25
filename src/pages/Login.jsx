import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Logo from "../components/Logo";
import useAuthStore from "../store/authStore"; // 1. 우리가 만든 저장소를 import 합니다.
import { useNavigate } from "react-router-dom"; // 2. 페이지 이동을 위한 훅을 import 합니다.

const ENABLE_GOOGLE = import.meta.env.VITE_ENABLE_GOOGLE_OAUTH === "true";
export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // 중복 제출 방지 상태

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // '로그인' 버튼을 눌렀을 때 실행될 함수
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await api.post("/auth/login", formData);

      // 👇 [핵심 수정] 실제 백엔드 응답 구조에 맞춰 데이터를 추출합니다.
      const { user, access_token } = response.data;

      // Zustand 스토어에 저장할 user 객체를 구성합니다.
      // 백엔드가 보내준 user 객체에 nickname이 없으므로, fullName을 nickname으로 사용합니다.
      const userToStore = {
        id: user.id,
        nickname: user.fullName, // 👈 fullName을 nickname으로 사용
      };

      // Zustand 스토어의 login 함수를 호출합니다.
      login(userToStore, access_token);

      // 이제 user.fullName (즉, nickname)이 정상적으로 표시됩니다.
      alert(`${user.fullName}님, 환영합니다!`);

      navigate("/feed");
    } catch (error) {
      console.error("로그인 에러:", error);
      if (error.response) {
        alert(error.response.data.message || "로그인에 실패했습니다.");
      } else {
        alert("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인해주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
    import.meta.env.VITE_GOOGLE_CLIENT_ID
  }&redirect_uri=http://localhost:8080/api/oauth2/callback/google&response_type=code&scope=openid%20profile%20email`;

  return (
    // 회원가입 페이지와 거의 동일한 구조입니다.
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <div>
          {/* 👇 2. [핵심 수정] 기존 h2 텍스트를 Logo 컴포넌트로 교체합니다. */}
          <Logo size="5xl" />
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            {/* 이메일 입력 */}
            <div>
              <input
                name="email"
                type="email"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="이메일 주소"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <input
                name="password"
                type="password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting} // 버튼 비활성화 추가
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400"
            >
              {isSubmitting ? "로그인 중..." : "로그인"}
            </button>
          </div>
        </form>

        <div className="text-sm">
          <Link
            to="/signup"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            계정이 없으신가요? 회원가입
          </Link>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">또는</span>
          </div>
        </div>

        <div>
          <a
            href={googleLoginUrl}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            {/* <img className="h-5 w-5" src={googleLogo} alt="Google" /> */}
            <svg className="h-5 w-5" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.06,4.72C14.641,15.123,18.98,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.022,36.217,44,30.561,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Google 계정으로 로그인
          </a>
        </div>
      </div>
    </div>
  );
}
