import { useState, useEffect } from 'react';
import { Modal, Button, Stack, Text, Group, Card, Tabs, Avatar, Badge, ActionIcon, ScrollArea, Box, Paper } from '@mantine/core';
import { useAuth } from '../lib/auth';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

interface ReviewExpression {
  id: string;
  expression: string;
  timestamp: string;
  result: string;
}

interface ProfilePopupProps {
  opened: boolean;
  onClose: () => void;
}

const ProfilePopup = ({ opened, onClose }: ProfilePopupProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reviewExpressions, setReviewExpressions] = useState<ReviewExpression[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>('profile');
  const [userCreatedAt, setUserCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/user/profile`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserCreatedAt(data.createdAt || null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const fetchReviewExpressions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/review-expressions`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setReviewExpressions(data);
        }
      } catch (error) {
        console.error('Error fetching review expressions:', error);
      }
    };

    if (opened) {
      fetchUserData();
      if (activeTab === 'history') {
        fetchReviewExpressions();
      }
    }
  }, [opened, activeTab]);

  // Add blur overlay when modal is opened
  useEffect(() => {
    if (opened) {
      document.body.style.overflow = 'hidden';
      // Create a blur overlay div
      const overlay = document.createElement('div');
      overlay.id = 'profile-blur-overlay';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backdropFilter = 'blur(5px)';
      overlay.style.zIndex = '999';
      document.body.appendChild(overlay);
    } else {
      document.body.style.overflow = '';
      // Remove the blur overlay
      const overlay = document.getElementById('profile-blur-overlay');
      if (overlay) {
        document.body.removeChild(overlay);
      }
    }
    
    return () => {
      document.body.style.overflow = '';
      // Clean up the blur overlay
      const overlay = document.getElementById('profile-blur-overlay');
      if (overlay) {
        document.body.removeChild(overlay);
      }
    };
  }, [opened]);

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Modal 
        opened={opened} 
        onClose={onClose} 
        size="lg"
        padding={0}
        radius="md"
        centered
        classNames={{
          content: 'bg-[#1a1b1e]',
          header: 'hidden'
        }}
        transitionProps={{
          duration: 200,
          transition: 'slide-up'
        }}
        styles={{
          content: {
            zIndex: 1000,
            position: 'relative',
            boxShadow: '0 0 20px rgb(255, 255, 255)'
          },
          inner: {
            zIndex: 1000
          },
          overlay: {
            zIndex: 998
          }
        }}
      >
        <div className="flex min-h-[400px] max-h-[70vh]">
          {/* Left Sidebar */}
          <div className="w-64 bg-[#25262b] border-r border-[#2c2e33] p-4 flex flex-col">
            <div className="mb-6">
              <Group justify="space-between">
                <Text className="text-white text-lg font-medium">Profile</Text>
                <ActionIcon onClick={onClose} variant="subtle" className="text-white hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </ActionIcon>
              </Group>
            </div>

            <div className="space-y-4 mb-6">
              <Avatar 
                size={80} 
                radius={80}
                color="#9ACBD0"
                className="mx-auto ring-2 ring-blue-500/30"
              >
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Avatar>
              <div className="text-center">
                <Text className="text-white font-semibold text-lg">{user?.name || 'User'}</Text>
                <Text size="sm" className="text-white/80">{user?.email}</Text>
              </div>
            </div>

            <div className="flex-1">
              <div className="space-y-2">
                <Button 
                  variant="subtle"
                  fullWidth
                  className={`justify-start h-auto py-2 ${activeTab === 'profile' ? 'bg-grey-500/10 text-white' : 'text-white hover:bg-[#2c2e33]'}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <circle cx="12" cy="12" r="9"></circle>
                      <circle cx="12" cy="10" r="3"></circle>
                      <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
                    </svg>
                    Account Details
                  </div>
                </Button>
                {/* <Button 
                  variant="subtle"
                  fullWidth
                  className={`justify-start h-auto py-2 ${activeTab === 'history' ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:bg-[#2c2e33]'}`}
                  onClick={() => setActiveTab('history')}
                  leftIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                      <circle cx="12" cy="12" r="9"></circle>
                      <polyline points="12 7 12 12 15 15"></polyline>
                    </svg>
                  }
                >
                  History
                </Button> */}
              </div>
            </div>

            <Button 
              color="red" 
              variant="subtle"
              onClick={handleLogout}
              fullWidth
              className="mt-4 border border-red-500/20 hover:bg-red-500/10 text-red-400 hover:text-red-300"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
                  <path d="M20 12h-13l3 -3m0 6l-3 -3"></path>
                </svg>
                Logout
              </div>
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6 bg-[#0000]">
            {activeTab === 'profile' ? (
              <div className="space-y-4">
                <Text className="text-white text-xl font-semibold mb-4">Account Information</Text>
                <Paper className="bg-[#25262b] p-4 space-y-4">
                  <div className="space-y-4">
                    <div className="p-4 rounded-md bg-[#2c2e33] border border-[#373a40]">
                      <Text size="sm" className="text-white font-medium mb-2">Email</Text>
                      <Text className="text-white text-lg font-semibold">{user?.email}</Text>
                    </div>
                    <div className="p-4 rounded-md bg-[#2c2e33] border border-[#373a40]">
                      <Text size="sm" className="text-white font-medium mb-2">Name</Text>
                      <Text className="text-white text-lg font-semibold">{user?.name || 'Not provided'}</Text>
                    </div>
                  </div>
                </Paper>
              </div>
            ) : (
              <div className="space-y-4">
                <Group justify="space-between" align="center">
                  <Text className="text-gray-300 text-lg font-medium">Calculation History</Text>
                  <Badge variant="dot" color="blue" className="bg-blue-500/10 text-blue-400">
                    {reviewExpressions.length} Items
                  </Badge>
                </Group>

                <ScrollArea h="calc(80vh - 120px)" className="px-1">
                  {reviewExpressions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-8 text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mb-3">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                        <path d="M12 12l-3 2"></path>
                        <path d="M12 7v5"></path>
                      </svg>
                      <Text className="text-gray-400">No calculations yet</Text>
                      <Text size="sm" className="text-gray-600 mt-1">Your calculation history will appear here</Text>
                    </div>
                  ) : (
                    <Stack gap="sm">
                      {reviewExpressions.map((expr) => (
                        <Paper 
                          key={expr.id}
                          className="bg-[#25262b] border border-[#373a40] p-4 hover:border-blue-500/30 transition-colors"
                        >
                          <Stack gap="xs">
                            <Group justify="space-between" className="border-b border-[#2c2e33] pb-2">
                              <Text className="text-gray-200 font-medium">
                                {expr.expression}
                              </Text>
                              <Badge size="sm" variant="dot" color="green" className="bg-green-500/10 text-green-400">
                                Success
                              </Badge>
                            </Group>
                            <Group justify="space-between">
                              <Text className="text-gray-400">Result: <span className="text-gray-200">{expr.result}</span></Text>
                              <Text size="xs" className="text-gray-600">
                                {formatDate(expr.timestamp)}
                              </Text>
                            </Group>
                          </Stack>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfilePopup; 