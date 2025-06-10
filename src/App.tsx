import { useState } from "react";
import UploadForm from "./components/UploadForm";
import SearchForm from "./components/SearchForm";
import SearchResultList from "./components/SearchResultList";
import ImageGallery from "./components/ImageGallery"; // 추가!

interface Match {
  highlighted: string;
  original: string;
  similarity: number;
}
interface SearchResultGrouped {
  image_path: string;
  matches: Match[];
}

function App() {
  const [results, setResults] = useState<SearchResultGrouped[]>([]);
  const [showGallery, setShowGallery] = useState(false); // 갤러리 보기 상태 추가

  const handleSearchResults = (data: any) => {
    setResults(Array.isArray(data) ? data : []);
  };

  const handleDelete = async (filename: string) => {
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/delete_image/${filename}`, // 배포 주소 반영
      {
        method: "DELETE",
      }
    );
    if (res.ok) {
      setResults((prev) =>
        prev.filter((r: any) => !r.image_path.includes(filename))
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-blue-50 to-white pb-12">
      {/* 헤더 + 네비 */}
      <header className="bg-white shadow-lg py-6 mb-8 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-4xl">📒</span>
            <span className="text-2xl font-bold text-yellow-600 drop-shadow">
              나의 공부 아카이브
            </span>
          </div>
          <nav className="space-x-6 flex items-center">
            <a href="#" className="text-gray-700 hover:text-blue-500 font-medium hidden md:inline">
              소개
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-500 font-medium hidden md:inline">
              문의
            </a>
            <button
              onClick={() => setShowGallery((prev) => !prev)}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-1 font-medium shadow transition"
            >
              {showGallery ? "홈으로" : "내 사진 보기"}
            </button>
          </nav>
        </div>
      </header>
      {/* 소개 Hero Section */}
      {!showGallery && (
        <section className="max-w-4xl mx-auto text-center mb-8 px-4">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-2">
            사진으로 남기는 나만의 공부노트 📸✍️
          </h2>
          <p className="text-lg text-gray-600 mb-4">
            <b className="text-blue-700">이미지로 기록</b>한 공부 내용을
            <b className="text-yellow-600"> AI가 자동으로 텍스트로 추출</b>하고
            <b className="text-blue-700"> 원하는 키워드나 문장</b>으로 바로바로 찾아볼 수 있어요!
          </p>
        </section>
      )}
      {/* 메인 영역 */}
      <main className="max-w-4xl mx-auto px-4">
        {showGallery ? (
          <ImageGallery />
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <section className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-yellow-100">
                <UploadForm />
              </section>
              <section className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
                <SearchForm onResults={handleSearchResults} />
              </section>
            </div>
            <SearchResultList results={results} onDelete={handleDelete} />
          </>
        )}
      </main>
      <footer className="text-center text-xs text-gray-400 mt-12">
        © 2025 내 공부 아카이브 | Made with <span className="text-red-400">♥</span>
      </footer>
    </div>
  );
}

export default App;
