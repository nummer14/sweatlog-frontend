import React, { useState } from "react";
import { Link } from "react-router-dom";

/**
 * 백엔드 응답 예(일부):
 * post: { id, title, date, startTime, endTime, category, memo, imageUrl, liked, likeCount, commentCount,
 *         user: { id, username, fullName, nickname, profileImageUrl } }
 * 또는 post.author 가 있을 수도 있음.
 */
export default function PostCard({ post }) {
  if (!post) return null;

  // author/user 호환 + 안전 기본값
  const author = post.author ?? post.user ?? {};
  const nickname =
    author.nickname ?? author.fullName ?? author.username ?? "사용자";
  const avatarSrc =
    author.avatarUrl ??
    author.profileImageUrl ??
    (author.id
      ? `https://i.pravatar.cc/150?u=${author.id}`
      : "https://placehold.co/80x80");

  const [isLiked, setIsLiked] = useState(Boolean(post.liked));
  const [likeCount, setLikeCount] = useState(Number(post.likeCount ?? 0));
  const toggleLike = () => {
    setIsLiked((v) => !v);
    setLikeCount((c) => (isLiked ? Math.max(0, c - 1) : c + 1));
  };

  const createdAt =
    post.date && post.startTime
      ? `${post.date} ${post.startTime}`
      : post.date ?? "";

  return (
    <article className="overflow-hidden rounded-lg bg-white shadow">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <img
          src={avatarSrc}
          alt={`${nickname} 프로필`}
          className="h-10 w-10 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/80x80";
          }}
        />
        <div className="min-w-0">
          {author.id ? (
            <Link
              to={`/profile/${author.id}`}
              className="block truncate font-semibold hover:underline"
            >
              {nickname}
            </Link>
          ) : (
            <span className="block truncate font-semibold">{nickname}</span>
          )}
          <div className="text-sm text-gray-500">{createdAt}</div>
        </div>
        {post.category && (
          <span className="ml-auto rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
            {post.category}
          </span>
        )}
      </div>

      {/* 본문 */}
      <div className="space-y-3 px-4 pb-4">
        {post.title && <h2 className="text-lg font-semibold">{post.title}</h2>}
        {post.memo && (
          <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
            {post.memo}
          </p>
        )}
        {post.imageUrl && (
          <Link to={`/post/${post.id ?? post.postId ?? ""}`} className="block">
            <img
              src={post.imageUrl}
              alt={`Post by ${nickname}`}
              className="max-h-[520px] w-full rounded-md object-cover"
              loading="lazy"
            />
          </Link>
        )}

        {/* 운동 상세 */}
        {Array.isArray(post.details) && post.details.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2">운동</th>
                  <th className="px-3 py-2">무게</th>
                  <th className="px-3 py-2">횟수</th>
                  <th className="px-3 py-2">세트</th>
                  {"duration" in (post.details?.[0] ?? {}) && (
                    <th className="px-3 py-2">시간(분)</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {post.details.map((d, i) => (
                  <tr
                    key={`${post.id ?? "p"}-detail-${i}`}
                    className="border-t"
                  >
                    <td className="px-3 py-2">{d.name ?? "-"}</td>
                    <td className="px-3 py-2">{d.weight ?? "-"}</td>
                    <td className="px-3 py-2">{d.reps ?? "-"}</td>
                    <td className="px-3 py-2">{d.sets ?? "-"}</td>
                    {"duration" in d && (
                      <td className="px-3 py-2">{d.duration ?? "-"}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 푸터 */}
      <div className="flex items-center gap-6 border-t px-4 py-3 text-sm">
        <button
          type="button"
          onClick={toggleLike}
          className={`flex items-center gap-2 ${
            isLiked ? "text-rose-600" : "text-gray-700"
          } hover:opacity-80`}
        >
          <span aria-hidden>❤️</span>
          <span>{likeCount}</span>
        </button>
        <div className="flex items-center gap-2 text-gray-700">
          <span aria-hidden>💬</span>
          <span>{post.commentCount ?? 0}</span>
        </div>
        {post.endTime && (
          <div className="ml-auto text-gray-500">
            {post.startTime} ~ {post.endTime}
          </div>
        )}
      </div>
    </article>
  );
}
