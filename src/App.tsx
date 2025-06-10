import { useState } from "react";
import UploadForm from "./components/UploadForm";
import SearchForm from "./components/SearchForm";
import SearchResultList from "./components/SearchResultList";

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

  const handleSearchResults = (data: any) => {
    setResults(Array.isArray(data) ? data : []);
  };

  const handleDelete = async (filename: string) => {
    const res = await fetch(`http://localhost:8000/delete_image/${filename}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setResults((prev) => prev.filter((r: any) => !r.image_path.includes(filename)));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-blue-50 to-white pb-12">
      {/* 헤더 + 네비 */}
      <header className="bg-white shadow-lg py-6 mb-8 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-4xl">📒</span>
            <span className="text-2xl font-bold text-yellow-600 drop-shadow">나의 공부 아카이브</span>
          </div>
          <nav className="space-x-6 hidden md:block">
            <a href="#" className="text-gray-700 hover:text-blue-500 font-medium">소개</a>
            <a href="#" className="text-gray-700 hover:text-blue-500 font-medium">문의</a>
            {/* 로그인/회원가입 메뉴 자리 */}
          </nav>
        </div>
      </header>
      {/* 소개 Hero Section */}
      <section className="max-w-4xl mx-auto text-center mb-8 px-4">
        <h2 className="text-3xl font-extrabold text-blue-800 mb-2">사진으로 남기는 나만의 공부노트 📸✍️</h2>
        <p className="text-lg text-gray-600 mb-4">
          <b className="text-blue-700">이미지로 기록</b>한 공부 내용을  
          <b className="text-yellow-600"> AI가 자동으로 텍스트로 추출</b>하고  
          <b className="text-blue-700"> 원하는 키워드나 문장</b>으로 바로바로 찾아볼 수 있어요!
        </p>
      </section>
      {/* 업로드/검색 영역 */}
      <main className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <section className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-yellow-100">
            <UploadForm />
          </section>
          <section className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-blue-100">
            <SearchForm onResults={handleSearchResults} />
          </section>
        </div>
        {/* 검색 결과 */}
        <SearchResultList results={results} onDelete={handleDelete} />
      </main>
      <footer className="text-center text-xs text-gray-400 mt-12">
        © 2025 내 공부 아카이브 | Made with <span className="text-red-400">♥</span>
      </footer>
    </div>
  );
}
export default App;
