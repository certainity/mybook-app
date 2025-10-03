"use client";
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { useAuth } from "../utils/AuthProvider";

export default function AuthBox() {
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  async function login() {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  }

  async function signup() {
    // Step 1: Signup with Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      alert("Signup failed: " + error.message);
      return;
    }

    // Step 2: Insert into users table
    const { error: insertError } = await supabase.from("users").insert([
      {
        id: data.user?.id,   // use Supabase auth user ID
        email,
        username: username || email.split("@")[0], // fallback if username is empty
      },
    ]);

    if (insertError) {
      console.error("Insert error:", insertError);
      alert("Database error saving new user: " + insertError.message);
      return;
    }

    alert("Signup successful! Please check your email.");
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  if (user) {
    return (
      <div className="bg-green-50 border p-3 rounded mb-4">
        Logged in as <b>{user.email}</b>
        <button
          onClick={logout}
          className="ml-3 text-red-600 font-semibold"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded border shadow mb-4">
      <div className="grid gap-2">
        <input
          className="border rounded p-2"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border rounded p-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="border rounded p-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={login}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login
        </button>
        <button
          onClick={signup}
          className="bg-gray-700 text-white px-4 py-2 rounded"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}
