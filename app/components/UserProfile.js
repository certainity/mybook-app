"use client"; // ✅ Needed for hooks, Supabase, realtime updates
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import Image from "next/image"; // ✅ Use optimized Image component

export default function UserProfile({ params }) {
  const { username } = params;
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      let { data, error } = await supabase
        .from("posts")
        .select("*")
        .ilike("username", username); // case-insensitive

      if (error) {
        console.error("Error fetching user posts:", error);
      } else {
        setUserPosts(data);
      }
      setLoading(false);
    };

    fetchPosts();

    // ✅ Realtime updates for user's posts
    const channel = supabase
      .channel("user-profile-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        (payload) => {
          if (
            payload.new.username.toLowerCase() === username.toLowerCase()
          ) {
            setUserPosts((prev) => [payload.new, ...prev]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        (payload) => {
          if (
            payload.new.username.toLowerCase() === username.toLowerCase()
          ) {
            setUserPosts((prev) =>
              prev.map((p) => (p.id === payload.new.id ? payload.new : p))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [username]);

  if (loading) return <p className="text-center mt-4">Loading profile…</p>;

  return (
    <div className="max-w-2xl mx-auto mt-6 space-y-4">
      {/* Profile Header */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center font-bold text-gray-600 text-2xl">
            {username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{username}</h1>
            {/* ✅ Fix apostrophe */}
            <p className="text-gray-600">This is {username}&apos;s profile bio.</p>
          </div>
        </div>
      </div>

      {/* User's Posts */}
      {userPosts.length > 0 ? (
        userPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
          >
            <p className="mb-3 text-gray-800">{post.text}</p>
            {post.image && (
              <div className="rounded-lg max-h-96 object-cover mb-3 overflow-hidden">
                <Image
                  src={post.image}
                  alt="Post"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover"
                />
              </div>
            )}
            <div className="text-sm text-gray-600">👍 {post.likes} likes</div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No posts yet from {username}.</p>
      )}
    </div>
  );
}
