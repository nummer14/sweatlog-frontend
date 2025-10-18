import React from 'react';
import { Link } from 'react-router-dom'; // 페이지 이동을 위해 Link를 사용합니다.

function Header() {
  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Sweatlog
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/post" className="text-gray-600 hover:text-blue-500">
            운동 기록
          </Link>
          <Link to="/login" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            로그인
          </Link>
          <Link to="/signup" className="text-gray-600 hover:text-blue-500">
            회원가입
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;