import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Header from './components/Header'
import Home from './pages/Home'
import { useAppStore } from './store'

export default function App() {
  const { isAuthenticated } = useAppStore()

  useEffect(() => {
    // Initialize app - check if user is logged in
    const token = localStorage.getItem('authToken')
    if (token) {
      // Validate token and restore user state
      // This would typically call an API endpoint
    }
  }, [])

  return (
    <Router>
      <div className="min-h-screen bg-slate-950">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Add more routes here */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
