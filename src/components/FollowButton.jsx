import React, { useState, useEffect } from "react";
import api from "../api/axios";

// 이 컴포넌트는 두 개의 props를 받습니다:
// - targetUserId: 팔로우할 대상의 ID
// - initialIsFollowing: 이 페이지를 로드했을 때 내가 이미 상대를 팔로우하고 있었는지 여부
export default function FollowButton({ targetUserId, initialIsFollowing }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  // 부모 컴포넌트에서 전달된 initialIsFollowing 값이 바뀔 때,
  // 이 컴포넌트의 상태도 동기화해줍니다.
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollowClick = async () => {
    setIsLoading(true); // 로딩 시작
    try {
      // 백엔드의 팔로우 API('/api/follow/{userId}')를 호출합니다.
      await api.post(`/api/follow/${targetUserId}`);

      // API 호출 성공 시, 버튼의 상태를 즉시 반대로 변경합니다. (Optimistic Update)
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("팔로우/언팔로우 처리 중 에러 발생:", error);
      alert("요청을 처리하는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  const buttonStyle = isFollowing
    ? "bg-gray-200 text-gray-800 hover:bg-gray-300" // 팔로잉 중일 때 스타일
    : "bg-blue-500 text-white hover:bg-blue-600"; // 팔로우 안 할 때 스타일

  return (
    <button
      onClick={handleFollowClick}
      disabled={isLoading}
      className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${buttonStyle}`}
    >
      {isLoading ? "처리 중..." : isFollowing ? "팔로잉" : "팔로우"}
    </button>
  );
}