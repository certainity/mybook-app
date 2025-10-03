// app/page.js
import Navbar from "./components/Navbar";
import Feed from "./components/Feed";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import AuthBox from "./components/AuthBox";
import PostBox from "./components/PostBox";
import { useAuth } from "./utils/AuthProvider";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="flex justify-center mt-4 px-4">
        {/* Left Sidebar */}
        <div className="hidden lg:block w-1/5 pr-4">
          <LeftSidebar />
        </div>

        {/* Middle Feed */}
        <div className="w-full max-w-xl">
          <AuthBox />
          {user && <PostBox />}
          <Feed />
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block w-1/5 pl-4">
          <RightSidebar />
        </div>
      </main>
    </div>
  );
}
