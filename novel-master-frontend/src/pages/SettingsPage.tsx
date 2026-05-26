// src/pages/SettingsPage.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, User, Lock, Bell, CreditCard, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useStore } from '../store/useStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AISettingsSection } from '../components/settings/AISettingsSection';
import toast from 'react-hot-toast';

export function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useStore();
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'ai', label: 'AI & Learning', icon: Bot },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => navigate('/profile')}
          className="p-2 rounded-lg hover:bg-surface-hover text-text-muted"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="hidden sm:block w-48 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-primary/15 text-primary-light'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-text-primary">Profile Information</h2>
              <Input label="Display Name" defaultValue={user?.display_name} />
              <Input label="Bio" defaultValue={user?.bio} />
              <Input label="Email" defaultValue={user?.email} disabled />
              <Button>Save Changes</Button>
            </motion.div>
          )}

          {activeSection === 'privacy' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-text-primary">Privacy Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
                  <div>
                    <p className="font-medium text-text-primary">Default Visibility</p>
                    <p className="text-sm text-text-muted">New posts default to this setting</p>
                  </div>
                  <select className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-text-primary">
                    <option>Private</option>
                    <option>Followers</option>
                    <option>Public</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-4 bg-surface rounded-xl">
                  <div>
                    <p className="font-medium text-text-primary">Allow Comments</p>
                    <p className="text-sm text-text-muted">Let others comment on your posts</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      theme === 'dark' ? 'bg-primary' : 'bg-surface-hover'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      theme === 'dark' ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-text-primary">Notification Preferences</h2>
              <div className="space-y-3">
                {['Email notifications', 'Push notifications', 'Weekly digest', 'AI audit complete'].map((item) => (
                  <div key={item} className="flex items-center justify-between p-4 bg-surface rounded-xl">
                    <span className="text-text-primary">{item}</span>
                    <div className="w-12 h-6 bg-primary rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'billing' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-lg font-semibold text-text-primary">Subscription</h2>
              <div className="p-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-primary/30">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-6 h-6 text-primary" />
                  <span className="font-bold text-text-primary">Current Plan</span>
                </div>
                <p className="text-3xl font-bold text-text-primary mb-1">
                  {user?.tier === 'free' ? 'Free' : user?.tier}
                </p>
                <p className="text-text-secondary mb-4">
                  {user?.tier === 'free'
                    ? '100 MB storage, basic features'
                    : 'Full access to all features'}
                </p>
                {user?.tier === 'free' && (
                  <Button onClick={() => toast.info('Payment integration coming soon!')}>
                    Upgrade to Pro
                  </Button>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'ai' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <AISettingsSection />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
