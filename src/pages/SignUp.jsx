import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/api/axios";
import Logo from "@/components/Logo";

export default function SignUp() {
  const navigate = useNavigate();

  // 👇 DTO가 요구하는 username, email, password, fullName 상태를 준비합니다.
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // formData에는 이제 백엔드가 원하는 모든 정보가 정확히 담겨 있습니다.
      await api.post("/auth/register", formData);
      alert("회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 에러:", error);
      if (error.response) {
        alert(error.response.data.message || "회원가입에 실패했습니다.");
      } else {
        alert("회원가입 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <div>
          <Logo size="5xl" />
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            {/* 1. 이름 (Full Name) */}
            <div>
              <input
                name="fullName"
                type="text"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="이름"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            {/* 2. 이메일 주소 */}
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
            {/* 3. 비밀번호 */}
            <div>
              <input
                name="password"
                type="password"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="비밀번호 (6자 이상)"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {/* 4. 사용자 아이디 (Username) */}
            <div>
              <input
                name="username"
                type="text"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="닉네임 (3자에서 30자 사이)"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              가입하기
            </button>
          </div>
        </form>

        <div className="text-sm text-center">
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            이미 계정이 있으신가요? 로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
