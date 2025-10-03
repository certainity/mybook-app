export default function RightSidebar() {
  const friends = ["Ahmed", "Sara", "Ali", "Nadia", "Omar", "Fatima"];

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">
      <h2 className="font-bold text-lg mb-2">Contacts</h2>
      {friends.map((friend, idx) => (
        <div
          key={idx}
          className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded cursor-pointer"
        >
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>{friend}</span>
        </div>
      ))}
    </div>
  );
}
