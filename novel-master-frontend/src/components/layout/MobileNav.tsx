// src/components/layout/MobileNav.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, PlusCircle, Library, User } from 'lucide-react';
import { useStore } from '../../store/useStore';

const navItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Discover', path: '/discover' },
  { icon: PlusCircle, label: 'Write', path: '/editor/new' },
  { icon: Library, label: 'Library', path: '/library' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function MobileNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useStore();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background-secondary/95 backdrop-blur-xl border-t border-border safe-area-pb"
    >
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <motion.button
              key={item.path}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                isActive ? 'text-primary' : 'text-text-muted'
              }`}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="mobileNavIndicator"
                  className="absolute -top-0.5 w-8 h-0.5 bg-primary rounded-full"
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
