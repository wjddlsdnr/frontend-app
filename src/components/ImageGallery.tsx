import { useEffect, useState } from "react";
import { deleteImage, fetchMyImages } from "../api"; // api 함수 참고

const ImageGallery = () => {
  const [images, setImages] = useState<string[]>([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchMyImages(token ?? undefined).then((res) => setImages(res.images || []));
  }, []);

  const handleDelete = async (imagePath: string) => {
    if (!window.confirm("정말 삭제할까요?")) return;
    const filename = imagePath.split("/").pop()!;
    const res = await deleteImage(filename, token ?? undefined);
    if (res.ok) setImages((prev) => prev.filter((i) => i !== imagePath));
    else alert("삭제 실패");
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {images.map((img) => (
        <div key={img} className="relative group">
          <img src={import.meta.env.VITE_API_BASE + "/" + img} alt="" className="rounded-xl shadow" />
          <button
            onClick={() => handleDelete(img)}
            className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded hidden group-hover:block"
          >
            삭제
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
