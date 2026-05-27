import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users, BookOpen } from 'lucide-react';
import { useStore } from '../store/useStore';

const tabs = [
  { id: 'for-you', label: 'For You' },
  { id: 'following', label: 'Following' },
  { id: 'trending', label: 'Trending' },
];

const genres = ['All', 'Fantasy', 'Romance', 'Sci-Fi', 'Mystery', 'Thriller', 'Horror'];

// Sample posts for demo
const samplePosts = [
  {
    id: 1,
    author: 'Jane Writer',
    avatar: 'JW',
    title: 'The Enchanted Forest',
    excerpt: 'In a world where magic flows through ancient trees...',
    genre: 'Fantasy',
    likes: 42,
    comments: 8,
  },
  {
    id: 2,
    author: 'John Author',
    avatar: 'JA',
    title: 'Neon Nights',
    excerpt: 'The city never sleeps, and neither do the secrets...',
    genre: 'Sci-Fi',
    likes: 28,
    comments: 5,
  },
  {
    id: 3,
    author: 'Sarah Story',
    avatar: 'SS',
    title: 'Love in Paris',
    excerpt: 'Sometimes the best stories begin with a chance encounter...',
    genre: 'Romance',
    likes: 56,
    comments: 12,
  },
];

export function HomePage() {
  const [activeTab, setActiveTab] = useState('for-you');
  const [activeGenre, setActiveGenre] = useState('All');
  const { user } = useStore();

  const filteredPosts = activeGenre === 'All' 
    ? samplePosts 
    : samplePosts.filter(p => p.genre === activeGenre);

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-4">Community</h1>
        <div className="flex gap-2 border-b border-gray-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-white border-b-2 border-indigo-500'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {genres.map((genre) => (
          <motion.button
            key={genre}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeGenre === genre
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {genre}
          </motion.button>
        ))}
      </div>

      {/* Featured Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 p-6 mb-6"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <span className="text-indigo-300 font-semibold">#FantasyMay</span>
          </div>
          <p className="text-gray-300 text-sm mb-3">Write. Share. Inspire.</p>
          <button className="text-sm font-medium text-indigo-300 hover:text-indigo-200 flex items-center gap-1">
            Explore now <TrendingUp className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                {post.avatar}
              </div>
              <div>
                <p className="font-medium text-white text-sm">{post.author}</p>
                <p className="text-xs text-gray-400">{post.genre}</p>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
            <p className="text-gray-300 text-sm mb-3">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> {post.likes}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {post.comments}
              </span>
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" /> Read
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
