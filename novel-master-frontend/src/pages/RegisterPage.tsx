import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, isRegisterLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(username)) {
      setError('Username: 3-30 chars, letters/numbers/underscores only');
      return;
    }
    setError('');
    try {
      await register({ username, email, password, display_name: displayName });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden px-4">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[100px]" />
      <div className="w-full max-w-md py-12 relative z-10">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">NovelistAI</span>
        </div>
        <h1 className="text-3xl font-bold text-center text-white mb-2">Create Account</h1>
        <p className="text-center text-gray-400 text-sm mb-8">Join the community of storytellers.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>
          )}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Username <span className="text-gray-500 font-normal">(your unique handle)</span></label>
            <input type="text" placeholder="jerry_25" value={username} onChange={(e) => setUsername(e.target.value)} required className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm" />
            <p className="text-gray-600 text-xs mt-1">3-30 characters. Letters, numbers, underscores only.</p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Display Name</label>
            <input type="text" placeholder="Jerry" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm" />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm" />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Password <span className="text-gray-500 font-normal">(min 8 chars)</span></label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm" />
          </div>
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1.5">Confirm Password</label>
            <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all text-sm" />
          </div>
          <button type="submit" disabled={isRegisterLoading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2">
            {isRegisterLoading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
