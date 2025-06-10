import React, { useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

type Mode = "login" | "signup";

const AuthForm: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    const url = mode === "login" ? "/login/" : "/signup/";
    try {
      const res = await fetch(API_BASE + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (mode === "login") {
        if (res.ok && data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          setMsg("로그인 성공!");
          onLogin();
        } else {
          setMsg(data.detail || "로그인 실패");
        }
      } else {
        if (res.ok) {
          setMsg("회원가입 성공! 로그인 해주세요.");
          setMode("login");
        } else {
          setMsg(data.detail || "회원가입 실패");
        }
      }
    } catch {
      setMsg("네트워크 오류");
    }
  };

  return (
    <div className="max-w-xs mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">{mode === "login" ? "로그인" : "회원가입"}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="아이디"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="비밀번호"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 font-semibold" type="submit">
          {mode === "login" ? "로그인" : "회원가입"}
        </button>
      </form>
      <div className="text-center mt-3">
        <button
          className="text-sm text-gray-500 hover:underline"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "회원가입 하기" : "로그인 하기"}
        </button>
      </div>
      {msg && <div className="text-center text-red-500 mt-2">{msg}</div>}
    </div>
  );
};

export default AuthForm;
