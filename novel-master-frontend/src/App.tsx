// src/App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { FullScreenEditor } from './components/editor/FullScreenEditor';
import { useAuth } from './hooks/useAuth';
import { useEffect } from 'react';
import { wsService } from './services/websocket';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
}

export default function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      wsService.connect();
    }
    return () => {
      wsService.disconnect();
    };
  }, [isAuthenticated]);

  return (
    <AppLayout>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/discover" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/trending" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/editor/new" element={<PrivateRoute><Navigate to="/editor/0" replace /></PrivateRoute>} />
        <Route path="/post/new" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/circles" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/search" element={<PrivateRoute><HomePage /></PrivateRoute>} />
        <Route path="/notifications" element={<PrivateRoute><HomePage /></PrivateRoute>} />

        <Route path="/library" element={<PrivateRoute><LibraryPage /></PrivateRoute>} />
        <Route path="/projects" element={<PrivateRoute><LibraryPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="/settings/:section" element={<PrivateRoute><SettingsPage /></PrivateRoute>} />
        <Route path="/editor/:projectId" element={<PrivateRoute><FullScreenEditor /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}
