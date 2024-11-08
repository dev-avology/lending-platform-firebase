export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 flex">
        {/* Main Content */}
        <main className="max-w-7xl mx-auto flex-1 overflow-y-auto bg-gray-100 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
