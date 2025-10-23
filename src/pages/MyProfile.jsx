  import React, { useState, useEffect } from "react";
  import useAuthStore from "@/store/authStore";
  import Modal from "@/components/Modal";
  import GoalSettingModal from "@/components/GoalSettingModal";
  import api from "@/api/axios"; // 👈 1. 우리가 만든 axios 인스턴스를 import 합니다.

  export default function MyProfile() {
    const { user: authUser, login } = useAuthStore(); // 스토어의 user는 authUser로 별칭을 붙여 사용

    // 👈 2. API로부터 받아올 데이터를 위한 상태들을 새로 정의합니다.
    const [profile, setProfile] = useState(null); // 전체 프로필 정보
    const [myPosts, setMyPosts] = useState([]); // 내 게시물 목록
    const [goals, setGoals] = useState([]); // 내 목표 목록
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    const [profileFormData, setProfileFormData] = useState({
      nickname: "",
      bio: "",
      height: "",
      weight: "",
    });

    // 👈 3. 컴포넌트가 마운트될 때 백엔드에서 모든 데이터를 가져오는 useEffect
    useEffect(() => {
      // 로그인된 사용자가 없으면 아무것도 하지 않음
      if (!authUser?.id) {
        setLoading(false);
        return;
      }

      const fetchMyProfileData = async () => {
        try {
          setLoading(true);
          // 여러 API를 동시에 요청하여 페이지 로딩 속도를 높입니다.
          const [profileRes, postsRes, goalsRes] = await Promise.all([
            api.get("/api/users/me"), // ✅ GET /api/users/me (내 정보 조회)
            api.get(`/api/posts/user/${authUser.id}`), // ✅ GET /api/posts/user/{userId} (내 게시물 조회)
            api.get("/api/users/profile/goals"), // ✅ GET /api/users/profile/goals (내 목표 조회)
          ]);

          // 각 API 응답 데이터를 상태에 저장
          setProfile(profileRes.data);
          setMyPosts(postsRes.data);
          setGoals(goalsRes.data);

          // 프로필 수정 폼의 초기값을 서버에서 받은 데이터로 설정
          setProfileFormData({
            nickname: profileRes.data.nickname || "",
            bio: profileRes.data.bio || "자기소개를 입력해주세요.",
            height: profileRes.data.height || "",
            weight: profileRes.data.weight || "",
          });
        } catch (err) {
          console.error("프로필 데이터를 불러오는 데 실패했습니다:", err);
          setError("데이터를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.");
        } finally {
          setLoading(false);
        }
      };

      fetchMyProfileData();
    }, [authUser]); // authUser 정보가 변경될 때마다 다시 데이터를 가져옵니다.

    const handleFormChange = (e) => {
      const { name, value } = e.target;
      setProfileFormData((prev) => ({ ...prev, [name]: value }));
    };

    // 👈 4. 프로필 수정 폼을 실제 API와 연동
    const handleFormSubmit = async (e) => {
      e.preventDefault();
      try {
        // ✅ PUT /api/users/profile/setting (프로필 설정/수정)
        const response = await api.put(
          "/api/users/profile/setting",
          profileFormData
        );

        // 서버로부터 업데이트된 최신 프로필 정보를 받아와 화면에 반영
        setProfile(response.data);

        // Zustand 스토어의 닉네임도 업데이트 (Header 등 다른 컴포넌트에 반영하기 위함)
        login(
          { ...authUser, nickname: response.data.nickname },
          useAuthStore.getState().accessToken
        );

        alert("프로필이 성공적으로 수정되었습니다.");
        setIsModalOpen(false);
      } catch (err) {
        console.error("프로필 수정 실패:", err);
        alert("프로필 수정에 실패했습니다.");
      }
    };

    // 👈 5. 목표 추가 기능을 실제 API와 연동
    const handleAddGoal = async (newGoalData) => {
      try {
        // ✅ POST /api/users/profile/goals (내 목표 생성)
        const response = await api.post("/api/users/profile/goals", newGoalData);

        // 서버로부터 생성된 목표 데이터를 받아와 상태에 추가하여 화면에 즉시 반영
        setGoals((prevGoals) => [...prevGoals, response.data]);

        alert("새로운 목표가 추가되었습니다!");
        setIsGoalModalOpen(false);
      } catch (err) {
        console.error("목표 추가 실패:", err);
        alert("목표 추가에 실패했습니다.");
      }
    };

    // --- 로딩 및 에러 상태에 따른 UI 처리 ---
    if (loading) {
      return <div className="p-8 text-center">프로필 정보를 불러오는 중...</div>;
    }

    if (error) {
      return <div className="p-8 text-center text-red-500">{error}</div>;
    }

    if (!authUser || !profile) {
      return <div className="p-8 text-center">로그인 후 이용해주세요.</div>;
    }

    // 👇 프로필 이미지 업로드 성공 시 호출될 함수를 새로 만듭니다.
    const handleProfileImageUpload = async (imageUrl) => {
      try {
        // 1. 이미지는 ImageUploader가 S3에 업로드 완료.
        // 2. 우리는 그 결과로 받은 imageUrl을 우리 DB의 유저 정보에 업데이트 해달라고 요청.
        //    이것을 위한 별도의 API가 필요합니다. (예: PUT /api/users/profile/image)
        await api.put("/api/users/profile/image", { imageUrl }); // 백엔드와 이 API에 대해 협의 필요

        // 상태를 업데이트하여 화면에 즉시 반영
        setProfile((prev) => ({ ...prev, avatarUrl: imageUrl }));
        alert("프로필 이미지가 변경되었습니다.");
      } catch (err) {
        console.error("프로필 이미지 업데이트 실패:", err);
        alert("프로필 이미지 변경에 실패했습니다.");
      }
    };

    // 👈 6. 모든 JSX 부분을 가짜 데이터가 아닌, 서버에서 받아온 'profile' 상태와 연결
    return (
      <div className="container mx-auto max-w-2xl p-4">
        {/* --- 프로필 헤더 --- */}
        <div className="flex items-center p-4">
          <img
            src={profile.avatarUrl || `https://i.pravatar.cc/150?u=${profile.id}`}
            alt="프로필 사진"
            className="h-20 w-20 rounded-full object-cover md:h-32 md:w-32"
          />
          <div className="ml-6 flex-grow">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">{profile.nickname}</h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="rounded-md border bg-gray-100 px-3 py-1 text-sm font-semibold"
              >
                프로필 수정
              </button>
            </div>
            <div className="mt-4 flex space-x-4 text-center">
              <div>
                <span className="font-bold">{myPosts.length}</span>
                <p className="text-sm text-gray-500">게시물</p>
              </div>
              <div>
                <span className="font-bold">{profile.followerCount || 0}</span>
                <p className="text-sm text-gray-500">팔로워</p>
              </div>
              <div>
                <span className="font-bold">{profile.followingCount || 0}</span>
                <p className="text-gray-500">팔로잉</p>
              </div>
            </div>
            {profile.height && profile.weight && (
              <div className="mt-4 flex space-x-4 text-sm">
                <span>키: {profile.height}cm</span>
                <span>몸무게: {profile.weight}kg</span>
              </div>
            )}
          </div>
        </div>

        {/* --- 자기소개 --- */}
        <div className="p-4">
          <p>{profile.bio}</p>
        </div>
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
              <label className="block text-sm font-medium text-gray-700">
                프로필 사진
              </label>
              <div className="mt-1">
                <ImageUploader
                  onUploadSuccess={handleProfileImageUpload}
                  uploadContext="profile"
                />
              </div>
            </div>

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
