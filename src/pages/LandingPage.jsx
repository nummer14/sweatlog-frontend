import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
        당신의 모든 땀방울을 기록하세요
      </h1>
      
      {/* 👇 이 <p> 태그 부분을 수정했습니다. */}
      <p className="mt-6 text-lg leading-8 text-gray-600">
        {/* 1. 로고 스타일을 적용할 부분을 <span>으로 감쌉니다. */}
        <span className="font-oswald font-bold tracking-tight">
          {/* 2. 'sweatlo'는 검정색으로 표시합니다. */}
          <span className="text-gray-900">sweatlo</span>
          {/* 3. 'g'는 우리가 정의한 빨간색으로 표시합니다. */}
          <span className="text-brand-red-dark">g </span>
        </span>
        는 당신의 운동 여정을 함께합니다. <br />
        체계적으로 기록하고, 친구들과 공유하며 동기를 부여받으세요.
      </p>

      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          to="/signup"
          className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          지금 바로 시작하기
        </Link>
        <Link
          to="/login"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          로그인 <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}