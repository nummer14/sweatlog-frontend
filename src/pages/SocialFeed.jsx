import React from 'react';
import { FAKE_POSTS } from '@/mocks/mockPosts.js';
import PostCard from '@/components/PostCard';

export default function SocialFeed() {
  const posts = FAKE_POSTS;

  return (
    <div className="container mx-auto max-w-xl space-y-6 p-4">
      <h1 className="text-3xl font-bold">피드</h1>
      
      {/* 2. .map() 함수 안의 복잡한 코드가 PostCard 컴포넌트 하나로 정리되었습니다. */}
      {posts.map((post) => (
        // PostCard에게 post라는 이름으로 게시물 데이터 하나를 통째로 전달합니다.
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}