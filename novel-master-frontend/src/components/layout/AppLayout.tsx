// src/components/layout/AppLayout.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { useAuth } from '../../hooks/useAuth';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { TopBar } from './TopBar';
import { motion, AnimatePresence } from 'framer-motion';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { sidebarOpen, theme } = useStore();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isEditorPage = location.pathname.includes('/editor');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — Desktop (spacer) + Mobile (overlay) */}
      <AnimatePresence>
        {isAuthenticated && sidebarOpen && !isEditorPage && (
          <>
            {/* Desktop: takes up layout space */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="hidden lg:block w-[280px] flex-shrink-0"
            >
              <Sidebar />
            </motion.div>
            {/* Mobile: fixed overlay with backdrop */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px]"
            >
              <Sidebar />
            </motion.div>
            {/* Mobile backdrop to close sidebar when tapping outside */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 z-40 bg-black/50"
            />
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {isAuthenticated && <TopBar />}
        <main className={`flex-1 ${isEditorPage ? 'p-0' : 'p-4 lg:p-6'} pb-20 lg:pb-6`}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Mobile Navigation */}
      {isAuthenticated && <MobileNav />}
    </div>
  );
}
