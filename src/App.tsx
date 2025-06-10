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

  const handleSearchResults = (data: any) => {
    setResults(Array.isArray(data) ? data : []);
  };

  // 로그아웃 함수
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setLoggedIn(false);
    setShowGallery(false);
  };

  // 이미지 삭제 시 토큰 포함
  const handleDelete = async (filename: string) => {
    const token = localStorage.getItem("access_token") || "";
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/delete_image/${filename}`,
      {
        method: "DELETE",
        headers: { "token": token },
      }
    );
    if (res.ok) {
      setResults((prev) =>
        prev.filter((r: any) => !r.image_path.includes(filename))
      );
    }
  };

  // 로그인 안 했으면 AuthForm만 노출
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-blue-50 to-white">
        <AuthForm onLogin={() => setLoggedIn(true)} />
      </div>
    );
  }

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
            <button
              className="ml-4 text-xs px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </nav>
        </div>
      </header>
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
