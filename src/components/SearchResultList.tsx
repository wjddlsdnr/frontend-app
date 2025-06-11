import { useState } from "react";
import ImageModal from "./ImageModal";
import { fetchHighlightedImage } from "../api";  // 여기서 deleteImage 제거


interface Match {
  highlighted: string;
  original: string;
  similarity: number;
}
interface SearchResultGrouped {
  image_path: string;
  matches: Match[];
}
interface Props {
  results: SearchResultGrouped[];
  onDelete: (filename: string) => void;
}

const SearchResultList: React.FC<Props> = ({ results, onDelete }) => {
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {results.length === 0 && (
        <div className="col-span-2 text-center text-gray-500 py-16 text-lg font-semibold">
          🔍 아직 검색 결과가 없습니다.<br />
          <span className="text-sm text-gray-400">사진을 업로드하고 키워드로 검색해보세요!</span>
        </div>
      )}
      {results.map((result, idx) => {
        const filename = result.image_path.split("/").pop() || "";
        return (
          <div
            key={idx}
            className="flex flex-row-reverse items-center bg-white/80 border rounded-3xl shadow-lg p-6 mb-8 gap-8 max-w-3xl mx-auto hover:shadow-2xl transition"
          >
            {/* 이미지 (오른쪽) */}
            <img
              src={import.meta.env.VITE_API_BASE + "/" + result.image_path}
              alt="검색 결과"
              className="w-72 h-44 object-contain rounded-2xl border-2 border-orange-200 shadow-md cursor-pointer"
              onClick={async () => {
                const keyword = result.matches[0]?.original || "";
                try {
                  const res = await fetchHighlightedImage(result.image_path, keyword);
                  setModalImageSrc(URL.createObjectURL(res));
                } catch {
                  setModalImageSrc(import.meta.env.VITE_API_BASE + "/" + result.image_path);
                }
              }}
            />
            {/* 텍스트 (왼쪽) */}
            <div className="flex-1">
              <button
                onClick={() => onDelete(filename)}
                className="mb-3 bg-red-400 text-white px-4 py-1 text-xs rounded-full hover:bg-red-600 shadow"
                title="삭제"
              >
                🗑 삭제
              </button>
              {result.matches.length === 0 ? (
                <div className="text-gray-400 text-sm">❗ 관련 문장이 없습니다.</div>
              ) : (
                result.matches.map((match, i) => (
                  <div
                    key={i}
                    className="bg-orange-50 text-orange-900 rounded-xl px-4 py-2 my-2 shadow-sm"
                    dangerouslySetInnerHTML={{ __html: "📝 " + match.highlighted }}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
      {modalImageSrc && (
        <ImageModal
          imageUrl={modalImageSrc}
          onClose={() => setModalImageSrc(null)}
        />
      )}
    </div>
  );
};

export default SearchResultList;
