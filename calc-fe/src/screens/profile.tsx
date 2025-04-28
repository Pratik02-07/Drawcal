// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Container, Title, Paper, Button, Stack, Text, Group } from '@mantine/core';
// import { useAuth } from '../lib/auth';

// const Profile = () => {
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//   };

//   return (
//     <Container size="md" py="xl">
//       <Stack gap="xl">
//         <Group justify="apart">
//           <Title order={2}>Profile</Title>
//           <Button color="red" onClick={handleLogout}>Logout</Button>
//         </Group>

//         <Paper p="md" withBorder>
//           <Stack gap="md">
//             <Title order={3}>User Information</Title>
//             <Text className="text-white">Email: {user?.email}</Text>
//             <Text className="text-white">Name: {user?.name}</Text>
//           </Stack>
//         </Paper>
//       </Stack>
//     </Container>
//   );
// };

// export default Profile; 