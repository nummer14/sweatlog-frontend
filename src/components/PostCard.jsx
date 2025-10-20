import React, { useState } from "react";

// 댓글 데이터를 위한 가짜 데이터 (나중에는 API로 받아옵니다)
const FAKE_COMMENTS = [
  { id: 1, author: "헬린이", text: "정말 대단하세요! 尊敬します!" },
  { id: 2, author: "득근맨", text: "와... 저도 언젠가는..." },
];

export default function PostCard({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  // --- 여기에 새로운 상태를 추가합니다 ---
  const [commentsVisible, setCommentsVisible] = useState(false);

  if (!post) return null;
  // 3. '좋아요' 버튼을 클릭했을 때 실행될 함수
  const handleLikeClick = () => {
    // isLiked 상태를 현재와 반대로 뒤집습니다 (true -> false, false -> true)
    setIsLiked(!isLiked);

    // isLiked 상태에 따라 좋아요 수를 1 증가시키거나 감소시킵니다.
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);

    // TODO: 나중에 여기에 실제 백엔드 API (axios.post)를 호출하는 코드를 추가합니다.
  };

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      {/* --- 게시물 헤더 --- */}
      <div className="flex items-center p-4">
        <img
          src={post.author.avatarUrl}
          alt={post.author.nickname}
          className="h-10 w-10 rounded-full object-cover"
        />
        <span className="ml-3 font-semibold">{post.author.nickname}</span>
      </div>

      {/* --- 게시물 이미지 --- */}
      {post.imageUrl && (
        <img src={post.imageUrl} alt="Post content" className="h-auto w-full" />
      )}

      {/* --- 게시물 액션 버튼 --- */}
      {/* --- 게시물 액션 버튼 --- */}
      <div className="flex gap-4 border-t border-gray-200 p-2">
        {/* '좋아요' 버튼: onClick에 handleLikeClick을 연결 */}
        <button onClick={handleLikeClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
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

        {/* '댓글' 버튼: onClick에 setCommentsVisible을 연결 */}
        <button
          onClick={() => setCommentsVisible(!commentsVisible)}
          className="text-gray-500 hover:text-blue-500"
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
        </button>
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
      {commentsVisible && (
        <div className="border-t border-gray-200 p-4">
          <div className="mb-4 space-y-2">
            {FAKE_COMMENTS.map((comment) => (
              <div key={comment.id} className="text-sm">
                <span className="font-semibold">{comment.author}</span>
                <span className="ml-2">{comment.text}</span>
              </div>
            ))}
          </div>
          <form className="flex gap-2">
            <input type="text" placeholder="댓글 달기..." /* ... */ />
            <button type="submit" /* ... */>게시</button>
          </form>
        </div>
      )}
    </div>
  );
}
