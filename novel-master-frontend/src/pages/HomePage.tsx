// src/pages/HomePage.tsx
import { useState, useEffect } from 'react';
// CRITICAL FIX: Migrated from '@tanstack/react-query' v3 to '@tanstack/react-query' v5
import { useInfiniteQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Users } from 'lucide-react';
import { api } from '../services/api';
import { useStore } from '../store/useStore';
import { PostCard } from '../components/feed/PostCard';
import { FeedTabs } from '../components/feed/FeedTabs';
import { Skeleton } from '../components/ui/Skeleton';
import { useInView } from 'react-intersection-observer';

const tabs = [
  { id: 'for-you', label: 'For You' },
  { id: 'following', label: 'Following' },
  { id: 'trending', label: 'Trending' },
];

const genres = ['All', 'Fantasy', 'Romance', 'Sci-Fi', 'Mystery', 'Thriller', 'Horror'];

export function HomePage() {
  const [activeTab, setActiveTab] = useState('for-you');
  const [activeGenre, setActiveGenre] = useState('All');
  const { ref, inView } = useInView();

  // CRITICAL FIX: v5 useInfiniteQuery uses object syntax
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['feed', activeTab],
    queryFn: ({ pageParam = 0 }) => api.getFeed(20, pageParam),
    // CRITICAL FIX: v5 getNextPageParam signature changed — receives object with allPages, lastPage, etc.
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 20 ? allPages.length * 20 : undefined,
    initialPageParam: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const posts = data?.pages.flat() ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary mb-4">Community</h1>
        <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
      </div>

      {/* Genre Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {genres.map((genre) => (
          <motion.button
            key={genre}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveGenre(genre)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeGenre === genre
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-hover'
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
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/20 p-6 mb-6"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-primary-light font-semibold">#FantasyMay</span>
          </div>
          <p className="text-text-secondary text-sm mb-3">Write. Share. Inspire.</p>
          <button className="text-sm font-medium text-primary-light hover:text-primary flex items-center gap-1">
            Explore now <TrendingUp className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-primary/10 to-transparent" />
      </motion.div>

      {/* Posts */}
      <div className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-48" count={3} />
          </>
        ) : (
          posts.map((post, index) => (
            <PostCard key={post.post_id} post={post} index={index} />
          ))
        )}
      </div>

      {/* Load More Trigger */}
      <div ref={ref} className="py-8 flex justify-center">
        {isFetchingNextPage && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
          />
        )}
      </div>
    </div>
  );
}
