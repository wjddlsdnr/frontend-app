import { useState } from "react";
import ImageModal from "./ImageModal";


export interface SearchResultType {
  image_path: string;
  text: string;
  similarity?: number;
}

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

// 환경변수에서 API BASE URL 불러오기 (Vite 기준)
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

const SearchResultList: React.FC<Props> = ({ results, onDelete }) => {
  const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
            className="bg-white rounded-2xl shadow-lg p-4 border border-yellow-200 hover:shadow-2xl transition relative flex flex-col"
          >
            <button
              onClick={() => onDelete(filename)}
              className="absolute top-2 right-2 bg-red-400 text-white px-3 py-1 text-xs rounded-full hover:bg-red-600 z-10 shadow"
              title="삭제"
            >
              🗑
            </button>
            <img
              src={`${API_BASE}/${result.image_path}`}
              alt="검색 결과"
              className="cursor-pointer mx-auto rounded-lg mb-2 max-w-[500px] max-h-[260px] object-contain border border-gray-200 shadow-sm"
              onClick={async () => {
                const keyword = result.matches[0]?.original || "";
                try {
                  // api.ts를 쓸 경우
                  // const blob = await fetchHighlightedImage(result.image_path, keyword);
                  // setModalImageSrc(URL.createObjectURL(blob));
                  
                  // 직접 fetch 사용 시
                  const res = await fetch(`${API_BASE}/highlighted_image/`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      image_path: result.image_path,
                      query: keyword,
                    }),
                  });
                  const blob = await res.blob();
                  setModalImageSrc(URL.createObjectURL(blob));
                } catch {
                  setModalImageSrc(`${API_BASE}/${result.image_path}`);
                }
              }}
            />
            <div className="mt-2 space-y-1">
              {result.matches.length === 0 ? (
                <div className="text-gray-400 text-sm">❗ 관련 문장이 없습니다.</div>
              ) : (
                result.matches.map((match, i) => (
                  <div
                    key={i}
                    className="bg-yellow-100 text-yellow-900 rounded p-2 text-sm font-medium my-1 shadow-sm"
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
