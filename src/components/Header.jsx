import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

// 1. 아령 'g' 아이콘을 별도의 React 컴포넌트로 정의합니다.
//    이렇게 하면 코드가 깔끔해지고, 다른 곳에서도 재사용할 수 있습니다.
// 아령 'g' 아이콘 컴포넌트
const DumbbellGIcon = () => (
  // SVG 크기를 100%로 설정하여 부모 span의 크기를 따르게 합니다.
  <svg
    className="h-full w-full rotate-90"
    viewBox="0 0 100 100"
    fill="currentColor"
    aria-hidden="true"
  >
    <rect x="20" y="45" width="60" height="10" rx="5" />
    <rect x="10" y="30" width="20" height="40" rx="8" />
    <rect x="70" y="30" width="20" height="40" rx="8" />
  </svg>
);

function Header() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  return (
    <header>
      <nav>
        <Link
          to="/"
          className="flex items-end text-2xl font-bold text-blue-600"
        >
          {/* 1. 'Sweatlo' 부분은 그대로 보여줍니다. */}
          <span>sweatlo</span>

          {/* 2. 'g' 글자를 위한 자리를 만들고, 그 위에 아이콘을 겹칩니다. */}
          <span className="relative">
            {/* 3. 실제 'g' 글자는 투명하게 만들어 보이지 않게 합니다. */}
            <span className="text-transparent">g</span>

            {/* 4. 아령 아이콘을 'absolute'로 띄워서 'g'의 위치에 정확히 겹칩니다. */}
            <span className="absolute -left-[0.3em] -top-[0.4em] h-[2.9em] w-[1.3em]">
              <DumbbellGIcon />
            </span>
          </span>
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/feed" className="text-gray-600 hover:text-blue-500">
            소셜 피드
          </Link>
          <Link to="/post" className="text-gray-600 hover:text-blue-500">
            운동 기록
          </Link>
          <Link to="/routines" className="text-gray-600 hover:text-blue-500">
            나의 루틴
          </Link>

          {isLoggedIn ? (
            <>
              <Link to="/profile" className="text-gray-600 hover:text-blue-500">
                내 프로필
              </Link>
              <span className="font-semibold">
                {user?.nickname}님, 환영합니다!
              </span>
              <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                로그인
              </Link>
              <Link to="/signup" className="text-gray-600 hover:text-blue-500">
                회원가입
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Header;
