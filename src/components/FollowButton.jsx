import React, { useState, useEffect } from "react";
import api from "../api/axios";
import useAuthStore from "../store/authStore";

// 이 컴포넌트는 단 하나의 props만 받습니다:
// - targetUserId: 팔로우할 대상의 ID
export default function FollowButton({ targetUserId }) {
  const { user: me } = useAuthStore(); // 현재 로그인한 내 정보

  const [isFollowing, setIsFollowing] = useState(false); // 초기값은 항상 false
  const [isLoading, setIsLoading] = useState(true); // 👈 2. 초기 로딩 상태 추가

  // 👈 3. 컴포넌트가 처음 렌더링될 때, 실제 팔로우 상태를 서버에서 조회합니다.
  useEffect(() => {
    // 팔로우 대상이 없거나, 내 자신일 경우에는 아무것도 하지 않음
    if (!targetUserId || me?.id === targetUserId) {
      setIsLoading(false);
      return;
    }

    const fetchFollowStatus = async () => {
      try {
        setIsLoading(true);
        // ✅ GET /api/users/{userId}/follow-status (팔로우 상태 조회)
        const response = await api.get(`/users/${targetUserId}/follow-status`);
        // 서버로부터 받은 실제 팔로우 상태(true/false)로 상태를 업데이트합니다.
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("팔로우 상태 조회 중 에러 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFollowStatus();
  }, [targetUserId, me]); // targetUserId가 바뀔 때마다 다시 조회합니다.

  const handleFollowClick = async () => {
    setIsLoading(true);
    try {
      // ✅ POST /api/users/{userId}/follow (팔로우/언팔로우 토글)
      // 백엔드 컨트롤러에서 확인한 실제 엔드포인트로 수정합니다.
      await api.post(`/users/${targetUserId}/follow`);

      // API 호출 성공 시, 버튼의 상태를 즉시 반대로 변경합니다.
      setIsFollowing((prev) => !prev);
    } catch (error) {
      console.error("팔로우/언팔로우 처리 중 에러 발생:", error);
      alert("요청을 처리하는 중 문제가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 👈 4. 내 프로필에서는 팔로우 버튼이 보이지 않도록 처리
  if (me?.id === targetUserId) {
    return null; // 아무것도 렌더링하지 않음
  }

  const buttonStyle = isFollowing
    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
    : "bg-blue-500 text-white hover:bg-blue-600";

  return (
    <button
      onClick={handleFollowClick}
      disabled={isLoading}
      className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${buttonStyle}`}
    >
      {isLoading ? "확인 중..." : isFollowing ? "팔로잉" : "팔로우"}
    </button>
  );
}
