// src/components/feed/PostCard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, Crown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// CRITICAL FIX: Migrated from '@tanstack/react-query' v3 to '@tanstack/react-query' v5
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api';
import { useStore } from '../../store/useStore';
import type { CommunityPost } from '../../types';
import { Card } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import toast from 'react-hot-toast';

interface PostCardProps {
  post: CommunityPost;
  index?: number;
}

const reactionEmojis: Record<string, string> = {
  Like: '❤️',
  Love: '🔥',
  Inspired: '✨',
  Helpful: '📚',
  Masterpiece: '👑',
};

export function PostCard({ post, index = 0 }: PostCardProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useStore();
  const [isBookmarked, setIsBookmarked] = useState(false);

  // CRITICAL FIX: v5 useMutation uses object syntax with mutationFn
  const reactMutation = useMutation({
    mutationFn: ({ postId, reaction }: { postId: number; reaction: string }) =>
      api.reactToPost(postId, reaction),
    onSuccess: () => {
      // CRITICAL FIX: v5 invalidateQueries uses object syntax
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['trending'] });
    },
  });

  const handleReact = () => {
    if (!user) {
      toast.error('Sign in to react');
      return;
    }
    const newReaction = post.user_reaction ? null : 'Like';
    reactMutation.mutate({ postId: post.post_id, reaction: newReaction || 'Like' });
  };

  const timeAgo = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Card hover className="overflow-hidden">
        {/* Header */}
        <div className="p-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar
              src={post.avatar_url}
              alt={post.display_name}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-text-primary">
                  {post.display_name}
                </span>
                {post.ai_badge_type && (
                  <Badge variant={post.ai_badge_type.toLowerCase() as any} size="sm">
                    <Sparkles className="w-3 h-3" />
                    {post.ai_badge_type}
                  </Badge>
                )}
              </div>
              <span className="text-xs text-text-muted">@{post.username} · {timeAgo(post.created_at)}</span>
            </div>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-surface-hover text-text-muted">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div
          className="px-4 pb-3 cursor-pointer"
          onClick={() => navigate(`/post/${post.post_id}`)}
        >
          <h3 className="font-bold text-lg text-text-primary mb-2">{post.title}</h3>
          <p className="text-text-secondary text-sm leading-relaxed line-clamp-3">
            {post.excerpt_text || post.body_text}
          </p>
        </div>

        {/* Engagement */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-border">
          <div className="flex items-center gap-1">
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleReact}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                post.user_reaction
                  ? 'bg-danger/15 text-danger'
                  : 'hover:bg-surface-hover text-text-muted'
              }`}
            >
              <Heart className={`w-4 h-4 ${post.user_reaction ? 'fill-current' : ''}`} />
              <span>{post.like_count}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => navigate(`/post/${post.post_id}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-text-muted hover:bg-surface-hover transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{post.comment_count}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => toast.info('Share feature coming soon!')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-text-muted hover:bg-surface-hover transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{post.share_count}</span>
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-full transition-colors ${
              isBookmarked ? 'text-primary bg-primary/15' : 'text-text-muted hover:bg-surface-hover'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </Card>
    </motion.div>
  );
}
