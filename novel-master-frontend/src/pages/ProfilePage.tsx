// src/pages/ProfilePage.tsx
import { useState } from 'react';
// CRITICAL FIX: Migrated from '@tanstack/react-query' v3 to '@tanstack/react-query' v5
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Settings, LogOut, BookOpen, Heart, Users, Crown, ChevronRight,
  Edit3, Shield, CreditCard, Bell, Moon, Sun, Globe
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import toast from 'react-hot-toast';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, theme, toggleTheme } = useAuth();
  const { preferences } = useStore();

  // CRITICAL FIX: v5 useQuery uses object syntax
  const { data: followers } = useQuery({
    queryKey: ['followers'],
    queryFn: api.getFollowers,
    enabled: !!user,
  });

  // CRITICAL FIX: v5 useQuery uses object syntax
  const { data: following } = useQuery({
    queryKey: ['following'],
    queryFn: api.getFollowing,
    enabled: !!user,
  });

  const menuItems = [
    { icon: Edit3, label: 'Edit Profile', action: () => navigate('/settings/profile') },
    { icon: Shield, label: 'Privacy & Security', action: () => navigate('/settings/privacy') },
    { icon: CreditCard, label: 'Subscription', action: () => navigate('/settings/billing') },
    { icon: Bell, label: 'Notifications', action: () => navigate('/settings/notifications') },
    { icon: Globe, label: 'Language', action: () => toast.info('Language settings coming soon!') },
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-text-muted">Please sign in to view your profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="relative inline-block mb-4">
          <Avatar src={user.avatar_url} alt={user.display_name} size="xl" />
          <button
            onClick={() => toast.info('Avatar upload coming soon!')}
            className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg"
          >
            <Edit3 className="w-4 h-4 text-white" />
          </button>
        </div>
        <h1 className="text-2xl font-bold text-text-primary">{user.display_name}</h1>
        <p className="text-text-muted">@{user.username}</p>
        {user.bio && <p className="text-text-secondary mt-2 max-w-md mx-auto">{user.bio}</p>}

        <div className="flex items-center justify-center gap-2 mt-3">
          {user.tier !== 'free' && (
            <Badge variant={user.tier === 'enterprise' ? 'warning' : 'primary'}>
              <Crown className="w-3 h-3" />
              {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
            </Badge>
          )}
          {user.is_verified && (
            <Badge variant="success">
              <Shield className="w-3 h-3" />
              Verified
            </Badge>
          )}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center">
          <BookOpen className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-xl font-bold text-text-primary">0</p>
          <p className="text-xs text-text-muted">Projects</p>
        </Card>
        <Card className="p-4 text-center">
          <Users className="w-5 h-5 text-accent mx-auto mb-1" />
          <p className="text-xl font-bold text-text-primary">{followers?.length || 0}</p>
          <p className="text-xs text-text-muted">Followers</p>
        </Card>
        <Card className="p-4 text-center">
          <Heart className="w-5 h-5 text-danger mx-auto mb-1" />
          <p className="text-xl font-bold text-text-primary">{following?.length || 0}</p>
          <p className="text-xs text-text-muted">Following</p>
        </Card>
      </div>

      {/* Storage Bar */}
      <Card className="p-4 mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-text-primary">Storage</span>
          <span className="text-xs text-text-muted">
            {user.storage_used_mb.toFixed(1)} / {user.storage_limit_mb} MB
          </span>
        </div>
        <div className="w-full bg-surface-hover rounded-full h-2 mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(user.storage_used_mb / user.storage_limit_mb) * 100}%` }}
            className="h-full bg-primary rounded-full"
          />
        </div>
        {user.tier === 'free' && (
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            className="mt-2 text-primary"
            onClick={() => navigate('/settings/billing')}
          >
            <Crown className="w-4 h-4" />
            Upgrade for 10GB storage
          </Button>
        )}
      </Card>

      {/* Menu */}
      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 4 }}
            onClick={item.action}
            className="w-full flex items-center gap-3 px-4 py-3 bg-surface hover:bg-surface-hover rounded-xl transition-colors text-left"
          >
            <item.icon className="w-5 h-5 text-text-muted" />
            <span className="flex-1 text-text-primary font-medium">{item.label}</span>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </motion.button>
        ))}

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ x: 4 }}
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-4 py-3 bg-surface hover:bg-surface-hover rounded-xl transition-colors text-left"
        >
          {theme === 'dark' ? <Moon className="w-5 h-5 text-text-muted" /> : <Sun className="w-5 h-5 text-text-muted" />}
          <span className="flex-1 text-text-primary font-medium">Theme</span>
          <span className="text-sm text-text-muted capitalize">{theme}</span>
        </motion.button>

        {/* Logout */}
        <motion.button
          whileHover={{ x: 4 }}
          onClick={() => {
            logout();
            navigate('/auth');
            toast.success('Signed out successfully');
          }}
          className="w-full flex items-center gap-3 px-4 py-3 bg-danger/10 hover:bg-danger/20 rounded-xl transition-colors text-left mt-4"
        >
          <LogOut className="w-5 h-5 text-danger" />
          <span className="flex-1 text-danger font-medium">Sign Out</span>
        </motion.button>
      </div>
    </div>
  );
}
