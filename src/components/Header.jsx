import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";

export default function Header() {
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout?.();
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  const avatar =
    user?.avatarUrl ??
    user?.profileImageUrl ??
    (user?.id
      ? `https://i.pravatar.cc/150?u=${user.id}`
      : "https://placehold.co/80x80");

  // 닉네임/유저네임/실명 순으로 표기
  const displayName =
    user?.nickname ?? user?.username ?? user?.fullName ?? "사용자";
  // id가 없으면 /profile 로 보내서 내 정보 페이지가 뜨도록
  const profileHref = user?.id ? `/profile/${user.id}` : "/profile";

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link to="/" className="text-xl font-bold">
          Sweatlog
        </Link>

        <nav className="flex items-center gap-3">
          <Link to="/feed" className="text-gray-700 hover:underline">
            피드
          </Link>
          <Link to="/routines" className="text-gray-700 hover:underline">
            내 루틴
          </Link>

          {/* 상단 액션은 헤더에서만 노출 */}
          <Link
            to="/routines/new"
            className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-200"
          >
            루틴 만들기
          </Link>
          <Link
            to="/post"
            className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            운동 기록하기
          </Link>

          {isLoggedIn ? (
            <>
              <Link to={profileHref} className="ml-2 flex items-center gap-2">
                <img
                  src={avatar}
                  alt="프로필"
                  className="h-8 w-8 rounded-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src = "https://placehold.co/80x80")
                  }
                />
                <span className="hidden sm:inline">{displayName}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-100"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
