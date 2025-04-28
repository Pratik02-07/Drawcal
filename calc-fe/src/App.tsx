import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './screens/home';
import Login from './screens/login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './lib/auth';

import '@/index.css';

const App = () => {
  return (
    <MantineProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Login route */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected canvas route */}
            <Route
              path="/canvas"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Auth callback route */}
            <Route path="/auth/callback" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
