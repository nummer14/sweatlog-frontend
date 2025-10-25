import React, { useEffect, useState } from "react";
import api from "@/api/axios";

export default function UserProfile() {
  const [me, setMe] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [myPostCount, setMyPostCount] = useState(0);

  async function loadMe() {
    const res = await api.get("/users/me");
    setMe(res.data);
  }

  async function loadMyPostCount(userId) {
    // 페이지네이션 totalElements 이용
    const res = await api.get(`/posts/user/${userId}`, {
      params: { page: 0, size: 1 },
    });
    setMyPostCount(Number(res.data?.totalElements ?? 0));
  }

  useEffect(() => {
    (async () => {
      await loadMe();
    })();
  }, []);

  useEffect(() => {
    if (me?.id) loadMyPostCount(me.id);
  }, [me?.id]);

  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);

      // 1) 이미지 업로드
      const up = await api.post("/upload/image", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = up.data?.imageUrl;

      // 2) 프로필 업서트
      const bodyCandidates = [
        { profileImageUrl: imageUrl },
        { avatarUrl: imageUrl },
        { imageUrl },
      ];
      let ok = false;
      for (const b of bodyCandidates) {
        try {
          await api.put("/users/profile/setting", b);
          ok = true;
          break;
        } catch {
          /* try next */
        }
      }
      if (!ok) alert("프로필 저장 실패 (업로드는 성공)");

      await loadMe();
      alert("프로필 이미지가 업데이트되었습니다.");
    } catch (e2) {
      console.error(e2);
      alert("이미지 업로드 실패");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!me) return <div className="p-6">불러오는 중...</div>;

  const avatar =
    me.profileImageUrl ||
    me.avatarUrl ||
    `https://i.pravatar.cc/150?u=${me.id}`;

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-6">
      <div className="flex items-center gap-4">
        <img
          src={avatar}
          alt="프로필"
          className="h-24 w-24 rounded-full object-cover"
          onError={(e) => (e.currentTarget.src = "https://placehold.co/96x96")}
        />
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold">
              {me.fullName ?? me.username ?? "사용자"}
            </h1>
            {me.email && <span className="text-gray-500">{me.email}</span>}
          </div>
          <div className="mt-2 flex gap-6 text-sm text-gray-600">
            <span>게시물 {myPostCount}</span>
            <span>팔로워 0</span>
            <span>팔로잉 0</span>
          </div>
          <div className="mt-3">
            <label className="inline-block cursor-pointer rounded-md border px-3 py-1 text-sm hover:bg-gray-50">
              {uploading ? "업로드 중..." : "프로필 이미지 변경"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onPickFile}
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
