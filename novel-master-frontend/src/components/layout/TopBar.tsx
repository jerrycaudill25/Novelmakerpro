// src/components/layout/TopBar.tsx
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, Sparkles } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Avatar } from '../ui/Avatar';

export function TopBar() {
  const navigate = useNavigate();
  const { user, setSidebarOpen, sidebarOpen, unreadCount } = useStore();

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 lg:px-6 h-14">
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-surface-hover transition-colors"
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          <div className="lg:hidden flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold text-text-primary">Novel Master</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/search')}
            className="p-2 rounded-xl hover:bg-surface-hover transition-colors"
          >
            <Search className="w-5 h-5 text-text-secondary" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/notifications')}
            className="relative p-2 rounded-xl hover:bg-surface-hover transition-colors"
          >
            <Bell className="w-5 h-5 text-text-secondary" />
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full text-[10px] font-bold text-white flex items-center justify-center"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </motion.span>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/profile')}
            className="ml-1"
          >
            <Avatar src={user?.avatar_url} alt={user?.display_name || ''} size="sm" />
          </motion.button>
        </div>
      </div>
    </header>
  );
}
