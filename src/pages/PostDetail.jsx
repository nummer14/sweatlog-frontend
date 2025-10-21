import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FAKE_POSTS } from "@/mocks/mockPosts.js";
import PostCard from "@/components/PostCard";
import useAuthStore from "@/store/authStore";

export default function PostDetail() {
  const { postId } = useParams();
  const { user } = useAuthStore();
  const [post, setPost] = useState(null);

  const [comments, setComments] = useState([
    { id: 1, author: "헬린이", text: "정말 대단하세요! 尊敬します!" },
    { id: 2, author: "득근맨", text: "와... 저도 언젠가는..." },
  ]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const foundPost = FAKE_POSTS.find(
      (p) => p.id === parseInt(postId, 10)
    );
    setPost(foundPost);
  }, [postId]);

  const handleCommentDelete = (commentId) => {
    const updatedComments = comments.filter((comment) => comment.id !== commentId);
    setComments(updatedComments);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newCommentObject = {
      id: Date.now(),
      author: user?.nickname || "나",
      text: newComment,
    };
    setComments([...comments, newCommentObject]);
    setNewComment("");
  };

  if (!post) {
    return (
      <div className="text-center p-8">
        <p>게시물을 찾을 수 없습니다.</p>
        <Link to="/feed" className="text-blue-600">피드로 돌아가기</Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-xl p-4">
      <PostCard post={post} />

      <div className="mt-6 rounded-lg bg-white p-4 shadow">
        <h2 className="font-bold mb-4">{comments.length}개의 댓글</h2>
        
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start justify-between text-sm">
              <div>
                <span className="font-semibold">{comment.author}</span>
                <span className="ml-2">{comment.text}</span>
              </div>
              {(user?.nickname === comment.author || comment.author === "나") && (
                <button
                  onClick={() => handleCommentDelete(comment.id)}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  삭제
                </button>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleCommentSubmit} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글 달기..."
            className="flex-grow rounded-md border-gray-300"
          />
          <button type="submit" className="rounded-md bg-blue-600 px-4 text-sm text-white">
            게시
          </button>
        </form>
      </div>
    </div>
  );
}