import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  // 1. 로그인 폼 데이터(이메일, 비밀번호)를 '기억'할 상태
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // 2. input 값이 바뀔 때마다 상태를 업데이트하는 함수 (SignUp.jsx와 동일)
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 3. '로그인' 버튼을 눌렀을 때 실행될 함수 (SignUp.jsx와 동일)
  const handleSubmit = async (event) => { // async 추가
    event.preventDefault();

    try {
      // 백엔드의 로그인 API 주소로 요청 (예시)
      const response = await axios.post('/api/users/login', formData);
      console.log('로그인 성공:', response.data);
      alert('로그인 성공!');
      // TODO: 로그인 성공 시 토큰 저장 및 메인 페이지로 이동

    } catch (error) {
      console.error('로그인 에러:', error);
      alert('로그인에 실패했습니다. 이메일 또는 비밀번호를 확인해주세요.');
    }
  };

  return (
    // 회원가입 페이지와 거의 동일한 구조입니다.
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            로그인
          </h2>
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

          <div className="text-sm">
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              계정이 없으신가요? 회원가입
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}