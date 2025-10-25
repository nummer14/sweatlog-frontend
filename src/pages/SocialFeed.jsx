import React, { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import api from "@/api/axios";

// PageImpl/배열 모두 수용 + user/author 정규화
function normalizePosts(raw) {
  const list = Array.isArray(raw?.content)
    ? raw.content
    : Array.isArray(raw)
    ? raw
    : [];

  return list.map((p) => {
    const u = p.user ?? p.author ?? undefined;
    const author =
      p.author ??
      (u
        ? {
            id: u.id,
            nickname: u.nickname ?? u.fullName ?? u.username ?? "사용자",
            avatarUrl: u.avatarUrl ?? u.profileImageUrl ?? null,
          }
        : undefined);

    return {
      ...p,
      author,
      id:
        p.id ??
        p.postId ??
        (u?.id
          ? `${u.id}-${p.date ?? ""}-${p.startTime ?? ""}`
          : `tmp-${Math.random().toString(36).slice(2)}`),
    };
  });
}

export default function SocialFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/posts?page=0&size=20");
        setPosts(normalizePosts(res.data));
      } catch (e) {
        console.error(e);
        setError("피드를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto max-w-xl space-y-4 p-4">
        <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-64 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-xl p-4">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-xl space-y-6 p-4">
      <h1 className="text-3xl font-bold">피드</h1>

      {posts.length > 0 ? (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      ) : (
        <div className="py-8 text-center text-gray-500">
          아직 게시물이 없습니다. 첫 번째 운동 기록을 남겨보세요!
        </div>
      )}
    </div>
  );
}
