import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

// 댓글 데이터를 위한 가짜 데이터 (나중에는 API로 받아옵니다)
const FAKE_COMMENTS = [
  { id: 1, author: "헬린이", text: "정말 대단하세요! 尊敬します!" },
  { id: 2, author: "득근맨", text: "와... 저도 언젠가는..." },
];

export default function PostCard({ post }) {
  const [isLiked, setIsLiked] = useState(post.isLikedByUser || false);
  const [likeCount, setLikeCount] = useState(post.likes || 0);
  // const [commentsVisible, setCommentsVisible] = useState(false); // ⛔️ 이 줄이 아직 남아있다면 삭제!

  // 👈 3. props로 받은 post 데이터가 변경될 때마다 내부 상태도 동기화합니다.
  useEffect(() => {
    setIsLiked(post.isLikedByUser || false);
    setLikeCount(post.likes || 0);
  }, [post]);

  if (!post) return null;

  // 3. '좋아요' 버튼을 클릭했을 때 실행될 함수
const handleLikeClick = async () => {
  try {
    // 👇 무조건 POST 요청만 보냅니다.
    const response = await api.post(`/posts/${post.postId}/like`);
    
    // 👇 서버가 보내준 최신 데이터로 상태를 업데이트합니다. (더 정확!)
    setIsLiked(response.data.isLiked);
    setLikeCount(response.data.likeCount);

  } catch (error) {
    console.error("좋아요 처리 중 에러 발생:", error);
    alert("요청을 처리하는 중 문제가 발생했습니다.");
  }
};

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      {/* --- 게시물 헤더 --- */}
      <div className="flex items-center p-4">
        <img
          src={post.author.avatarUrl || `https://i.pravatar.cc/150?u=${post.author.id}`}
          alt={post.author.nickname}
          className="h-10 w-10 rounded-full object-cover"
        />
        {/* 👈 6. 프로필 링크를 실제 백엔드 authorId로 연결 */}
        <Link
          to={`/profile/${post.author.id}`}
          className="ml-3 font-semibold hover:underline"
        >
          {post.author.nickname}
        </Link>
      </div>

      {/* --- 게시물 이미지 --- */}
      {post.imageUrl && (
        // 👈 7. 상세 페이지 링크를 실제 백엔드 postId로 연결
        <Link to={`/post/${post.postId}`}>
          <div className="w-full">
            <img
              src={post.imageUrl}
              alt={`Post by ${post.author.nickname}`}
              className="h-auto w-full object-cover"
            />
          </div>
        </Link>
      )}


      {/* --- 게시물 액션 버튼 --- */}
      <div className="flex gap-4 border-t border-gray-200 p-2">
        {/* '좋아요' 버튼 */}
        <button onClick={handleLikeClick}>
          <svg
            className={`h-6 w-6 transition-colors duration-200 ${
              isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
            }`}
            fill={isLiked ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>

         <Link 
          to={`/post/${post.postId}`} 
          className="text-gray-500 hover:text-blue-500"
          aria-label="댓글 보기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </Link>
      </div>


      {/* --- 좋아요 수 --- */}
      <div className="px-4 pb-2">
        {/* 6. 이제 좋아요 수는 부모에게 받은 post.likes가 아니라, 우리 자신의 상태인 likeCount를 보여줍니다. */}
        <span className="text-sm font-semibold">
          {likeCount}명이 좋아합니다
        </span>
      </div>

      {/* --- 게시물 본문 --- */}
      <div className="px-4 pb-4">
        <p>
          <span className="font-semibold">{post.author.nickname}</span>{" "}
          {post.content}
        </p>
      </div>
      
      {/* 
        카드 내 댓글 기능은 PostDetail 페이지에 집중시키므로 주석 처리합니다.
        {commentsVisible && (
          <div className="border-t border-gray-200 p-4">
            ... (내용) ...
          </div>
        )}
      */}

    </div> // </div> of PostCard component
  );
}