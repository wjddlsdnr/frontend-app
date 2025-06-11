import { useState } from "react";
import UploadForm from "./components/UploadForm";
import SearchForm from "./components/SearchForm";
import SearchResultList from "./components/SearchResultList";
import ImageGallery from "./components/ImageGallery";
import AuthForm from "./components/AuthForm";

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
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("access_token"));
  const [showGallery, setShowGallery] = useState(false);

  // handleDelete 예시
  const handleDelete = (filename: string) => {
    setResults((prev) => prev.filter(r => !r.image_path.includes(filename)));
  };

  if (!loggedIn) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-100">
        <div className="bg-white rounded-2xl shadow-2xl p-8 min-w-[320px]">
          <AuthForm onLogin={() => setLoggedIn(true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-100 bg-[url('/notebook-paper.svg')] bg-cover">
      <header className="bg-white/90 shadow-lg py-6 mb-8 sticky top-0 z-20 border-b">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-4xl">📔</span>
            <span className="text-2xl font-bold text-yellow-600 drop-shadow">Study Journal</span>
          </div>
          <nav className="space-x-6 flex items-center">
            <a href="#" className="text-blue-500 hover:underline font-medium">소개/문의</a>
            <button
              onClick={() => setShowGallery((prev) => !prev)}
              className="ml-2 bg-orange-400 hover:bg-orange-500 text-white rounded-full px-4 py-1 font-medium shadow transition"
            >
              {showGallery ? "홈으로" : "내 사진 보기"}
            </button>
            {/* 👇 여기 추가 */}
            <button
              onClick={() => {
                localStorage.removeItem("access_token");
                setLoggedIn(false);
              }}
              className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full px-4 py-1 font-medium shadow transition"
            >
              로그아웃
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4">
        <section className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-yellow-700 mb-2">
            사진으로 남기는 나만의 공부노트 <span>📷</span>
          </h2>
          <p className="text-lg text-gray-700 mb-4">
            <b className="text-blue-700">이미지로 기록</b>한 공부 내용을
            <b className="text-orange-600"> AI가 자동으로 텍스트로 추출</b>하고
            <b className="text-blue-700"> 원하는 키워드나 문장</b>으로 바로 찾아볼 수 있어요!
          </p>
        </section>
        {showGallery ? (
          <ImageGallery />
        ) : (
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <section className="flex-1 bg-white/90 rounded-2xl shadow-xl p-6 border border-yellow-100">
              <UploadForm />
            </section>
            <section className="flex-1 bg-white/90 rounded-2xl shadow-xl p-6 border border-orange-100">
              <SearchForm onResults={setResults} />
            </section>
          </div>
        )}
        {/* 여기가 반드시 있어야 함 */}
        {!showGallery && <SearchResultList results={results} onDelete={handleDelete} />}
      </main>
      <footer className="text-center text-xs text-gray-400 mt-12">
        © 2025 내 공부 아카이브 | Made with <span className="text-red-400">♥</span>
      </footer>
    </div>
  );
}

export default App;
