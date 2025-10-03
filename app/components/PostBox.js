"use client";

import { useState } from "react";

export default function PostBox({ onPost }) {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = () => {
    if (!text.trim() && !image) return;
    onPost(text, image);
    setText("");
    setImage(null);
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
          U
        </div>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="ml-3 flex-1 border rounded-full px-4 py-2 bg-gray-100 text-gray-700 placeholder-gray-500 focus:outline-none"
        />
      </div>

      {image && (
        <div className="mb-2">
          <img src={image} alt="Preview" className="rounded-lg max-h-64 object-cover" />
        </div>
      )}

      <div className="flex items-center justify-between mt-2">
        <label className="cursor-pointer text-[#1877f2] font-semibold">
          📷 Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="hidden"
          />
        </label>
        <button
          onClick={handleSubmit}
          className="bg-[#1877f2] text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition"
        >
          Post
        </button>
      </div>
    </div>
  );
}
