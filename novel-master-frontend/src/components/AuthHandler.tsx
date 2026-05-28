import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

export default function AuthHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extract token from URL hash (e.g., #token=eyJh...)
    const hashParams = new URLSearchParams(location.hash.substring(1));
    const token = hashParams.get('token');

    if (token) {
      // Save token 
      authService.setToken(token);
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <h2>Authenticating...</h2>
    </div>
  );
}
