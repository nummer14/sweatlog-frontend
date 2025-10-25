import React, { useEffect, useState } from "react";
import api from "@/api/axios";

export default function Comments({ postId }) {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    setLoading(true);
    try {
      // ✅ GET /api/comments/posts/{postId}
      const res = await api.get(`/comments/posts/${postId}`, {
        params: { page: 0, size: 50 },
      });
      const arr = Array.isArray(res.data?.content) ? res.data.content : [];
      setItems(arr);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  const add = async () => {
    if (!text.trim()) return;
    // CommentRequest 필드명이 보편적으로 'content'인 케이스와 대비
    const candidates = [
      { content: text.trim() },
      { text: text.trim() },
      { body: text.trim() },
    ];

    let ok = false;
    for (const p of candidates) {
      try {
        // ✅ POST /api/comments/posts/{postId}
        await api.post(`/comments/posts/${postId}`, p);
        ok = true;
        break;
      } catch {
        /* try next */
      }
    }
    if (!ok) return alert("댓글 등록 실패");

    setText("");
    fetchComments();
  };

  const remove = async (id) => {
    if (!window.confirm("이 댓글을 삭제할까요?")) return;
    await api.delete(`/comments/${id}`);
    fetchComments();
  };

  return (
    <div className="mt-6">
      <h3 className="mb-2 text-lg font-semibold">댓글</h3>

      <div className="mb-4 flex gap-2">
        <input
          className="flex-1 rounded-md border px-3 py-2"
          placeholder="댓글을 입력하세요"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          onClick={add}
          className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          등록
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">불러오는 중...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500">아직 댓글이 없습니다.</div>
      ) : (
        <ul className="space-y-2">
          {items.map((c) => (
            <li key={c.id} className="rounded-md border p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold">
                    {c.authorName ?? "익명"}
                  </div>
                  <div className="text-sm">{c.content ?? c.text ?? c.body}</div>
                </div>
                <button
                  onClick={() => remove(c.id)}
                  className="text-xs text-rose-600 hover:text-rose-500"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
