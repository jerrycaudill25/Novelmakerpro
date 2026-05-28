import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from './components/layout/AppLayout'
import { HomePage } from './pages/HomePage'
import { CirclesPage } from './pages/CirclesPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { AuthPage } from './pages/AuthPage'

// Create the network query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Route: Login/Auth stays outside the main layout */}
          <Route path="/login" element={<AuthPage />} />

          {/* Protected Routes: Everything else goes inside the Layout */}
          <Route path="/*" element={
            <AppLayout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/discover" element={<HomePage />} />
                <Route path="/trending" element={<HomePage />} />
                <Route path="/circles" element={<CirclesPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
              </Routes>
            </AppLayout>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
