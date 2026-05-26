// src/components/layout/Sidebar.tsx
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, Compass, BookOpen, Users, Settings, Crown,
  Feather, TrendingUp, MessageCircle, FolderOpen,
  ChevronLeft, Sparkles
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';

const mainNavItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Discover', path: '/discover' },
  { icon: TrendingUp, label: 'Trending', path: '/trending' },
];

const createNavItems = [
  { icon: Feather, label: 'New Project', path: '/editor/new' },
  { icon: MessageCircle, label: 'New Post', path: '/post/new' },
];

const libraryNavItems = [
  { icon: BookOpen, label: 'My Library', path: '/library' },
  { icon: FolderOpen, label: 'Projects', path: '/projects' },
  { icon: Users, label: 'Circles', path: '/circles' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setSidebarOpen, projects } = useStore();

  const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => {
    const isActive = location.pathname === path;
    return (
      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(path)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          isActive
            ? 'bg-primary/15 text-primary-light'
            : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
        }`}
      >
        <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
        {label}
        {isActive && (
          <motion.div
            layoutId="sidebarIndicator"
            className="ml-auto w-1.5 h-1.5 rounded-full bg-primary"
          />
        )}
      </motion.button>
    );
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-[280px] bg-background-secondary border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg text-text-primary">Novel Master</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-surface-hover"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* User Card */}
      {user && (
        <div className="px-4 pb-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-3 rounded-xl bg-surface hover:bg-surface-hover cursor-pointer transition-colors"
          >
            <Avatar src={user.avatar_url} alt={user.display_name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-text-primary truncate">{user.display_name}</p>
              <p className="text-xs text-text-muted">@{user.username}</p>
            </div>
            {user.tier !== 'free' && (
              <Badge variant={user.tier === 'enterprise' ? 'warning' : 'primary'} size="sm">
                <Crown className="w-3 h-3" />
                {user.tier}
              </Badge>
            )}
          </motion.div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-3 space-y-6">
        {/* Main */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Menu</p>
          {mainNavItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>

        {/* Create */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Create</p>
          {createNavItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>

        {/* Library */}
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Library</p>
          {libraryNavItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>

        {/* Recent Projects */}
        {projects.length > 0 && (
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-text-muted uppercase tracking-wider">Recent</p>
            {projects.slice(0, 5).map((project) => (
              <motion.button
                key={project.project_id}
                whileHover={{ x: 4 }}
                onClick={() => navigate(`/editor/${project.project_id}`)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span className="truncate">{project.title}</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
        >
          <Settings className="w-5 h-5" />
          Settings
        </motion.button>
      </div>
    </div>
  );
}
