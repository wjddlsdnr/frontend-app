// src/api.ts
const API_BASE = import.meta.env.VITE_API_BASE;

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return fetch(`${API_BASE}/upload/`, {
    method: "POST",
    body: formData,
  });
};

export const searchSentences = async (query: string) => {
  const res = await fetch(`${API_BASE}/semantic_search/?query=` + encodeURIComponent(query));
  return res.json();
};

export const deleteImage = async (filename: string) => {
  return fetch(`${API_BASE}/delete_image/${filename}`, { method: "DELETE" });
};

export const fetchHighlightedImage = async (image_path: string, query: string) => {
  const res = await fetch(`${API_BASE}/highlighted_image/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ image_path, query }),
  });
  return res.blob();
};
