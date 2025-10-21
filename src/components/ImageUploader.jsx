import React, { useState, useRef } from 'react';
import api from '../api/axios'; // 이전에 설정한 axios 인스턴스를 가져옵니다.

export default function ImageUploader({ onUploadSuccess }) {
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. 화면에 미리보기 보여주기
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // 2. 실제 서버로 파일 업로드 (S3 업로드 API)
    const formData = new FormData();
    formData.append('file', file); // 백엔드에서 'file'이라는 키로 받도록 약속

    setIsUploading(true);
    try {
      // 백엔드 GitHub에서 확인한 이미지 업로드 주소는 '/api/s3/upload' 입니다.
      const { data } = await api.post('/api/s3/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // 업로드 성공 시, 부모 컴포넌트로 이미지 URL을 전달합니다.
      onUploadSuccess(data.url); // 백엔드가 { url: '...' } 형태로 응답한다고 가정
      
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };
  
  // 이미지 삭제 핸들러
  const handleRemoveImage = () => {
    setImagePreview(null);
    onUploadSuccess(''); // 부모 컴포넌트의 URL 상태를 비웁니다.
    if(fileInputRef.current) {
        fileInputRef.current.value = ''; // input에 남아있는 파일 선택을 초기화합니다.
    }
  }

  return (
    <div className="w-full p-4 border-2 border-dashed rounded-lg text-center bg-gray-50">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden" // input 태그는 숨기고 커스텀 버튼을 사용합니다.
      />
      
      {imagePreview ? (
        // 이미지가 선택된 경우 미리보기와 삭제 버튼을 보여줍니다.
        <div className="relative group">
          <img src={imagePreview} alt="인증샷 미리보기" className="w-full rounded-lg" />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
            <button 
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              X
            </button>
          </div>
        </div>
      ) : (
        // 이미지가 없는 경우 업로드 버튼을 보여줍니다.
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full h-32 flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isUploading ? (
            <span>업로드 중...</span>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="mt-2 font-semibold">인증샷 추가하기</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}