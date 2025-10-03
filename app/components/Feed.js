// app/components/Feed.js
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Image from "next/image"; // ✅ Import Next.js Image

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load posts initially
  useEffect(() => {
    const fetchPosts = async () => {
      let { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();

    // ✅ Realtime listener for posts
    const channel = supabase
      .channel("posts-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          console.log("New post received:", payload.new);
          setPosts((prev) => [payload.new, ...prev]); // add new post on top
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

    // cleanup when component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Like button handler
  const handleLike = async (id, currentLikes) => {
    const { error } = await supabase
      .from("posts")
      .update({ likes: currentLikes + 1 })
      .eq("id", id);

    if (error) {
      console.error("Error liking post:", error);
    }
  };

  if (loading) return <p className="text-center mt-4">Loading posts...</p>;

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white p-4 rounded shadow-sm border border-gray-200"
        >
          <div className="font-semibold">{post.username}</div>
          <div className="text-gray-700">{post.text}</div>

          {post.image && (
            <div className="mt-2 rounded-md overflow-hidden max-h-60">
              <Image
                src={post.image}
                alt="User post"
                width={600}
                height={400}
                className="object-cover rounded-md"
              />
            </div>
          )}

          <div className="flex items-center justify-between mt-2">
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
