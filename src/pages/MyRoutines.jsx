import React, { useState, useEffect } from "react"; // 👈 1. useState, useEffect import
import { Link, useNavigate } from "react-router-dom"; // 👈 2. useNavigate import (수정/삭제 후 이동용)
import api from "../api/axios"; // 👈 3. api 인스턴스 import

export default function MyRoutines() {
  const navigate = useNavigate();

  const [routines, setRoutines] = useState([
    { id: 1, name: "3분할 가슴/삼두 운동", exerciseCount: 5 },
    { id: 2, name: "하체 집중의 날", exerciseCount: 4 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 👈 5. 페이지 로드 시 내 루틴 목록을 불러오는 useEffect
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        setLoading(true);
        // ✅ GET /api/routine (내 전체 루틴 조회) - 우리가 유추한 엔드포인트
        const response = await api.get("/api/routine");
        setRoutines(response.data);
      } catch (err) {
        console.error("루틴 목록을 불러오는 데 실패했습니다:", err);
        setError("루틴 목록을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoutines();
  }, []); // 처음 렌더링될 때 한 번만 실행

  // 👈 6. 루틴 삭제 핸들러 함수 추가
  const handleRoutineDelete = async (routineId) => {
    if (!window.confirm("정말로 이 루틴을 삭제하시겠습니까?")) {
      return;
    }
    try {
      // ✅ DELETE /api/routine/{routineId} (루틴 삭제)
      await api.delete(`/api/routine/${routineId}`);

      // 성공 시, 화면(상태)에서도 해당 루틴을 즉시 제거
      setRoutines((prevRoutines) => prevRoutines.filter((r) => r.id !== routineId));
      alert("루틴이 삭제되었습니다.");
    } catch (err) {
      console.error("루틴 삭제 실패:", err);
      alert("루틴 삭제에 실패했습니다.");
    }
  };
  
  // 👈 7. 로딩 및 에러 상태 UI 처리
  if (loading) {
    return <div className="p-8 text-center">루틴 목록을 불러오는 중...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">나의 루틴</h1>
        {/* '새 루틴 만들기' 페이지로 이동하는 버튼 */}
        <Link
          to="/routines/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
        >
          + 새 루틴 만들기
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {routines.length > 0 ? (
          routines.map((routine) => (
            <div
              key={routine.id} // 백엔드 응답의 고유 ID가 'id'라고 가정
              className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
            >
              <div>
                <p className="font-semibold">{routine.routineName}</p> {/* 백엔드 응답 key가 'routineName'이라고 가정 */}
                <p className="text-sm text-gray-500">
                  {routine.exerciseCount || routine.details?.length || 0}개의 운동
                </p>
              </div>
              {/* 👈 8. 수정/삭제 버튼 기능 연결 */}
              <div className="flex gap-4">
                <button 
                  onClick={() => navigate(`/routines/edit/${routine.id}`)} // 수정 페이지로 이동
                  className="text-sm font-semibold text-blue-600 hover:text-blue-500"
                >
                  수정
                </button>
                <button 
                  onClick={() => handleRoutineDelete(routine.id)}
                  className="text-sm font-semibold text-red-600 hover:text-red-500"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-gray-500">
            <p>아직 저장된 루틴이 없습니다.</p>
            <p>새로운 루틴을 만들어보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}