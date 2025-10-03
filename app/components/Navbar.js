import Link from "next/link";

export default function Navbar() {
  return (
    <div className="bg-[#1877f2] text-white shadow p-3 flex justify-between items-center">
      <div className="font-extrabold text-2xl">
        <Link href="/">MyBook</Link>
      </div>

      <input
        type="text"
        placeholder="Search MyBook"
        className="rounded-full px-3 py-1 w-1/3 text-black focus:outline-none hidden md:block"
      />

      <div className="flex space-x-6 text-xl">
        <Link href="/">🏠</Link>
        <span>👥</span>
        <span>💬</span>
        <span>🔔</span>
        <Link href="/user/You">👤</Link>
      </div>
    </div>
  );
}
