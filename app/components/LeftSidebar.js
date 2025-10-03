export default function LeftSidebar() {
  const items = [
    { icon: "🏠", label: "Home" },
    { icon: "👥", label: "Friends" },
    { icon: "📄", label: "Pages" },
    { icon: "💾", label: "Saved" },
    { icon: "👨‍👩‍👧‍👦", label: "Groups" },
  ];

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow hover:bg-gray-100 cursor-pointer"
        >
          <span className="text-xl">{item.icon}</span>
          <span className="font-medium text-gray-800">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
