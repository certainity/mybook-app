"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Image from "next/image";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      let { data, error } = await supabase
        .from("posts")
        .select("id, text, image, likes, username, user_id, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();

    // ✅ Realtime subscription for new + updated posts
    const channel = supabase
      .channel("posts-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          console.log("New post:", payload.new);
          setPosts((prev) => [payload.new, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        (payload) => {
          console.log("Post updated:", payload.new);
          setPosts((prev) =>
            prev.map((p) => (p.id === payload.new.id ? payload.new : p))
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Like handler
  const handleLike = async (id, currentLikes) => {
    const { error } = await supabase
      .from("posts")
      .update({ likes: currentLikes + 1 })
      .eq("id", id);

    if (error) console.error("Error liking post:", error);
  };

  if (loading) return <p className="text-center mt-4">Loading posts…</p>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white p-4 rounded shadow-sm border border-gray-200"
        >
          {/* ✅ User Info */}
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold mr-3">
              {post.username ? post.username[0].toUpperCase() : "?"}
            </div>
            <div>
              <div className="font-semibold text-gray-900">
                {post.username || "Anonymous"}
              </div>
              <div className="text-xs text-gray-500">
                {new Date(post.created_at).toLocaleString()}
              </div>
            </div>
          </div>

          {/* ✅ Post Content */}
          <div className="text-gray-800 mb-2">{post.text}</div>

          {post.image && (
            <div className="rounded-md overflow-hidden mb-2">
              <Image
                src={post.image}
                alt="User post"
                width={600}
                height={400}
                className="rounded-md object-cover max-h-96"
              />
            </div>
          )}

          {/* ✅ Actions */}
          <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
            <span>👍 {post.likes} likes</span>
            <button
              onClick={() => handleLike(post.id, post.likes)}
              className="text-blue-600 font-semibold hover:underline"
            >
              Like
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
