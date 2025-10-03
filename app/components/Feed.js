"use client";

import { useState } from "react";
import { posts as initialPosts } from "../data/posts";
import PostBox from "./PostBox";

export default function Feed() {
  const [posts, setPosts] = useState(initialPosts);

  const addPost = (text, image) => {
    const newPost = {
      id: posts.length + 1,
      user: "You",
      text,
      image,
      likes: 0,
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <div className="space-y-4">
      <PostBox onPost={addPost} />
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
        >
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600">
              {post.user[0]}
            </div>
            <div className="ml-3">
              <div className="font-bold text-gray-900">{post.user}</div>
              <div className="text-xs text-gray-500">Just now</div>
            </div>
          </div>

          <p className="mb-3 text-gray-800">{post.text}</p>

          {post.image && (
            <div className="mb-3">
              <img src={post.image} alt="User post" className="rounded-lg max-h-96 object-cover" />
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-2">
            <span>👍 {post.likes} likes</span>
            <button
              onClick={() => handleLike(post.id)}
              className="text-[#1877f2] font-semibold hover:underline"
            >
              Like
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
