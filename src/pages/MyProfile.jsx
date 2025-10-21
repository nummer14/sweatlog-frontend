import React, { useState, useEffect } from "react";
import useAuthStore from "@/store/authStore";
import Modal from "@/components/Modal";
import { FAKE_POSTS } from "@/mocks/mockPosts.js";
import GoalSettingModal from "@/components/GoalSettingModal";

export default function MyProfile() {
  const { user, login } = useAuthStore(); // login 액션도 가져옵니다 (상태 업데이트용).
  const [myPosts, setMyPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    nickname: "",
    bio: "",
    // 나중에 추가할 필드들...
    height: "",
    weight: "",
  });

  const [goals, setGoals] = useState([]); // 목표 목록을 저장할 배열
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false); // 목표 설정 모달의 열림/닫힘 상태

  // 컴포넌트가 로드되거나, user 정보가 바뀔 때 실행됩니다.
  useEffect(() => {
    if (user) {
      // 내 게시물 필터링
      const filteredPosts = FAKE_POSTS.filter(
        (post) => post.author.id === user.id
      );
      setMyPosts(filteredPosts);

      // 4. 수정 폼의 초기값을 현재 사용자 정보로 설정합니다.
      setProfileFormData({
        nickname: user.nickname,
        bio: "꾸준함이 답이다. 3대 500을 향하여!", // (bio는 아직 user 객체에 없으므로 임시 데이터 사용)
        height: user.height || "",
        weight: user.weight || "",
      });
    }
  }, [user]);

  // --- 5. 프로필 수정 폼의 내용이 바뀔 때 실행될 핸들러 함수 ---
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- 6. 프로필 수정 폼을 '저장'할 때 실행될 핸들러 함수 ---
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // TODO: 나중에 여기에 실제 백엔드 API (api.patch('/api/user/profile')) 호출 코드를 추가합니다.

    // 지금은 프론트엔드의 상태만 먼저 업데이트해서 UI에 즉시 반영합니다. (Optimistic Update)
    const updatedUser = {
      ...user,
      nickname: profileFormData.nickname,
      height: profileFormData.height,
      weight: profileFormData.weight,
    };
    // (bio 정보도 user 객체에 있다면 함께 업데이트)

    login(updatedUser, useAuthStore.getState().accessToken); // Zustand 스토어 업데이트

    console.log("수정된 프로필 데이터:", profileFormData);
    alert("프로필이 성공적으로 수정되었습니다.");

    setIsModalOpen(false); // 모달을 닫습니다.
  };
  // --- 3. GoalSettingModal에서 '목표 추가' 버튼을 눌렀을 때 실행될 함수 ---
  const handleAddGoal = (newGoal) => {
    setGoals((prevGoals) => [...prevGoals, newGoal]);
    // TODO: 나중에 여기에 실제 백엔드 API (api.post('/api/goals')) 호출 코드를 추가합니다.
  };

  if (!user) {
    return <div className="p-8 text-center">로그인 후 이용해주세요.</div>;
  }

  const profileData = {
    avatarUrl: `https://i.pravatar.cc/150?u=${user.id}`,
    nickname: user.nickname, // 이제 Zustand 스토어의 최신 닉네임을 보여줍니다.
    postCount: myPosts.length,
    followerCount: 120,
    followingCount: 85,
    bio: profileFormData.bio, // (임시) 폼 상태의 bio를 보여줍니다.
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      {/* --- 프로필 헤더 --- */}
      <div className="flex items-center p-4">
        <img
          src={profileData.avatarUrl}
          alt="프로필 사진"
          className="h-20 w-20 rounded-full object-cover md:h-32 md:w-32"
        />
        <div className="ml-6 flex-grow">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">{profileData.nickname}</h2>
            {/* --- 7. '프로필 수정' 버튼을 추가하고, 클릭 시 모달을 열도록 합니다. --- */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="rounded-md border bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700 hover:bg-gray-200"
            >
              프로필 수정
            </button>
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
          {user.height && user.weight && (
            <div className="mt-4 flex space-x-4 text-sm text-gray-600">
              <span>키: {user.height}cm</span>
              <span>몸무게: {user.weight}kg</span>
            </div>
          )}
        </div>
      </div>

      {/* --- 자기소개 --- */}
      <div className="p-4">
        <p>{profileData.bio}</p>
      </div>

      {/* --- 4. 목표 섹션을 새로 추가합니다. --- */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">나의 목표</h3>
          <button
            onClick={() => setIsGoalModalOpen(true)}
            className="text-sm font-semibold text-blue-600"
          >
            + 새 목표 추가
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {goals.length > 0 ? (
            goals.map((goal) => (
              <div key={goal.id} className="rounded-lg bg-gray-100 p-3">
                <p className="font-semibold">{goal.type}</p>
                <p className="text-sm text-gray-600">
                  목표: {goal.exerciseName && `${goal.exerciseName} `}
                  {goal.targetValue}
                  {goal.unit}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-gray-500">
              아직 설정된 목표가 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* --- 내가 쓴 게시물 그리드 --- */}
      <div className="border-t border-gray-200 pt-4">
        {myPosts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {myPosts.map((post) => (
              <div key={post.id} className="aspect-square">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt="My post"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                    No Image
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-gray-500">
            작성한 게시물이 없습니다.
          </div>
        )}
      </div>
      {/* --- 8. Modal 컴포넌트를 여기에 렌더링합니다. --- */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h2 className="text-xl font-bold">프로필 수정</h2>
          <div>
            <label
              htmlFor="nickname"
              className="block text-sm font-medium text-gray-700"
            >
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={profileFormData.nickname}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="bio"
              className="block text-sm font-medium text-gray-700"
            >
              자기소개
            </label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              value={profileFormData.bio}
              onChange={handleFormChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="height"
                className="block text-sm font-medium text-gray-700"
              >
                키 (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={profileFormData.height}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="weight"
                className="block text-sm font-medium text-gray-700"
              >
                몸무게 (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={profileFormData.weight}
                onChange={handleFormChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="rounded-md border border-transparent bg-blue-600 px-4 py-2"
            >
              저장하기
            </button>
          </div>
        </form>
      </Modal>
      {/* --- 5. 목표 설정 모달을 여기에 렌더링합니다. --- */}
      <GoalSettingModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onAddGoal={handleAddGoal}
      />
    </div>
  );
}
