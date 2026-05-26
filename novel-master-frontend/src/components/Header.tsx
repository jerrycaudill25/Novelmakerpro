import React from 'react'
import { useStore } from '../store/index'
import { LogOut, Menu } from 'lucide-react'

export const Header: React.FC = () => {
  const { user, setUser } = useStore()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">Novel Master</h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <span className="text-sm">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            ) : (
              <>
                <a href="/login" className="hover:text-opacity-80">
                  Login
                </a>
                <a href="/signup" className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-opacity-90">
                  Sign Up
                </a>
              </>
            )}
          </nav>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  )
}
