import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { LibraryPage } from './pages/LibraryPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { CirclesPage } from './pages/CirclesPage';
import ProtectedRoute from './components/ProtectedRoute';
import AuthHandler from './components/AuthHandler';
import { AppLayout } from './components/layout/AppLayout';
import { FullScreenEditor } from './components/editor/FullScreenEditor';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminPage from './pages/AdminPage';
import CharactersPage from './pages/CharactersPage';
import TimelinePage from './pages/TimelinePage';
import LorebookPage from './pages/LorebookPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth" element={<AuthHandler />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<ProtectedRoute><AppLayout><HomePage /></AppLayout></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><AppLayout><HomePage /></AppLayout></ProtectedRoute>} />
        <Route path="/discover" element={<ProtectedRoute><AppLayout><HomePage /></AppLayout></ProtectedRoute>} />
        <Route path="/trending" element={<ProtectedRoute><AppLayout><HomePage /></AppLayout></ProtectedRoute>} />
        <Route path="/library" element={<ProtectedRoute><AppLayout><LibraryPage /></AppLayout></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><AppLayout><ProjectsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/circles" element={<ProtectedRoute><AppLayout><CirclesPage /></AppLayout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AppLayout><AdminPage /></AppLayout></ProtectedRoute>} />
        <Route path="/characters" element={<ProtectedRoute><AppLayout><CharactersPage /></AppLayout></ProtectedRoute>} />
        <Route path="/timelines" element={<ProtectedRoute><AppLayout><TimelinePage /></AppLayout></ProtectedRoute>} />
        <Route path="/lorebook" element={<ProtectedRoute><AppLayout><LorebookPage /></AppLayout></ProtectedRoute>} />
        <Route path="/editor/new" element={<ProtectedRoute><AppLayout><FullScreenEditor /></AppLayout></ProtectedRoute>} />
        <Route path="/editor/:projectId" element={<ProtectedRoute><AppLayout><FullScreenEditor /></AppLayout></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
