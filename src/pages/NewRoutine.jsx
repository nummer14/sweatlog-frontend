import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

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
  const [day, setDay] = useState("MONDAY"); // 기본값을 'MONDAY'로 설정
  const [isSubmitting, setIsSubmitting] = useState(false); // 👈 2. 중복 제출 방지 상태 추가

  // --- Post.jsx에서 가져온 핸들러 함수들 (거의 동일) ---
  const handleWorkoutNameChange = (id, value) => {
    setWorkouts(workouts.map((w) => (w.id === id ? { ...w, name: value } : w)));
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    // DTO에 routineName이 없으므로, 이 검사는 일단 주석 처리하거나 다른 방식으로 처리해야 합니다.
    // if (!routineName) {
    //   alert("루틴 이름을 입력해주세요.");
    //   return;
    // }
    if (isSubmitting) return;
    setIsSubmitting(true);

    // 👈 [핵심 수정] 백엔드의 실제 DTO 구조에 맞춰 finalData를 재구성합니다.
    const finalData = {
      // 1. 'day' 필드 추가
      day: day,

      // 2. key 이름을 'details'로 변경
      details: workouts.map((workout, index) => ({
        // 3. key 이름을 'name'으로 변경
        name: workout.name,

        // 4. 'orderNumber' 필드 추가: 배열의 순서를 그대로 사용합니다.
        orderNumber: index + 1,

        // 5. 'rep'와 'set' 필드:
        // 프론트 UI는 세트마다 reps가 있지만, DTO는 운동당 하나의 rep/set만 받습니다.
        // 여기서는 첫 번째 세트의 값을 대표로 사용하거나, 평균/총합 등을 계산해야 합니다.
        // 우선 첫 번째 세트의 값으로 보내도록 구현합니다.
        rep: workout.sets[0] ? parseInt(workout.sets[0].reps, 10) || 0 : 0,
        set: workout.sets.length, // 총 세트의 개수를 보냅니다.

        // 'time' 필드는 현재 UI에 없으므로 보내지 않습니다. (백엔드에서 nullable해야 함)
        // 'weight' 필드는 DTO에 없으므로 보내지 않습니다.
      })),
    };

    try {
      console.log("백엔드로 전송될 최종 데이터:", finalData);

      // API 엔드포인트는 /api/routine 그대로 사용
      await api.post("/api/routine", finalData);

      alert("새로운 루틴이 성공적으로 저장되었습니다.");

      navigate("/routines");
    } catch (error) {
      console.error("루틴 저장 에러:", error);
      alert("루틴 저장에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="mb-6 text-3xl font-bold">새 루틴 만들기</h1>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-white p-8 shadow-lg"
      >
        {/* --- 1. 루틴 이름 --- */}
        <div>
          <label
            htmlFor="routineName"
            className="block text-sm font-medium text-gray-900"
          >
            루틴 이름
          </label>
          <input
            type="text"
            id="routineName"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300"
            placeholder="예: 3분할 가슴 운동"
          />
        </div>
        <div>
          <label
            htmlFor="day"
            className="block text-sm font-medium text-gray-900"
          >
            요일 선택
          </label>
          <select
            id="day"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="MONDAY">월요일</option>
            <option value="TUESDAY">화요일</option>
            <option value="WEDNESDAY">수요일</option>
            <option value="THURSDAY">목요일</option>
            <option value="FRIDAY">금요일</option>
            <option value="SATURDAY">토요일</option>
            <option value="SUNDAY">일요일</option>
          </select>
        </div>

        {/* --- 2. 운동 목록 (Post.jsx와 동일한 UI) --- */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">운동 목록</h2>
          {workouts.map((workout, workoutIndex) => (
            <div key={workout.id} className="space-y-4 rounded-md border p-4">
              <input
                type="text"
                placeholder={`운동 ${workoutIndex + 1}`}
                value={workout.name}
                onChange={(e) =>
                  handleWorkoutNameChange(workout.id, e.target.value)
                }
                className="block w-full rounded-md border-gray-300 font-semibold"
              />
              {workout.sets.map((set, setIndex) => (
                <div key={set.id} className="flex items-center gap-2">
                  <span className="w-16 text-sm text-gray-500">
                    {setIndex + 1}세트
                  </span>
                  <input
                    type="number"
                    name="weight"
                    placeholder="무게(kg)"
                    value={set.weight}
                    onChange={(e) => handleSetChange(workout.id, set.id, e)}
                    className="block w-full rounded-md border-gray-300"
                  />
                  <input
                    type="number"
                    name="reps"
                    placeholder="횟수"
                    value={set.reps}
                    onChange={(e) => handleSetChange(workout.id, set.id, e)}
                    className="block w-full rounded-md border-gray-300"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => addSet(workout.id)}
                className="text-sm font-medium text-blue-600"
              >
                + 세트 추가
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addWorkout}
            className="w-full rounded-md border-2 border-dashed py-2 text-sm font-medium text-gray-500"
          >
            + 다른 운동 추가하기
          </button>
        </div>

        {/* --- 3. 저장 버튼 --- */}
        <div className="text-right">
          <button
            type="submit"
            disabled={isSubmitting} // 👈 6. 로딩 상태일 때 버튼 비활성화
            className="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white disabled:bg-gray-400"
          >
            {isSubmitting ? "저장 중..." : "루틴 저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
