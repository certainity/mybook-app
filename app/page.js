import Navbar from "./components/Navbar";
import Feed from "./components/Feed";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <main className="flex justify-center mt-4 px-4">
        {/* Left Sidebar (hidden on small screens) */}
        <div className="hidden lg:block w-1/5 pr-4">
          <LeftSidebar />
        </div>

        {/* Center Feed */}
        <div className="w-full max-w-xl">
          <Feed />
        </div>

        {/* Right Sidebar (hidden on small screens) */}
        <div className="hidden lg:block w-1/5 pl-4">
          <RightSidebar />
        </div>
      </main>
    </div>
  );
}
