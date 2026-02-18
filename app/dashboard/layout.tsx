export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          SaaS Panel
        </h2>

        <nav className="mt-10 space-y-4 text-gray-400">
          <div className="hover:text-white cursor-pointer transition">
            Dashboard
          </div>
          <div className="hover:text-white cursor-pointer transition">
            Tasks
          </div>
          <div className="hover:text-white cursor-pointer transition">
            Settings
          </div>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
