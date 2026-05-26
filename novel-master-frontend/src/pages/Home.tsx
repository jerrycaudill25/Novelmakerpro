import React from 'react'
import { BookOpen, Sparkles, Users, BarChart3 } from 'lucide-react'

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Write Better Stories with AI
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Novel Master is your AI-enhanced writing platform designed to help authors create, edit, and publish their best work.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition">
              Start Writing
            </button>
            <button className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg font-semibold transition">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
          Powerful Features for Authors
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            icon={<BookOpen className="w-8 h-8" />}
            title="Rich Editor"
            description="Professional writing environment with distraction-free mode"
          />
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="AI Assistance"
            description="Get suggestions, grammar checks, and creative ideas"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Collaboration"
            description="Share your work and get feedback from readers"
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Analytics"
            description="Track progress with detailed writing statistics"
          />
        </div>
      </section>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="bg-white bg-opacity-10 backdrop-blur-lg p-6 rounded-xl hover:bg-opacity-20 transition border border-white border-opacity-20">
    <div className="text-indigo-400 mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300 text-sm">{description}</p>
  </div>
)

export default Home
