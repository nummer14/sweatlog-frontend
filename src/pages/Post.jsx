import React, { useState } from 'react';
import axios from 'axios';

// 각 운동 항목의 초기 상태를 정의하는 함수
const createNewWorkout = () => ({
  name: '',
  sets: [{ weight: '', reps: '' }], // 각 운동은 최소 1개의 세트를 가집니다.
});

export default function Post() {
  // 1. 전체 폼의 데이터를 관리하는 상태
  const [postData, setPostData] = useState({
    date: new Date().toISOString().slice(0, 10), // 오늘 날짜를 기본값으로 설정
    workoutType: '웨이트 트레이닝',
    workouts: [createNewWorkout()], // 상세 운동 목록 (배열)
    memo: '',
  });

  // 2. 날짜, 운동 종류, 메모 등 간단한 입력 값을 처리하는 함수
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. '상세 운동'의 이름(예: 벤치프레스)을 변경하는 함수
  const handleWorkoutNameChange = (index, value) => {
    const updatedWorkouts = [...postData.workouts];
    updatedWorkouts[index].name = value;
    setPostData((prev) => ({ ...prev, workouts: updatedWorkouts }));
  };

  // 4. 특정 운동의 '세트' 정보(무게, 횟수)를 변경하는 함수
  const handleSetChange = (workoutIndex, setIndex, e) => {
    const { name, value } = e.target;
    const updatedWorkouts = [...postData.workouts];
    updatedWorkouts[workoutIndex].sets[setIndex][name] = value;
    setPostData((prev) => ({ ...prev, workouts: updatedWorkouts }));
  };

  // 5. 특정 운동에 '세트 추가' 버튼을 눌렀을 때
  const addSet = (workoutIndex) => {
    const updatedWorkouts = [...postData.workouts];
    updatedWorkouts[workoutIndex].sets.push({ weight: '', reps: '' });
    setPostData((prev) => ({ ...prev, workouts: updatedWorkouts }));
  };

  // 6. '운동 추가하기' 버튼을 눌렀을 때
  const addWorkout = () => {
    setPostData((prev) => ({
      ...prev,
      workouts: [...prev.workouts, createNewWorkout()],
    }));
  };
  
  // 7. 폼 전체를 제출할 때
  const handleSubmit = async (e) => { // async 추가
    e.preventDefault();

    try {
      // 백엔드의 운동 기록 생성 API 주소로 요청 (예시)
      const response = await axios.post('/api/posts', postData);
      console.log('기록 저장 성공:', response.data);
      alert('운동 기록이 성공적으로 저장되었습니다.');
      // TODO: 저장 성공 후 내 프로필 페이지나 소셜 피드로 이동

    } catch (error) {
      console.error('기록 저장 에러:', error);
      alert('기록 저장에 실패했습니다. 콘솔을 확인해주세요.');
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
        오늘의 운동 기록
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg bg-white p-8 shadow-lg">
        {/* --- 1. 기본 정보 --- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">운동 날짜</label>
            <input
              type="date" id="date" name="date" value={postData.date} onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="workoutType" className="block text-sm font-medium text-gray-700">운동 종류</label>
            <select
              id="workoutType" name="workoutType" value={postData.workoutType} onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option>웨이트 트레이닝</option> <option>유산소</option> <option>요가/필라테스</option> <option>스포츠</option>
            </select>
          </div>
        </div>

        {/* --- 2. 상세 기록 (동적으로 렌더링) --- */}
        {postData.workouts.map((workout, workoutIndex) => (
          <div key={workoutIndex} className="space-y-4 rounded-md border border-gray-200 p-4">
            <input
              type="text" placeholder={`운동 ${workoutIndex + 1} (예: 벤치프레스)`}
              value={workout.name} onChange={(e) => handleWorkoutNameChange(workoutIndex, e.target.value)}
              className="block w-full rounded-md border-gray-300 font-semibold shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {workout.sets.map((set, setIndex) => (
              <div key={setIndex} className="flex items-center gap-2">
                <span className="w-16 text-sm text-gray-500">{setIndex + 1}세트</span>
                <input
                  type="number" name="weight" placeholder="무게(kg)" value={set.weight} onChange={(e) => handleSetChange(workoutIndex, setIndex, e)}
                  className="block w-full rounded-md border-gray-300 text-sm shadow-sm"
                />
                <input
                  type="number" name="reps" placeholder="횟수" value={set.reps} onChange={(e) => handleSetChange(workoutIndex, setIndex, e)}
                  className="block w-full rounded-md border-gray-300 text-sm shadow-sm"
                />
              </div>
            ))}
            <button type="button" onClick={() => addSet(workoutIndex)} className="text-sm font-medium text-blue-600 hover:text-blue-500">
              + 세트 추가
            </button>
          </div>
        ))}
        
        <button type="button" onClick={addWorkout} className="w-full rounded-md border-2 border-dashed border-gray-300 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">
        
        
          + 다른 운동 추가하기
        </button>

        {/* --- 3. 메모 --- */}
        <div>
          <label htmlFor="memo" className="block text-sm font-medium text-gray-700">메모</label>
          <textarea
            id="memo" name="memo" rows="4" value={postData.memo} onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="오늘의 컨디션, 느낀 점 등을 자유롭게 기록하세요."
          ></textarea>
        </div>
        
        {/* --- 4. 저장 버튼 --- */}
        <div className="text-right">
          <button type="submit" className="rounded-md border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            기록 저장
          </button>
        </div>
      </form>
    </div>
  );
} 