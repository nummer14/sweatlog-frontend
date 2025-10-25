import React, { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import api from "@/api/axios";

function toArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  return [];
}

export default function RoutineDetail() {
  const { id } = useParams();
  const { state } = useLocation();

  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(!state);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1) 목록에서 state로 넘어온 경우 바로 사용
    if (state) {
      const r = state;
      setRoutine({
        ...r,
        id: r.id ?? r.routineId,
        routineName: r.routineName ?? r.name ?? "루틴",
        details: Array.isArray(r.details) ? r.details : [],
      });
      return;
    }

    // 2) state가 없으면 목록을 크게 받아서 찾아보기
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/routine", {
          params: { page: 0, size: 1000 },
        });
        const found = toArray(res.data).find(
          (r) => String(r.id ?? r.routineId) === String(id)
        );
        if (!found) throw new Error("루틴을 찾을 수 없습니다.");
        setRoutine({
          ...found,
          id: found.id ?? found.routineId,
          routineName: found.routineName ?? found.name ?? "루틴",
          details: Array.isArray(found.details) ? found.details : [],
        });
      } catch (e) {
        console.error(e);
        setError("루틴 정보를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, state]);

  if (loading) return <div className="p-8 text-center">불러오는 중...</div>;
  if (error)
    return (
      <div className="container mx-auto max-w-2xl p-4">
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {error}
        </div>
      </div>
    );
  if (!routine) return null;

  return (
    <div className="container mx-auto max-w-2xl p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{routine.routineName}</h1>
        <div className="flex gap-2">
          <Link
            to={`/routines/edit/${routine.id}`}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-200"
          >
            수정
          </Link>
          <Link
            to="/routines"
            className="rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            목록
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2">운동</th>
              <th className="px-3 py-2">무게</th>
              <th className="px-3 py-2">횟수</th>
              <th className="px-3 py-2">세트</th>
              {"duration" in (routine.details?.[0] ?? {}) && (
                <th className="px-3 py-2">시간(분)</th>
              )}
            </tr>
          </thead>
          <tbody>
            {routine.details.map((d, i) => (
              <tr key={`d-${i}`} className="border-t">
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
    </div>
  );
}
