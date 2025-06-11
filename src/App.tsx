import { useState } from "react";
import UploadForm from "./components/UploadForm";
import SearchForm from "./components/SearchForm";
import SearchResultList from "./components/SearchResultList";
import ImageGallery from "./components/ImageGallery";

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
  const [showGallery, setShowGallery] = useState(false);

  const handleSearchResults = (data: any) => {
    setResults(Array.isArray(data) ? data : []);
  };

  const handleDelete = async (filename: string) => {
    // 토큰 등 인증 헤더 필요시 수정!
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/delete_image/${filename}`,
      { method: "DELETE" }
    );
    if (res.ok) {
      setResults((prev) => prev.filter((r: any) => !r.image_path.includes(filename)));
    }
  };

  return (
    <div className="min-h-screen pb-12" style={{background: "none"}}>
      {/* 헤더 + 네비 */}
      <header className="bg-white/90 shadow-xl px-6 py-8 flex justify-between items-center border-b border-orange-100">
        <span className="font-extrabold text-3xl text-orange-400 tracking-widest drop-shadow-sm font-serif">
          ✍️ Study Journal
        </span>
        <nav className="space-x-6 flex items-center">
          <a href="#" className="text-gray-500 hover:text-orange-400 font-semibold transition">소개</a>
          <a href="#" className="text-gray-500 hover:text-orange-400 font-semibold transition">문의</a>
          <button
            className="bg-orange-400 hover:bg-orange-500 text-white rounded-full px-6 py-2 font-bold shadow transition"
            onClick={() => setShowGallery((prev) => !prev)}
          >
            {showGallery ? "홈으로" : "내 사진 보기"}
          </button>
        </nav>
      </header>

      {!showGallery && (
        <section className="max-w-4xl mx-auto text-center mb-8 px-4">
          <h2 className="text-3xl font-extrabold text-orange-500 mb-2 font-serif">사진으로 남기는 나만의 공부노트 📸</h2>
          <p className="text-lg text-gray-600 mb-4">
            <b className="text-orange-600">이미지로 기록</b>한 공부 내용을  
            <b className="text-orange-500"> AI가 자동으로 텍스트로 추출</b>하고  
            <b className="text-orange-600"> 원하는 키워드나 문장</b>으로 바로 찾아볼 수 있어요!
          </p>
        </section>
      )}

      <main className="max-w-4xl mx-auto px-4">
        {showGallery ? (
          <ImageGallery />
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <section className="flex-1 bg-white/80 rounded-2xl shadow-xl p-6 border border-orange-100">
                <UploadForm />
              </section>
              <section className="flex-1 bg-white/80 rounded-2xl shadow-xl p-6 border border-orange-100">
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
