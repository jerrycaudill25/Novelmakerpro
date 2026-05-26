import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import Home from './pages/Home'
import { useStore } from './store/index'

function App() {
  const { user } = useStore()

  return (
    <Router>
      <div className="min-h-screen bg-gray-950">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
