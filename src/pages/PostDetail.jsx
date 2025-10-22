import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PostCard from "@/components/PostCard";
import useAuthStore from "@/store/authStore";
import api from "@/api/axios"; // 👈 2. axios 인스턴스 import

export default function PostDetail() {
  const { postId } = useParams(); // URL에서 postId를 가져옵니다 (이미 잘 구현되어 있음)
  const { user } = useAuthStore();

  // 👈 3. 실제 데이터를 위한 상태들 정의
  const [post, setPost] = useState(null); // 게시물 상세 정보
  const [comments, setComments] = useState([]); // 댓글 목록
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [newComment, setNewComment] = useState("");

  // 👈 4. postId가 바뀔 때마다 해당 게시물의 상세 정보와 댓글을 서버에서 가져옵니다.
  useEffect(() => {
    // postId가 없으면 아무것도 하지 않음
    if (!postId) {
      setLoading(false);
      return;
    }

    const fetchPostDetails = async () => {
      try {
        setLoading(true);
        // 게시물 상세 정보와 댓글 목록을 동시에 병렬로 요청합니다.
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/api/posts/${postId}`), // ✅ GET /api/posts/{postId} (게시물 상세 조회)
          api.get(`/api/comments/posts/${postId}`), // ✅ GET /api/comments/posts/{postId} (댓글 조회)
        ]);

        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        console.error("게시물 상세 정보를 불러오는 데 실패했습니다:", err);
        setError("게시물을 찾을 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [postId]); // postId가 변경될 때마다 이 useEffect가 다시 실행됩니다.

  // 👈 5. 댓글 삭제 기능을 API와 연동
  const handleCommentDelete = async (commentId) => {
    if (!window.confirm("정말로 이 댓글을 삭제하시겠습니까?")) {
      return;
    }
    try {
      // ✅ DELETE /api/comments/{commentId} (댓글 삭제)
      await api.delete(`/api/comments/${commentId}`);
      
      // 화면(상태)에서도 해당 댓글을 즉시 제거합니다.
      setComments((prevComments) => prevComments.filter((c) => c.id !== commentId));
      alert("댓글이 삭제되었습니다.");
    } catch (err) {
      console.error("댓글 삭제 실패:", err);
      alert("댓글 삭제에 실패했습니다.");
    }
  };

  // 👈 6. 댓글 생성 기능을 API와 연동
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const requestBody = { text: newComment };
      const response = await api.post(`/api/comments/posts/${postId}`, requestBody);
      setComments((prevComments) => [...prevComments, response.data]);
      setNewComment("");
    } catch (err) { // 👈 catch (err) 다음에 '{'를 추가하고 줄바꿈
      console.error("댓글 작성 실패:", err);
      alert("댓글 작성에 실패했습니다.");
    } // 👈 '}' 로 블록을 닫아줍니다.
  };

  // 👈 7. 로딩 및 에러 UI 처리
  if (loading) {
    return <div className="p-8 text-center">게시물을 불러오는 중...</div>;
  }
  
  // 에러 발생 시의 UI는 기존 코드가 이미 잘 처리하고 있으므로 그대로 사용
  if (error || !post) {
    return (
      <div className="text-center p-8">
        <p>{error || "게시물을 찾을 수 없습니다."}</p>
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