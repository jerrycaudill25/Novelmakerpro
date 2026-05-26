import { Link } from 'react-router-dom'
import { BookOpen, Sparkles, PenTool } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Unlock Your Creative Potential
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            AI-enhanced writing platform that helps you craft compelling stories with intelligent suggestions and real-time collaboration
          </p>
          <div className="flex justify-center gap-4 pt-8">
            <Link
              to="/register"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 border-2 border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 rounded-lg font-semibold transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl font-bold text-center text-white mb-16">Powerful Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: BookOpen,
              title: 'Organized Writing',
              description: 'Structure your novels with chapters, organize your thoughts, and maintain narrative flow'
            },
            {
              icon: Sparkles,
              title: 'AI Assistance',
              description: 'Get intelligent suggestions for plot development, character names, and dialogue enhancement'
            },
            {
              icon: PenTool,
              title: 'Collaborative Editing',
              description: 'Work with editors and co-authors in real-time with version history and change tracking'
            }
          ].map((feature, i) => {
            const Icon = feature.icon
            return (
              <div key={i} className="p-6 bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-500 transition">
                <Icon className="w-12 h-12 text-indigo-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
