// src/pages/AuthPage.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Sparkles, ArrowRight } from 'lucide-react';
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
        // FIXED: Added fallback (|| formData.username) to ensure display_name is sent
        await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          display_name: formData.display_name || formData.username
        });
        toast.success('Account created! Welcome to Novel Master.');
      }
      navigate('/');
    } catch (err: any) {
      console.error('Registration failed:', err.response?.data);
      toast.error(err.response?.data?.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
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
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24">
        <motion.div className="max-w-md w-full mx-auto">
          <h2 className="text-3xl font-bold text-text-primary mb-2">
            {mode === 'login' ? 'Welcome back' : 'Start your journey'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === 'register' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4">
                  <Input label="Display Name" placeholder="How should we call you?" icon={<User className="w-4 h-4" />} value={formData.display_name} onChange={(e) => setFormData({ ...formData, display_name: e.target.value })} />
                  <Input label="Email" type="email" placeholder="you@example.com" icon={<Mail className="w-4 h-4" />} value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </motion.div>
              )}
            </AnimatePresence>
            <Input label="Username" placeholder="your_username" icon={<User className="w-4 h-4" />} value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} required />
            <Input label="Password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" icon={<Lock className="w-4 h-4" />} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
            
            <Button type="submit" fullWidth size="lg" isLoading={mode === 'login' ? isLoginLoading : isRegisterLoading} className="mt-6">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
