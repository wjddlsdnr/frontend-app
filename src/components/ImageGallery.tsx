import { useEffect, useState } from "react";
const API_BASE = import.meta.env.VITE_API_BASE;

const ImageGallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetch(`${API_BASE}/my_images/`, {
      headers: { token: token || "" }
    })
      .then(res => res.json())
      .then(data => setImages(data.images || []));
  }, []);

  const handleDelete = async (img: string) => {
    const filename = img.split("/").pop();
    if (!filename || !window.confirm("정말 삭제할까요?")) return;
    const res = await fetch(`${API_BASE}/delete_image/${filename}`, {
      method: "DELETE",
      headers: { token: token || "" }
    });
    if (res.ok) setImages(images.filter(i => i !== img));
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-white/70 rounded-2xl p-8 shadow-lg">
      {images.length === 0 && <div className="col-span-3 text-gray-400 py-8">아직 저장된 이미지가 없습니다.</div>}
      {images.map(img => (
        <div key={img} className="flex flex-col items-center p-2">
          <img src={API_BASE + "/" + img} className="rounded-xl border-2 border-orange-100 shadow mb-3 w-48 h-32 object-cover" />
          <button
            onClick={() => handleDelete(img)}
            className="mt-2 px-4 py-1 bg-red-400 hover:bg-red-500 text-white rounded-full shadow font-bold"
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
