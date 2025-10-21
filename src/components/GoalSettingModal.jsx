import React, { useState } from "react";
import Modal from "./Modal"; // 우리가 이미 만들어 둔 Modal 컴포넌트를 재사용합니다.

// 이 컴포넌트는 3개의 props를 받습니다:
// - isOpen: 모달이 열려있는지 여부
// - onClose: 모달을 닫는 함수
// - onAddGoal: 새로 만든 목표 데이터를 부모(MyProfile)에게 전달하는 함수
export default function GoalSettingModal({ isOpen, onClose, onAddGoal }) {
  // 폼의 초기 상태
  const initialState = {
    type: "체중 감량",
    targetValue: "",
    unit: "kg",
    exerciseName: "", // 근력 향상 목표를 위한 필드
  };

  const [goalData, setGoalData] = useState(initialState);

  // 폼 내용이 바뀔 때마다 상태를 업데이트하는 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newGoalData = { ...goalData, [name]: value };

    // 목표 종류에 따라 단위를 자동으로 바꿔줍니다. (UX 개선)
    if (name === "type") {
      if (value === "체중 감량" || value === "근력 향상") newGoalData.unit = "kg";
      else if (value === "지구력 향상") newGoalData.unit = "km";
      else if (value === "운동 빈도") newGoalData.unit = "회";
    }

    setGoalData(newGoalData);
  };

  // '목표 추가' 버튼을 눌렀을 때 실행될 함수
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!goalData.targetValue) {
      alert("목표 수치를 입력해주세요.");
      return;
    }
    // 부모에게 완성된 목표 데이터를 전달합니다.
    onAddGoal({
      id: Date.now(), // 고유 ID 생성
      ...goalData,
    });
    setGoalData(initialState); // 폼을 초기화합니다.
    onClose(); // 모달을 닫습니다.
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-xl font-bold">새 목표 설정</h2>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">목표 종류</label>
          <select id="type" name="type" value={goalData.type} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300">
            <option>체중 감량</option>
            <option>근력 향상</option>
            <option>지구력 향상</option>
            <option>운동 빈도</option>
          </select>
        </div>

        {/* 목표 종류가 '근력 향상'일 때만 운동 이름 입력창을 보여줍니다. */}
        {goalData.type === "근력 향상" && (
          <div>
            <label htmlFor="exerciseName" className="block text-sm font-medium text-gray-700">운동 이름</label>
            <input type="text" id="exerciseName" name="exerciseName" value={goalData.exerciseName} onChange={handleChange} placeholder="예: 벤치프레스" className="mt-1 block w-full rounded-md border-gray-300"/>
          </div>
        )}

        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700">목표 수치</label>
            <input type="number" id="targetValue" name="targetValue" value={goalData.targetValue} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300"/>
          </div>
          <span className="pb-2 font-medium">{goalData.unit}</span>
        </div>

        <div className="text-right">
          <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white">
            목표 추가
          </button>
        </div>
      </form>
    </Modal>
  );
}