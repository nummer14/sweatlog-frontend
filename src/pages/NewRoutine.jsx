import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import api from '../api/axios'; // (나중에 실제 저장 시 필요)

// 운동 항목의 초기 상태 (Post.jsx와 동일)
const createNewWorkout = () => ({
  id: Date.now() + Math.random(), // 고유 ID를 더 확실하게
  name: "",
  sets: [{ id: Date.now(), weight: "", reps: "" }],
});

export default function NewRoutine() {
  const navigate = useNavigate();

  // 루틴 이름과 운동 목록을 관리하는 상태
  const [routineName, setRoutineName] = useState("");
  const [workouts, setWorkouts] = useState([createNewWorkout()]);

  // --- Post.jsx에서 가져온 핸들러 함수들 (거의 동일) ---
  const handleWorkoutNameChange = (id, value) => {
    setWorkouts(
      workouts.map((w) => (w.id === id ? { ...w, name: value } : w))
    );
  };
  const handleSetChange = (workoutId, setId, e) => {
    const { name, value } = e.target;
    setWorkouts(
      workouts.map((w) => {
        if (w.id === workoutId) {
          const updatedSets = w.sets.map((s) =>
            s.id === setId ? { ...s, [name]: value } : s
          );
          return { ...w, sets: updatedSets };
        }
        return w;
      })
    );
  };
  const addSet = (workoutId) => {
    setWorkouts(
      workouts.map((w) => {
        if (w.id === workoutId) {
          return {
            ...w,
            sets: [...w.sets, { id: Date.now(), weight: "", reps: "" }],
          };
        }
        return w;
      })
    );
  };
  const addWorkout = () => {
    setWorkouts([...workouts, createNewWorkout()]);
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!routineName) {
      alert("루틴 이름을 입력해주세요.");
      return;
    }

    const newRoutineData = {
      name: routineName,
      workouts: workouts,
    };
    
    console.log("백엔드로 전송될 새 루틴 데이터:", newRoutineData);
    alert("새로운 루틴이 (가상으로) 저장되었습니다.");
    
    // TODO: 나중에 여기에 실제 백엔드 API (api.post('/api/routines')) 호출
    
    // 저장이 완료되면 '나의 루틴' 목록 페이지로 돌아갑니다.
    navigate("/routines");
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-3xl font-bold">새 루틴 만들기</h1>
      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-8 shadow-lg">
        {/* --- 1. 루틴 이름 --- */}
        <div>
          <label htmlFor="routineName" className="block text-sm font-medium text-gray-900">루틴 이름</label>
          <input type="text" id="routineName" value={routineName} onChange={(e) => setRoutineName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300" placeholder="예: 3분할 가슴 운동"/>
        </div>
        
        {/* --- 2. 운동 목록 (Post.jsx와 동일한 UI) --- */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">운동 목록</h2>
          {workouts.map((workout, workoutIndex) => (
            <div key={workout.id} className="space-y-4 rounded-md border p-4">
              <input type="text" placeholder={`운동 ${workoutIndex + 1}`} value={workout.name} onChange={(e) => handleWorkoutNameChange(workout.id, e.target.value)} className="block w-full rounded-md border-gray-300 font-semibold"/>
              {workout.sets.map((set, setIndex) => (
                <div key={set.id} className="flex items-center gap-2">
                  <span className="w-16 text-sm text-gray-500">{setIndex + 1}세트</span>
                  <input type="number" name="weight" placeholder="무게(kg)" value={set.weight} onChange={(e) => handleSetChange(workout.id, set.id, e)} className="block w-full rounded-md border-gray-300"/>
                  <input type="number" name="reps" placeholder="횟수" value={set.reps} onChange={(e) => handleSetChange(workout.id, set.id, e)} className="block w-full rounded-md border-gray-300"/>
                </div>
              ))}
              <button type="button" onClick={() => addSet(workout.id)} className="text-sm font-medium text-blue-600">
                + 세트 추가
              </button>
            </div>
          ))}
          <button type="button" onClick={addWorkout} className="w-full rounded-md border-2 border-dashed py-2 text-sm font-medium text-gray-500">
            + 다른 운동 추가하기
          </button>
        </div>

        {/* --- 3. 저장 버튼 --- */}
        <div className="text-right">
          <button type="submit" className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white">
            루틴 저장
          </button>
        </div>
      </form>
    </div>
  );
}