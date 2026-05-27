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

  // DEBUG: Show loading state
  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#0f0f23', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid #6366f1', 
          borderTopColor: 'transparent', 
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p>Loading... (isLoading: {isLoading ? 'true' : 'false'})</p>
        <p>isAuthenticated: {isAuthenticated ? 'true' : 'false'}</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <AnimatePresence>
        {isAuthenticated && sidebarOpen && !isEditorPage && (
          <>
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="hidden lg:block w-[280px] flex-shrink-0"
            >
              <Sidebar />
            </motion.div>
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px]"
            >
              <Sidebar />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => useStore.getState().setSidebarOpen(false)}
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
