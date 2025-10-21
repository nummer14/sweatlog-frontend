import React, { useState } from "react";
import { Link } from "react-router-dom"; // 페이지 이동을 위한 Link

export default function MyRoutines() {
  // 지금은 가짜 데이터로 루틴 목록을 만듭니다.
  // 나중에 백엔드에서 실제 데이터를 받아오도록 수정할 겁니다.
  const [routines, setRoutines] = useState([
    { id: 1, name: "3분할 가슴/삼두 운동", exerciseCount: 5 },
    { id: 2, name: "하체 집중의 날", exerciseCount: 4 },
  ]);

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
              key={routine.id}
              className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
            >
              <div>
                <p className="font-semibold">{routine.name}</p>
                <p className="text-sm text-gray-500">
                  {routine.exerciseCount}개의 운동
                </p>
              </div>
              <div>
                {/* TODO: 나중에 수정/삭제 버튼을 여기에 추가합니다. */}
                <button className="text-sm text-gray-400">수정</button>
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