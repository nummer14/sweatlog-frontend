import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "@/api/axios";

export default function RoutineEdit() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [routineName, setRoutineName] = useState("");
  const [details, setDetails] = useState([
    { name: "", weight: "", reps: "", sets: "" },
  ]);

  useEffect(() => {
    // 목록/상세에서 넘어온 state 우선
    if (state) {
      const r = state;
      setRoutineName(r.routineName ?? r.name ?? "");
      setDetails(
        Array.isArray(r.details) && r.details.length
          ? r.details
          : [{ name: "", weight: "", reps: "", sets: "" }]
      );
      return;
    }
    // 없으면 전체 받아서 찾아오기
    (async () => {
      const res = await api.get("/routine", {
        params: { page: 0, size: 1000 },
      });
      const arr = Array.isArray(res.data?.content) ? res.data.content : [];
      const found = arr.find((r) => String(r.id ?? r.routineId) === String(id));
      if (found) {
        setRoutineName(found.routineName ?? found.name ?? "");
        setDetails(
          Array.isArray(found.details) && found.details.length
            ? found.details
            : [{ name: "", weight: "", reps: "", sets: "" }]
        );
      }
    })();
  }, [id, state]);

  const addRow = () =>
    setDetails((arr) => [...arr, { name: "", weight: "", reps: "", sets: "" }]);
  const removeRow = (idx) =>
    setDetails((arr) => arr.filter((_, i) => i !== idx));
  const changeRow = (idx, key, val) =>
    setDetails((arr) =>
      arr.map((r, i) => (i === idx ? { ...r, [key]: val } : r))
    );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleaned = details
      .filter((d) => d.name?.trim())
      .map((d) => ({
        name: d.name?.trim(),
        weight: d.weight !== "" ? Number(d.weight) : null,
        reps: d.reps !== "" ? Number(d.reps) : null,
        sets: d.sets !== "" ? Number(d.sets) : null,
      }));

    const payloads = [
      { routineName, details: cleaned },
      { name: routineName, details: cleaned },
      { routineName, routineDetails: cleaned },
    ];

    let ok = false,
      lastErr = null;
    for (const p of payloads) {
      try {
        await api.put(`/routine/${id}`, p);
        ok = true;
        break;
      } catch (e) {
        lastErr = e;
      }
    }

    if (!ok) {
      const msg =
        lastErr?.response?.data?.message ||
        JSON.stringify(lastErr?.response?.data ?? {});
      alert("수정 실패\n" + msg);
      return;
    }
    alert("수정되었습니다.");
    navigate(`/routines/${id}`);
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-6">
      <h1 className="text-3xl font-bold">루틴 수정</h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium">루틴 이름</label>
          <input
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            required
          />
        </div>

        <div className="space-y-3">
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

          {details.map((d, i) => (
            <div key={i} className="grid grid-cols-12 gap-2">
              <input
                className="col-span-4 rounded-md border px-3 py-2"
                value={d.name ?? ""}
                onChange={(e) => changeRow(i, "name", e.target.value)}
              />
              <input
                className="col-span-2 rounded-md border px-3 py-2"
                value={d.weight ?? ""}
                onChange={(e) => changeRow(i, "weight", e.target.value)}
              />
              <input
                className="col-span-2 rounded-md border px-3 py-2"
                value={d.reps ?? ""}
                onChange={(e) => changeRow(i, "reps", e.target.value)}
              />
              <input
                className="col-span-2 rounded-md border px-3 py-2"
                value={d.sets ?? ""}
                onChange={(e) => changeRow(i, "sets", e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeRow(i)}
                className="col-span-2 rounded-md border px-3 py-2 text-sm"
              >
                제거
              </button>
            </div>
          ))}
        </div>

        <button className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          저장
        </button>
      </form>
    </div>
  );
}
