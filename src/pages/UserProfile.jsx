import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import FollowButton from "../components/FollowButton";
import useAuthStore from "../store/authStore";

export default function UserProfile() {
  // URL의 파라미터(예: /profile/101 -> { userId: '101' })를 가져옵니다.
  const { userId } = useParams();
  const { user: me } = useAuthStore(); // 현재 로그인한 내 정보

  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      try {
        // 백엔드에 특정 사용자의 프로필 정보를 요청합니다. (API 주소는 백엔드와 확인 필요)
        const response = await api.get(`/api/user/profile/${userId}`);
        setProfileData(response.data);
      } catch (err) {
        setError("프로필을 불러올 수 없습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]); // userId가 바뀔 때마다 프로필 정보를 다시 불러옵니다.

  // 내 프로필을 보려고 할 경우, 기존의 MyProfile 페이지로 보냅니다. (선택 사항)
  // if (me && me.id === parseInt(userId)) {
  //   return <Navigate to="/profile" />;
  // }

  if (isLoading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!profileData) return null;

  return (
    <div className="container mx-auto max-w-2xl p-4">
      {/* --- 프로필 헤더 --- */}
      <div className="flex items-center p-4">
        <img
          src={
            profileData.avatarUrl ||
            `https://i.pravatar.cc/150?u=${profileData.id}`
          }
          alt="프로필 사진"
          className="h-20 w-20 rounded-full object-cover md:h-32 md:w-32"
        />
        <div className="ml-6 flex-grow">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">{profileData.nickname}</h2>
            {/* 여기에 FollowButton을 사용합니다! */}
            <FollowButton
              targetUserId={profileData.id}
              initialIsFollowing={profileData.isFollowing} // 백엔드가 이 정보를 준다고 가정
            />
          </div>
          <div className="mt-4 flex space-x-4 text-center">
            <div>
              <span className="font-bold">{profileData.postCount}</span>
              <p className="text-sm text-gray-500">게시물</p>
            </div>
            <div>
              <span className="font-bold">{profileData.followerCount}</span>
              <p className="text-sm text-gray-500">팔로워</p>
            </div>
            <div>
              <span className="font-bold">{profileData.followingCount}</span>
              <p className="text-sm text-gray-500">팔로잉</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- 해당 유저가 쓴 게시물 그리드 (나중에 구현) --- */}
      <div className="border-t border-gray-200 pt-4">
        <div className="py-8 text-center text-gray-500">
          {profileData.nickname}님의 게시물이 여기에 표시됩니다.
        </div>
      </div>
    </div>
  );
}