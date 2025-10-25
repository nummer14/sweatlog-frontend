import React, { useState } from "react";
import api from "@/api/axios";

const today = () => new Date().toISOString().slice(0, 10);

export default function Post() {
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [category, setCategory] = useState("WEIGHT_TRAINING"); // 백엔드 enum 가정
  const [date, setDate] = useState(today());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [rows, setRows] = useState([
    { name: "", weight: "", reps: "", sets: "", duration: "" },
  ]);
  const [saving, setSaving] = useState(false);

  const addRow = () =>
    setRows((a) => [
      ...a,
      { name: "", weight: "", reps: "", sets: "", duration: "" },
    ]);
  const removeRow = (i) => setRows((a) => a.filter((_, idx) => idx !== i));
  const changeRow = (i, k, v) =>
    setRows((a) => a.map((r, idx) => (idx === i ? { ...r, [k]: v } : r)));

  async function tryPost(payload) {
    try {
      const res = await api.post("/posts", payload);
      return res;
    } catch (e) {
      return Promise.reject(e);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);

    const details = rows
      .filter((d) => d.name?.trim())
      .map((d) => ({
        name: d.name?.trim(),
        weight: d.weight !== "" ? Number(d.weight) : null,
        reps: d.reps !== "" ? Number(d.reps) : null,
        sets: d.sets !== "" ? Number(d.sets) : null,
        duration: d.duration !== "" ? Number(d.duration) : null,
      }));

    const ensure = details.length
      ? details
      : [{ name: "운동", weight: 0, reps: 0, sets: 0, duration: 0 }];

    const base = {
      title: title?.trim(),
      memo: memo?.trim(),
      category,
      date, // "YYYY-MM-DD"
      startTime: `${startTime}:00`,
      endTime: `${endTime}:00`,
    };

    const candidates = [
      { ...base, details: ensure },
      { ...base, postDetails: ensure },
      {
        title: base.title,
        memo: base.memo,
        category: base.category,
        postDetails: ensure,
      }, // 시간/날짜 미사용 스키마
    ];

    let lastErr = null;
    for (const p of candidates) {
      try {
        await tryPost(p);
        alert("저장되었습니다.");
        setTitle("");
        setMemo("");
        setRows([{ name: "", weight: "", reps: "", sets: "", duration: "" }]);
        setSaving(false);
        return;
      } catch (e2) {
        lastErr = e2;
      }
    }

    console.error(lastErr);
    const msg =
      lastErr?.response?.data?.message ||
      lastErr?.response?.data?.error ||
      JSON.stringify(lastErr?.response?.data ?? {});
    alert("저장 실패\n" + msg);
    setSaving(false);
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-6">
      <h1 className="text-3xl font-bold">운동 기록하기</h1>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-md border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목"
          required
        />
        <textarea
          className="w-full rounded-md border px-3 py-2"
          rows={4}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="메모"
        />

        <div className="grid grid-cols-2 gap-2">
          <select
            className="rounded-md border px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="WEIGHT_TRAINING">웨이트</option>
            <option value="CARDIO">유산소</option>
            <option value="ETC">기타</option>
          </select>
          <input
            type="date"
            className="rounded-md border px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <input
            type="time"
            className="rounded-md border px-3 py-2"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <input
            type="time"
            className="rounded-md border px-3 py-2"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">운동 상세</label>
            <button
              type="button"
              onClick={addRow}
              className="rounded-md bg-gray-100 px-3 py-1 text-sm hover:bg-gray-200"
            >
              + 추가
            </button>
          </div>

          {rows.map((d, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                className="col-span-4 rounded-md border px-3 py-2"
                placeholder="운동명"
                value={d.name}
                onChange={(e) => changeRow(i, "name", e.target.value)}
              />
              <input
                className="col-span-2 rounded-md border px-3 py-2"
                placeholder="무게"
                value={d.weight}
                onChange={(e) => changeRow(i, "weight", e.target.value)}
              />
              <input
                className="col-span-2 rounded-md border px-3 py-2"
                placeholder="횟수"
                value={d.reps}
                onChange={(e) => changeRow(i, "reps", e.target.value)}
              />
              <input
                className="col-span-2 rounded-md border px-3 py-2"
                placeholder="세트"
                value={d.sets}
                onChange={(e) => changeRow(i, "sets", e.target.value)}
              />
              <input
                className="col-span-1 rounded-md border px-3 py-2"
                placeholder="분"
                value={d.duration}
                onChange={(e) => changeRow(i, "duration", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="col-span-1 rounded-md border px-3 py-2 text-sm"
              >
                제거
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </form>
    </div>
  );
}
