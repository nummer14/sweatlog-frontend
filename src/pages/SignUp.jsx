import React, { useState } from 'react';
import axios from 'axios';

export default function SignUp() {
  // 2. 폼 데이터를 '기억'할 상태 변수를 만듭니다.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: '',
    birthdate: '',
  });

  // 3. input 값이 바뀔 때마다 실행될 함수입니다.
  const handleChange = (event) => {
    const { name, value } = event.target; // 변경된 input의 name과 value를 가져옵니다.
    setFormData((prevData) => ({
      ...prevData, // 이전 데이터는 그대로 두고,
      [name]: value, // 변경된 부분만 새로 덮어씁니다.
    }));
  };

  const handleSubmit = async (event) => { // async 추가
    event.preventDefault();

    try {
      // 3. 백엔드 서버의 회원가입 API 엔드포인트로 POST 요청을 보냅니다.
      // 지금은 백엔드가 없으니 주소는 예시입니다.
      const response = await axios.post('/api/users/signup', formData);

      console.log('서버 응답:', response.data);
      alert('회원가입 성공!');
      // TODO: 회원가입 성공 후 로그인 페이지로 이동시키기

    } catch (error) {
      // 4. 요청이 실패했을 때 에러를 처리합니다.
      console.error('회원가입 에러:', error);
      alert('회원가입에 실패했습니다. 콘솔을 확인해주세요.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-10 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Sweatlog 회원가입
          </h2>
        </div>

        {/* 5. handleSubmit 함수를 form에 연결합니다. */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            {/* 이메일 입력 */}
            <div>
              <input
                name="email" // 6. 각 input에 name 속성을 부여합니다.
                type="email"
                required
                className="..." // className은 이전과 동일하므로 생략합니다.
                placeholder="이메일 주소"
                value={formData.email} // 7. 화면에 보여줄 값을 상태와 연결합니다.
                onChange={handleChange} // 8. 값이 바뀔 때마다 handleChange 함수를 실행합니다.
              />
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <input
                name="password"
                type="password"
                required
                className="..."
                placeholder="비밀번호"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            {/* 닉네임 입력 */}
            <div>
              <input
                name="nickname"
                type="text"
                required
                className="..."
                placeholder="닉네임"
                value={formData.nickname}
                onChange={handleChange}
              />
            </div>

            {/* 생년월일 입력 */}
            <div>
              <input
                name="birthdate"
                type="date"
                required
                className="..."
                placeholder="생년월일"
                value={formData.birthdate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}