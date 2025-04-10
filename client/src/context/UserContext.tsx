import React, { createContext, useState, useContext } from 'react';
import { ZodiacSign } from '@shared/types';

// Define User interface with all the fields we need
export interface User {
  email: string;
  zodiacSign?: ZodiacSign;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthdate?: string;
  password?: string;
  smsOptIn: boolean;
  newsletterOptIn: boolean;
  isAuthenticated?: boolean;
}

// Context interface with required functions
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signUp: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

// Create context
const UserContext = createContext<UserContextType | null>(null);

// Provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sign up function
  const signUp = async (data: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      // Create request body with all possible fields
      const requestBody = {
        email: data.email || '',
        zodiacSign: data.zodiacSign || 'aries',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        phone: data.phone || '',
        birthdate: data.birthdate || '',
        password: data.password || '',
        smsOptIn: data.smsOptIn === true,
        newsletterOptIn: data.newsletterOptIn !== false
      };
      
      // Log for debugging
      console.log('Submitting signup request:', requestBody);
      
      // Send request to API
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const result = await response.json();
      console.log('Signup response:', result);
      
      if (response.ok && result.success) {
        // Update user state on success with all fields
        const newUser: User = {
          email: requestBody.email,
          zodiacSign: requestBody.zodiacSign as ZodiacSign,
          firstName: requestBody.firstName,
          lastName: requestBody.lastName,
          phone: requestBody.phone,
          birthdate: requestBody.birthdate,
          password: requestBody.password,
          smsOptIn: requestBody.smsOptIn,
          newsletterOptIn: requestBody.newsletterOptIn,
          isAuthenticated: true
        };
        
        setUser(newUser);
        return { success: true, message: result.message || 'Sign up successful!' };
      } else {
        return { 
          success: false, 
          message: result.message || 'Sign up failed. Please try again.' 
        };
      }
    } catch (error) {
      console.error('Error during signup:', error);
      return { 
        success: false, 
        message: 'An unexpected error occurred. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
  };

  // Create context value
  const contextValue: UserContextType = {
    user,
    setUser,
    signUp,
    logout,
    isLoading
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the context
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}