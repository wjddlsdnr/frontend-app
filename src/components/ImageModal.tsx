import React from "react";

interface Props {
  imageUrl: string;
  onClose: () => void;
}
const ImageModal: React.FC<Props> = ({ imageUrl, onClose }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
    <div className="relative">
      <img
        src={imageUrl}
        alt="확대 이미지"
        className="rounded-2xl shadow-2xl max-w-[90vw] max-h-[90vh] object-contain border-4 border-yellow-300"
      />
      <button
        className="absolute top-3 right-3 bg-white bg-opacity-80 rounded-full px-5 py-2 text-gray-800 font-bold text-lg shadow-lg hover:bg-yellow-400 hover:text-white"
        onClick={onClose}
      >
        닫기
      </button>
    </div>
  </div>
);
export default ImageModal;
