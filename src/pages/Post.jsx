import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import ImageUploader from "../components/ImageUploader";

// 웨이트 운동 항목의 초기 상태
const createNewWorkout = () => ({
  name: "",
  sets: [{ weight: "", reps: "" }],
});

// 유산소 운동 항목의 초기 상태
const createNewCardio = () => ({
  type: "달리기",
  distance: "",
  time: "",
  customType: "",
});

export default function Post() {
  const navigate = useNavigate();

  const [postData, setPostData] = useState({
    date: new Date().toISOString().slice(0, 10),
    startTime: "09:00",
    endTime: "10:00",
    workoutType: "웨이트 트레이닝",
    workouts: [createNewWorkout()],
    cardios: [createNewCardio()], // 유산소 데이터 상태 추가
    memo: "",
  });

  // 업로드된 이미지 URL을 저장할 새로운 상태를 추가합니다.
  const [imageUrl, setImageUrl] = useState("");

  // --- 핸들러 함수들 ---

  // 기본 정보(날짜, 시간, 종류, 메모)를 처리하는 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  // 웨이트 운동의 '운동명'을 변경하는 함수
  const handleWorkoutNameChange = (index, value) => {
    const updatedWorkouts = [...postData.workouts];
    updatedWorkouts[index].name = value;
    setPostData((prev) => ({ ...prev, workouts: updatedWorkouts }));
  };

  // 웨이트 운동의 '세트' 정보를 변경하는 함수
  const handleSetChange = (workoutIndex, setIndex, e) => {
    const { name, value } = e.target;
    const updatedWorkouts = [...postData.workouts];
    updatedWorkouts[workoutIndex].sets[setIndex][name] = value;
    setPostData((prev) => ({ ...prev, workouts: updatedWorkouts }));
  };

  // 유산소 운동의 정보를 변경하는 함수
  const handleCardioChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCardios = [...postData.cardios];
    const currentCardio = { ...updatedCardios[index] };

    currentCardio[name] = value;

    // 만약 드롭다운 메뉴를 '기타'가 아닌 다른 것으로 바꾸면,
    // 직접 입력했던 내용은 깨끗하게 지워줍니다. (사용자 경험 개선)
    if (name === "type" && value !== "기타") {
      currentCardio.customType = "";
    }

    updatedCardios[index] = currentCardio;
    setPostData((prev) => ({ ...prev, cardios: updatedCardios }));
  };

  // 웨이트 운동에 '세트 추가'
  const addSet = (workoutIndex) => {
    const updatedWorkouts = [...postData.workouts];
    updatedWorkouts[workoutIndex].sets.push({ weight: "", reps: "" });
    setPostData((prev) => ({ ...prev, workouts: updatedWorkouts }));
  };

  // 웨이트 운동에 '다른 운동 추가'
  const addWorkout = () => {
    setPostData((prev) => ({
      ...prev,
      workouts: [...prev.workouts, createNewWorkout()],
    }));
  };

  // 폼 전체 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 최종적으로 백엔드에 보낼 데이터를 조합합니다.
    const finalData = {
      ...postData,
      img: imageUrl, // 'img' 라는 키로 이미지 URL을 추가합니다.
    };

    // 불필요한 데이터는 정리해줍니다. (백엔드와 협의 필요)
    delete finalData.cardios; // 예시: 웨이트 기록 시 유산소 데이터는 비움

    try {
      console.log("백엔드로 전송될 데이터:", finalData);

      // 실제 백엔드 API로 데이터를 전송합니다.
      await api.post("/api/post/write", finalData);

      alert("운동 기록이 성공적으로 저장되었습니다.");
      navigate("/feed"); // 성공 후 피드 페이지로 이동
    } catch (error) {
      console.error("기록 저장 에러:", error);
      alert("기록 저장에 실패했습니다. 입력 내용을 확인해주세요.");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
        오늘의 운동 기록
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg bg-white p-8 shadow-lg"
      >
        {/* --- 1. 기본 정보 --- */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                운동 날짜
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  id="date"
                  value={postData.date}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                시작 시간
              </label>
              <div className="mt-1">
                <input
                  type="time"
                  name="startTime"
                  id="startTime"
                  value={postData.startTime}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="endTime"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                종료 시간
              </label>
              <div className="mt-1">
                <input
                  type="time"
                  name="endTime"
                  id="endTime"
                  value={postData.endTime}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="workoutType"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              운동 종류
            </label>
            <div className="mt-1">
              <select
                id="workoutType"
                name="workoutType"
                value={postData.workoutType}
                onChange={handleInputChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option>웨이트 트레이닝</option>
                <option>유산소</option>
                <option>요가/필라테스</option>
                <option>스포츠</option>
                <option>스트레칭</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- 2. 상세 기록 (조건부 렌더링) --- */}

        {/* 웨이트 트레이닝 폼 */}
        {postData.workoutType === "웨이트 트레이닝" && (
          <div className="space-y-4">
            {postData.workouts.map((workout, workoutIndex) => (
              <div
                key={workoutIndex}
                className="space-y-4 rounded-md border border-gray-200 p-4"
              >
                <input
                  type="text"
                  placeholder={`운동 ${workoutIndex + 1} (예: 벤치프레스)`}
                  value={workout.name}
                  onChange={(e) =>
                    handleWorkoutNameChange(workoutIndex, e.target.value)
                  }
                  className="block w-full rounded-md border-gray-300 font-semibold shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {workout.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center gap-2">
                    <span className="w-16 text-sm text-gray-500">
                      {setIndex + 1}세트
                    </span>
                    <input
                      type="number"
                      name="weight"
                      placeholder="무게(kg)"
                      value={set.weight}
                      onChange={(e) =>
                        handleSetChange(workoutIndex, setIndex, e)
                      }
                      className="block w-full rounded-md border-gray-300 text-sm shadow-sm"
                    />
                    <input
                      type="number"
                      name="reps"
                      placeholder="횟수"
                      value={set.reps}
                      onChange={(e) =>
                        handleSetChange(workoutIndex, setIndex, e)
                      }
                      className="block w-full rounded-md border-gray-300 text-sm shadow-sm"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSet(workoutIndex)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  + 세트 추가
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addWorkout}
              className="w-full rounded-md border-2 border-dashed border-gray-300 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              + 다른 운동 추가하기
            </button>
          </div>
        )}

        {/* 유산소 폼 */}
        {postData.workoutType === "유산소" && (
          // 지금은 유산소 항목 1개만 관리한다고 가정 (0번째 인덱스 사용)
          <div className="space-y-4 rounded-md border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800">유산소 운동 기록</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label
                  htmlFor="cardioType"
                  className="block text-sm font-medium text-gray-700"
                >
                  종류
                </label>
                <select
                  id="cardioType"
                  name="type"
                  value={postData.cardios[0].type}
                  onChange={(e) => handleCardioChange(0, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option>달리기</option>
                  <option>사이클</option>
                  <option>등산</option>
                  <option>걷기</option>
                  <option>숨쉬기</option>
                  <option>기타</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="distance"
                  className="block text-sm font-medium text-gray-700"
                >
                  거리 (km)
                </label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  placeholder="예: 5"
                  value={postData.cardios[0].distance}
                  onChange={(e) => handleCardioChange(0, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-sm font-medium text-gray-700"
                >
                  시간 (분)
                </label>
                <input
                  type="number"
                  id="time"
                  name="time"
                  placeholder="예: 30"
                  value={postData.cardios[0].time}
                  onChange={(e) => handleCardioChange(0, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            {postData.cardios[0].type === "기타" && (
              <div className="mt-4">
                <label
                  htmlFor="customCardioType"
                  className="block text-sm font-medium text-gray-700"
                >
                  운동 종류 직접 입력
                </label>
                <input
                  type="text"
                  id="customCardioType"
                  name="customType"
                  placeholder="예: 천국의 계단"
                  value={postData.cardios[0].customType}
                  onChange={(e) => handleCardioChange(0, e)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
        )}

        {/* --- 4. ImageUploader 컴포넌트를 폼의 적절한 위치에 추가합니다. --- */}
        <div>
          <label className="block text-sm font-medium leading-6 text-gray-900">
            인증샷
          </label>
          <div className="mt-1">
            <ImageUploader onUploadSuccess={setImageUrl} />
          </div>
        </div>

        {/* --- 3. 메모 및 저장 버튼 --- */}
        <div>
          <label
            htmlFor="memo"
            className="block text-sm font-medium text-gray-700"
          >
            메모
          </label>
          <textarea
            id="memo"
            name="memo"
            rows="4"
            value={postData.memo}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="오늘의 컨디션, 느낀 점 등을 자유롭게 기록하세요."
          ></textarea>
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="rounded-md border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            기록 저장
          </button>
        </div>
      </form>
    </div>
  );
}
