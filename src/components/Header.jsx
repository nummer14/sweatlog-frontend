import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Logo from "./Logo";

function Header() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto flex items-center justify-between p-4">
        {/* 👇 로고 부분은 이 <Link> 태그 하나로 완벽하게 정리됩니다. */}
        <Link to="/">
          <Logo size="4xl" />
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/feed" className="text-gray-600 hover:text-blue-500">
            홈
          </Link>
          <Link to="/post" className="text-gray-600 hover:text-blue-500">
            나의 기록
          </Link>
          <Link to="/routines" className="text-gray-600 hover:text-blue-500">
            나의 루틴
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-blue-500">
                <img 
                  src={user?.avatarUrl || `https://i.pravatar.cc/150?u=${user?.id}`} 
                  alt="My Profile" 
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span>내 프로필</span>
              </Link>
              <button
                onClick={handleLogout}
                className="rounded bg-gray-200 px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-300"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-800"
              >
                로그인
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;