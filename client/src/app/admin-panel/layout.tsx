import Slidebar from "@/components/menu/slidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Slidebar />
      
      {/* Main content */}
      <main className="lg:ml-64 transition-all duration-300">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Ласкаво просимо!
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
