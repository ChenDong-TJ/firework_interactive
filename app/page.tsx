import { Dashboard } from "../components/Dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">BITs of Firework</h1>
        <Dashboard />
      </div>
    </main>
  )
}

