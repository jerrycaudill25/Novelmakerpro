import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { HomePage } from './pages/HomePage'

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<HomePage />} />
          <Route path="/trending" element={<HomePage />} />
        </Routes>
      </AppLayout>
    </Router>
  )
}

export default App
