import { useState } from 'react';
import { Link } from 'react-router-dom';
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) { setSubmitted(true); }
      else { setError(data.message || 'Failed to send reset link'); }
    } catch { setError('Network error'); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md py-12 relative z-10">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">NovelistAI</span>
        </div>
        {!submitted ? (
          <>
            <h1 className="text-3xl font-bold text-center text-white mb-2">Reset Password</h1>
            <p className="text-center text-gray-400 text-sm mb-8">Enter your email to receive a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">{error}</div>}
              <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-all text-sm" />
              <button type="submit" disabled={loading} className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 text-sm">{loading ? 'Sending...' : 'Send Reset Link'}</button>
            </form>
          </>
        ) : (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">If an account exists, a reset link has been sent.</div>
        )}
        <p className="text-center text-gray-500 text-sm mt-6"><Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium">Back to sign in</Link></p>
      </div>
    </div>
  );
}
