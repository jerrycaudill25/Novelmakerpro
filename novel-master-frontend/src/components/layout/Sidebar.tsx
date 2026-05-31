import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home, Compass, BookOpen, Users, Settings, Crown,
  Feather, TrendingUp, MessageCircle, FolderOpen,
  ChevronLeft, Sparkles, Shield, Clock
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { StorageIndicator } from '../StorageIndicator';

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
  { icon: BookOpen, label: 'Characters', path: '/characters' },
  { icon: Clock, label: 'Timelines', path: '/timelines' },
  { icon: BookOpen, label: 'Lorebook', path: '/lorebook' },
];

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setSidebarOpen, projects } = useStore();

  const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => {
    const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
    return (
      <motion.button
        whileHover={{ x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate(path)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
          isActive
            ? 'bg-purple-500/15 text-purple-400'
            : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
        }`}
      >
        <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
        {label}
        {isActive && (
          <motion.div
            layoutId="sidebarIndicator"
            className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500"
          />
        )}
      </motion.button>
    );
  };

  return (
    <div className="fixed left-0 top-0 bottom-0 w-[280px] bg-[#0f0f1a] border-r border-gray-800 flex flex-col z-50">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <span className="font-bold text-lg text-white">NovelistAI</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-800"
        >
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {user && (
        <div className="px-4 pb-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-900 hover:bg-gray-800 cursor-pointer transition-colors border border-gray-800"
          >
            <Avatar src={user.avatar_url} alt={user.display_name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-white truncate">{user.display_name}</p>
              <p className="text-xs text-gray-500">@{user.username}</p>
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

      <div className="flex-1 overflow-y-auto px-3 space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</p>
          {mainNavItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Create</p>
          {createNavItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>
        <div className="space-y-1">
          <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Library</p>
          {libraryNavItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </div>
        {user?.role === 'admin' && (
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Admin</p>
            <NavItem icon={Shield} label="Admin Dashboard" path="/admin" />
          </div>
        )}
        {projects.length > 0 && (
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent</p>
            {projects.slice(0, 5).map((project) => (
              <motion.button
                key={project.project_id}
                whileHover={{ x: 4 }}
                onClick={() => navigate(`/editor/${project.project_id}`)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span className="truncate">{project.title}</span>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <StorageIndicator />

      <div className="p-3 border-t border-gray-800">
        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => navigate('/settings')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
        >
          <Settings className="w-5 h-5" />
          Settings
        </motion.button>
      </div>
    </div>
  );
}
