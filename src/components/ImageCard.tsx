
import { deleteImage } from "../api";

interface ImageCardProps {
  filename: string;
  imageUrl: string;
  onDelete: (filename: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ filename, imageUrl, onDelete }) => {
  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteImage(filename); 
      alert("삭제 성공");
      onDelete(filename);
    } catch (error) {
      console.error("삭제 실패", error);
      alert("삭제 실패");
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <img src={imageUrl} alt={filename} className="w-full" />
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm break-all">{filename}</span>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
        >
          삭제
        </button>
      </div>
    </div>
  );
};

export default ImageCard;
