// src/pages/AuthPage.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import toast from 'react-hot-toast';

export function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    display_name: '',
  });
  const { login, register, isLoginLoading, isRegisterLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') {
        await login({ username: formData.username, password: formData.password });
        toast.success('Welcome back, storyteller!');
      } else {
        await register(formData);
        toast.success('Account created! Welcome to Novel Master.');
      }
      navigate('/');
    } catch (err) {
      // Error handled by API interceptor
    }
  };

  const socialProviders = [
    { name: 'Google', icon: 'G', color: 'bg-white text-gray-800' },
    { name: 'Apple', icon: '🍎', color: 'bg-white text-black' },
    { name: 'Discord', icon: 'D', color: 'bg-[#5865F2] text-white' },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <span className="text-2xl font-bold text-text-primary">Novel Master</span>
            </div>

            <h1 className="text-5xl xl:text-6xl font-bold text-text-primary leading-tight mb-6">
              Write. Enhance.<br />
              <span className="text-primary-light">Share. Belong.</span>
            </h1>

            <p className="text-lg text-text-secondary max-w-md leading-relaxed">
              AI-enhanced writing, built for storytellers. Craft your worlds, 
              refine your prose, and connect with a community that gets it.
            </p>

            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-surface border-2 border-background flex items-center justify-center text-xs font-bold text-text-secondary"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-text-primary font-semibold">10,000+ writers</p>
                <p className="text-text-muted text-sm">already creating</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 right-20 w-20 h-20 rounded-2xl bg-primary/10 backdrop-blur-sm border border-primary/20 flex items-center justify-center"
        >
          <BookOpen className="w-8 h-8 text-primary/60" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-32 right-32 w-16 h-16 rounded-xl bg-accent/10 backdrop-blur-sm border border-accent/20 flex items-center justify-center"
        >
          <Sparkles className="w-6 h-6 text-accent/60" />
        </motion.div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full mx-auto"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-text-primary">Novel Master</span>
          </div>

          <h2 className="text-3xl font-bold text-text-primary mb-2">
            {mode === 'login' ? 'Welcome back' : 'Start your journey'}
          </h2>
          <p className="text-text-secondary mb-8">
            {mode === 'login' 
              ? 'Sign in to continue writing your story.' 
              : 'Create an account to unlock your creative potential.'}
          </p>

          {/* Social Auth */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {socialProviders.map((provider) => (
              <motion.button
                key={provider.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toast.info(`${provider.name} auth coming soon!`)}
                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl ${provider.color} font-medium text-sm border border-border hover:shadow-lg transition-shadow`}
              >
                <span>{provider.icon}</span>
                <span className="hidden sm:inline">{provider.name}</span>
              </motion.button>
            ))}
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-text-muted">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <Input
                    label="Display Name"
                    placeholder="How should we call you?"
                    icon={<User className="w-4 h-4" />}
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    icon={<Mail className="w-4 h-4" />}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input
              label="Username"
              placeholder="your_username"
              icon={<User className="w-4 h-4" />}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                icon={<Lock className="w-4 h-4" />}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-text-muted hover:text-text-secondary"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={mode === 'login' ? isLoginLoading : isRegisterLoading}
              className="mt-6"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-text-secondary text-sm">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-primary-light hover:text-primary font-medium transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          <p className="mt-8 text-center text-xs text-text-muted">
            By continuing, you agree to our{' '}
            <button className="underline hover:text-text-secondary">Terms of Service</button>
            {' '}and{' '}
            <button className="underline hover:text-text-secondary">Privacy Policy</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
