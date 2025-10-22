import React, { useState, useRef } from "react";
import api from "../api/axios"; // 이전에 설정한 axios 인스턴스를 가져옵니다.

export default function ImageUploader({
  onUploadSuccess,
  uploadContext = "post",
}) {
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. 화면에 미리보기 보여주기 (기존 코드와 동일)
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    // 2. 실제 서버로 파일 업로드
    const formData = new FormData();
    formData.append("file", file);

    // 👇 2. 부모에게서 받은 uploadContext 정보를 FormData에 함께 담아 보냅니다.
    //    백엔드는 이 'context' 값을 보고 분기 처리를 할 수 있습니다.
    formData.append("context", uploadContext);

    setIsUploading(true);
    try {
      const { data } = await api.post("/api/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUploadSuccess(data);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  // 이미지 삭제 핸들러
  const handleRemoveImage = () => {
    setImagePreview(null);
    onUploadSuccess(""); // 부모 컴포넌트의 URL 상태를 비웁니다.
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // input에 남아있는 파일 선택을 초기화합니다.
    }
  };

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
          <img
            src={imagePreview}
            alt="인증샷 미리보기"
            className="w-full rounded-lg"
          />
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="mt-2 font-semibold">인증샷 추가하기</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
