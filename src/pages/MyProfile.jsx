import React, { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import { FAKE_POSTS } from '../_mocks/fakePosts'; // 모든 가짜 게시물을 가져옵니다.

export default function MyProfile() {
  const { user } = useAuthStore();
  const [myPosts, setMyPosts] = useState([]); // '내 게시물'만 담을 상태를 만듭니다.

  // 컴포넌트가 로드될 때 '내 게시물'을 필터링하는 로직을 실행합니다.
  useEffect(() => {
    // user 정보가 있을 때만 필터링을 실행합니다.
    if (user) {
      // 모든 게시물(FAKE_POSTS) 중에서...
      const filteredPosts = FAKE_POSTS.filter(
        // 게시물의 작성자 ID와 로그인한 나의 ID가 같은 것만 골라냅니다.
        (post) => post.author.id === user.id
      );
      setMyPosts(filteredPosts); // 골라낸 게시물들을 상태에 저장합니다.
    }
  }, [user]); // user 정보가 바뀔 때마다 이 로직을 다시 실행합니다.

  if (!user) {
    return <div className="p-8 text-center">로그인 후 이용해주세요.</div>;
  }

  // 프로필 정보 (이제 동적으로 계산됩니다)
  const profileData = {
    avatarUrl: `https://i.pravatar.cc/150?u=${user.id}`,
    nickname: user.nickname,
    postCount: myPosts.length, // 실제 내 게시물의 개수
    followerCount: 120, // (아직은 가짜 데이터)
    followingCount: 85, // (아직은 가짜 데이터)
    bio: '꾸준함이 답이다. 3대 500을 향하여!', // (아직은 가짜 데이터)
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      {/* --- 프로필 헤더 --- */}
      <div className="flex items-center p-4">
        <img src={profileData.avatarUrl} alt="프로필 사진" className="h-20 w-20 rounded-full object-cover md:h-32 md:w-32" />
        <div className="ml-6 flex-grow">
          <h2 className="text-2xl font-bold">{profileData.nickname}</h2>
          <div className="mt-2 flex space-x-4 text-center">
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

      {/* --- 자기소개 --- */}
      <div className="p-4">
        <p>{profileData.bio}</p>
      </div>

      {/* --- 내가 쓴 게시물 그리드 --- */}
      <div className="border-t border-gray-200 pt-4">
        {myPosts.length > 0 ? (
          <div className="grid grid-cols-3 gap-1">
            {myPosts.map((post) => (
              <div key={post.id} className="aspect-square">
                {post.imageUrl ? (
                  <img src={post.imageUrl} alt="My post" className="h-full w-full object-cover" />
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
    </div>
  );
}