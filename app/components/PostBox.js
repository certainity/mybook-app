"use client";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../utils/AuthProvider";

export default function PostBox() {
  const { user } = useAuth(); // get logged-in user
  const [text, setText] = useState("");
  const [image, setImage] = useState("");

  async function createPost() {
    if (!user) {
      alert("You must be logged in to post.");
      return;
    }
    if (!text.trim() && !image.trim()) {
      alert("Post cannot be empty.");
      return;
    }

    const { error } = await supabase
      .from("posts")
      .insert([
        {
          text,
          image,
          user_id: user.id,   // ✅ link post to user
          username: user.email.split("@")[0], // optional username
          likes: 0,           // default likes
        },
      ]);

    if (error) {
      console.error("Error creating post:", error);
      alert("Error creating post: " + error.message);
    } else {
      setText("");
      setImage("");
    }
  }

  if (!user) {
    return (
      <div className="bg-white p-4 rounded shadow border text-center">
        <p className="text-gray-500">Login to create posts</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded shadow border">
      <textarea
        className="w-full border rounded p-2"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        className="w-full border rounded p-2 mt-2"
        placeholder="Optional image URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <button
        onClick={createPost}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Post
      </button>
    </div>
  );
}
