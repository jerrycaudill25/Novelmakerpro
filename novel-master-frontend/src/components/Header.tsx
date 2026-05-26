import { Link } from 'react-router-dom'
import { useAppStore } from '../store'

export default function Header() {
  const { user, logout } = useAppStore()

  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-600 rounded"></div>
            <span className="text-xl font-bold text-white">NovelMaster</span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/novels" className="text-slate-300 hover:text-white transition">
                  My Novels
                </Link>
                <span className="text-slate-400">|</span>
                <span className="text-slate-300">{user.name}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-slate-300 hover:text-white transition">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  )
}
