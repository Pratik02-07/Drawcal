import React, { useState } from 'react';
import { Button, Group, ActionIcon, Tooltip } from '@mantine/core';
import axios from 'axios';
import Canvas from '../../components/Canvas';
import ProfilePopup from '../../components/ProfilePopup';

interface Result {
  expr: string;
  result: string;
}

// Utility function to format numbers while preserving decimal points
const formatNumber = (value: string): string => {
  // If it's not a number or empty, return as is
  if (!value || isNaN(Number(value))) {
    return value;
  }

  try {
    const num = parseFloat(value);
    
    // For scientific notation, convert to decimal
    if (value.includes('e') || value.includes('E')) {
      return num.toFixed(6).replace(/\.?0+$/, '');
    }
    
    // If original value had decimal or is a decimal result
    if (value.includes('.') || num % 1 !== 0) {
      // First convert to a fixed number of decimal places
      let result = num.toFixed(6);
      
      // If original had specific decimal places, use that instead
      if (value.includes('.')) {
        const originalDecimals = value.split('.')[1]?.length || 0;
        result = num.toFixed(Math.max(originalDecimals, 3));
      }
      
      // Remove trailing zeros but keep at least 3 decimal places
      const parts = result.split('.');
      if (parts[1]) {
        const decimals = parts[1].replace(/0+$/, '');
        if (decimals.length < 3) {
          parts[1] = parts[1].slice(0, 3);
        } else {
          parts[1] = decimals;
        }
        return parts.join('.');
      }
      return result;
    }
    
    // For whole numbers that are results of calculations
    if (value.includes('/') || value.includes('*') || value.includes('+') || value.includes('-')) {
      return num.toFixed(3);
    }
    
    // For simple whole numbers
    return num.toString();
  } catch (error) {
    console.error('Error formatting number:', error);
    return value;
  }
};

const Home: React.FC = () => {
  const [result, setResult] = useState<Result[]>([]);  // Stores calculation results
  const [isLoading, setIsLoading] = useState(false);   // Loading state for API calls
  const [dictOfVars, setDictOfVars] = useState<Record<string, string>>({}); // Stores variables
  const [profileOpened, setProfileOpened] = useState(false); // Controls profile popup visibility

  const handleCalculate = async (imageData: string) => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/calculator/process`,
        {
          image: imageData,
          dict_of_vars: dictOfVars
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }
      );

      if (response.data && response.data.type === 'success' && Array.isArray(response.data.data)) {
        // Format the results before setting them
        const formattedResults = response.data.data.map((item: Result & { assign?: boolean }) => ({
          ...item,
          result: formatNumber(item.result)
        }));
        
        setResult(formattedResults);
        
        // Update variables if there are any assignments
        formattedResults.forEach((item: Result & { assign?: boolean }) => {
          if (item.assign) {
            setDictOfVars(prev => ({
              ...prev,
              [item.expr]: item.result
            }));
          }
        });
      } else {
        console.error('Invalid response format:', response.data);
        setResult([{ expr: 'Error', result: 'Invalid response format' }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult([{ expr: 'Error in API call', result: String(error) }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Group justify="flex-end" className="fixed top-4 right-4 z-30">
        <Tooltip label="Profile" position="bottom" withArrow>
          <ActionIcon
            onClick={() => setProfileOpened(true)}
            size="lg"
            radius="md"
            variant="filled"
            color="blue"
            className="shadow-md hover:shadow-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <circle cx="12" cy="12" r="9"></circle>
              <circle cx="12" cy="10" r="3"></circle>
              <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855"></path>
            </svg>
          </ActionIcon>
        </Tooltip>
      </Group>

      <Canvas onCalculate={handleCalculate} isLoading={isLoading} />

      {result.length > 0 && (
        <div className='fixed bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg z-20'>
          {result.map((item: Result, index: number) => (
            <div key={index} className="text-lg font-semibold">
              <p>Expression: {item.expr}</p>
              <p>Result: {formatNumber(item.result)}</p>
            </div>
          ))}
        </div>
      )}

      <ProfilePopup 
        opened={profileOpened} 
        onClose={() => setProfileOpened(false)} 
      />
    </>
  );
};

export default Home;
