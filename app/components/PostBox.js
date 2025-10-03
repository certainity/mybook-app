// app/components/PostBox.js
"use client";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../utils/AuthProvider";

export default function PostBox() {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  async function handlePost() {
    if (!text.trim()) return;
    if (!user) {
      alert("Please login to post.");
      return;
    }

    const { error } = await supabase.from("posts").insert([
      {
        user_id: user.id,
        username: user.email, // later replace with display name
        text,
        image: image || null,
        likes: 0,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      setText("");
      setImage("");
      console.log("Post added!");
      // ✅ No manual state update needed — Feed.js + UserProfile.js
      // get it via realtime subscription
    }
  }

  return (
    <div className="bg-white p-4 rounded shadow-sm border border-gray-200 mb-4">
      <textarea
        className="w-full p-2 border rounded mb-2"
        placeholder={user ? "What's on your mind?" : "Login to post…"}
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!user}
      />

      <input
        className="w-full p-2 border rounded mb-2"
        placeholder="Optional image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        disabled={!user}
      />

      <button
        onClick={handlePost}
        disabled={!user}
        className={`px-4 py-2 rounded ${
          user
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-300 text-gray-600 cursor-not-allowed"
        }`}
      >
        Post
      </button>
    </div>
  );
}
