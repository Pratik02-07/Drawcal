import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Paper, Title, Text, Button, Container, TextInput, PasswordInput } from '@mantine/core';
import axios from 'axios';
import { useAuth } from '../../lib/auth';
import './styles.css';

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
axios.defaults.withCredentials = true;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    // Check for token in URL when redirected from Google OAuth
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      handleTokenLogin(token);
    }
  }, [location]);

  const handleTokenLogin = async (token: string) => {
    try {
      setIsLoading(true);
      setError('');
      
      // Verify token with backend
      const response = await axios.get('/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        login(token, response.data.user);
        navigate('/canvas');
      }
    } catch (err: any) {
      console.error('Token verification error:', err);
      setError('Failed to verify login token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('/auth/login', {
        username,
        password
      });

      if (response.data.success) {
        login(response.data.token, response.data.user);
        navigate('/canvas');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response) {
        // Server responded with an error
        setError(err.response.data.detail || 'Invalid username or password');
      } else if (err.request) {
        // Request was made but no response received
        setError('Unable to connect to the server. Please check your internet connection.');
      } else {
        // Something else went wrong
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleAuthUrl = `${import.meta.env.VITE_API_URL}/auth/google/login`;
    window.location.href = googleAuthUrl;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3A59D1] to-[#B5FCCD] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <Title order={1} className="text-5x1 font-bold mb-4 excalifont-text text-[#000000]">
            Welcome to DrawCal
          </Title>
          <Text className="text-2xl excalifont-text text-gray-700"> 
            Where Math Meets Creativity
          </Text>
        </div>

        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Login Card */}
          <Paper 
            shadow="xl" 
            p="xl" 
            radius="lg" 
            className="w-full bg-white/90 backdrop-blur-sm"
          >
            <Title order={2} className="mb-8 excalifont-text text-3xl text-center">
              Get Started
            </Title>
            <h1 className="text-center text-xl excalifont-text mt-10" >
              Password less login with google
            </h1>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <Text color="red" size="sm" ta="center" className="excalifont-text">
                  {error}
                </Text>
              </div>
            )}

            {/* <form onSubmit={handleLogin} className="space-y-6">
              <TextInput
                label="Username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
                size="lg"
                radius="md"
                className="w-full excalifont-text"
                classNames={{ label: 'excalifont-text' }}
              />
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
                size="lg"
                radius="md"
                className="w-full excalifont-text"
                classNames={{ label: 'excalifont-text' }}
              />
              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                size="lg"
                radius="md"
                className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700 transition-all duration-300 excalifont-text"
              >
                {isLoading ? 'Signing in...' : 'Log in'}
              </Button>
            </form> */}
{/* 
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500 excalifont-text">Or continue with</span>
              </div>
            </div> */}

           <div className="mt-16">   
           <Button
              variant="outline"
              fullWidth
              onClick={handleGoogleLogin}
              disabled={isLoading}
              size="lg"
              radius="md"
              className="flex items-center justify-center gap-3 border-gray-300 hover:bg-gray-50 excalifont-text"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google Logo"
                className="w-14 h-7"
              />
              Sign in with Google
            </Button>


           </div>

            {/* <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <Text size="sm" c="dimmed" ta="center" className="excalifont-text">
                Test Accounts:
                <br />
                <span className="font-semibold">Admin</span> - username: admin, password: admin
                <br />
                <span className="font-semibold">User</span> - username: user, password: user123
              </Text>
            </div> */}
          </Paper>

          {/* About Card */}
          <Paper 
            shadow="xl" 
            p="xl" 
            radius="lg" 
            className="w-full bg-white/90 backdrop-blur-sm"
          >
            <Title order={2} className="mb-8 excalifont-text text-3xl text-center">
              About DrawCal
            </Title>
            <Text className="mb-6 excalifont-text">
              DrawCal is an innovative platform that combines mathematical calculations with creative expression. 
              Our mission is to make math more accessible and enjoyable for everyone.
            </Text>
            <Text className="mb-6 excalifont-text">
              Features:
            </Text>
            <ul className="list-disc pl-6 mb-6 excalifont-text">
              <li>Real-time equation solving</li>
              <li>Beautiful visualizations</li>
              <li>Easy-to-use interface</li>
              <li>Quick calculations</li>
              {/* <li>Simple sharing</li> */}
            </ul>
            
            {/* GIF Section - Moved to bottom
            <div className="mt-8 flex justify-center">
              <img 
                src="/1.gif" 
                alt="DrawCal Demo" 
                className="rounded-lg shadow-md max-w-full h-auto"
                style={{ maxHeight: '300px' }}
              />
            </div> */}
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Login; 