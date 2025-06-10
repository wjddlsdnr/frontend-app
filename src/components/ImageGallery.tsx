import React, { useEffect, useState } from "react";

interface ImageList {
  images: string[];
}

const API_BASE = import.meta.env.VITE_API_BASE;

const ImageGallery: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/images/`)
      .then((res) => res.json())
      .then((data: ImageList) => setImages(data.images));
  }, []);

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">내가 올린 사진들</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div key={i} className="border rounded-lg overflow-hidden shadow">
            <img src={`${API_BASE}/${img}`} alt={`업로드이미지${i}`} className="w-full h-40 object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
