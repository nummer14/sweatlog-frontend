import React, { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import api from '@/api/axios';

export default function SocialFeed() {
  // 👈 4. API로부터 받아올 데이터를 위한 상태들을 정의합니다.
  const [posts, setPosts] = useState([]); // 게시물 목록을 저장할 배열
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 👈 5. 컴포넌트가 처음 렌더링될 때, API를 호출하여 게시물 데이터를 가져옵니다.
  useEffect(() => {
  const fetchPosts = async () => {
    try {
      // 👇 페이지네이션 파라미터를 추가합니다.
      const response = await api.get('/posts?page=0&size=20');
      // 백엔드는 Page 객체로 응답하므로, 실제 데이터는 .content에 들어있습니다.
      setPosts(response.data.content); 
        
      } catch (err) {
        console.error("피드 데이터를 불러오는 데 실패했습니다:", err);
        setError("피드를 불러올 수 없습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setLoading(false); // 데이터 요청 완료 시 로딩 상태를 false로 설정
      }
    };

    fetchPosts();
  }, []); // 빈 배열을 전달하여, 컴포넌트가 처음 마운트될 때 한 번만 실행되도록 합니다.


  // 👈 6. 로딩 및 에러 상태에 따른 UI를 추가하여 사용자 경험을 향상시킵니다.
  if (loading) {
    return <div className="p-8 text-center">피드를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto max-w-xl space-y-6 p-4">
      <h1 className="text-3xl font-bold">피드</h1>
      
      {/* 👈 7. posts 배열이 비어있을 때의 처리도 추가하면 좋습니다. */}
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post.postId} post={post} /> // 백엔드 데이터의 고유 ID가 postId일 가능성이 높습니다.
        ))
      ) : (
        <div className="py-8 text-center text-gray-500">
          아직 게시물이 없습니다. 첫 번째 운동 기록을 남겨보세요!
        </div>
      )}
    </div>
  );
}