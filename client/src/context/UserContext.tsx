import React, { createContext, useContext, useState, useEffect } from 'react';
import { ZodiacSign } from '@shared/types';

interface User {
  email: string;
  zodiacSign?: ZodiacSign;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthdate?: string;
  password?: string;
  smsOptIn: boolean;
  newsletterOptIn: boolean;
  isAuthenticated: boolean;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  signUp: (data: Partial<User>) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  isLoading: boolean;
}

const defaultUser: User = {
  email: '',
  zodiacSign: undefined,
  firstName: '',
  lastName: '',
  phone: '',
  birthdate: '',
  password: '',
  smsOptIn: false,
  newsletterOptIn: true,
  isAuthenticated: false
};

// Create default context values to avoid the "undefined" error
const defaultContextValue: UserContextType = {
  user: null,
  setUser: () => null,
  signUp: async () => ({ success: false, message: 'User context not initialized' }),
  logout: () => {},
  isLoading: false,
};

const UserContext = createContext<UserContextType>(defaultContextValue);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on initial load
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error('Error parsing saved user:', error);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // Sign up function
  const signUp = async (data: Partial<User>): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      console.log('Attempting signup with data:', {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        zodiacSign: data.zodiacSign,
        birthdate: data.birthdate,
        smsOptIn: data.smsOptIn,
      });
      
      const requestBody = {
        email: data.email,
        zodiacSign: data.zodiacSign,
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phone: data.phone || "",
        smsOptIn: data.smsOptIn || false,
        birthdate: data.birthdate || "",
        password: data.password || null,
        newsletterOptIn: data.newsletterOptIn || true
      };
      
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Signup result:', result);

      if (result.success) {
        const newUser = {
          ...defaultUser,
          ...data,
          isAuthenticated: true,
        };
        
        setUser(newUser);
        return { success: true, message: result.message };
      } else {
        console.error('Signup failed:', result.message);
        return { success: false, message: result.message || 'Signup failed. Please try again.' };
      }
    } catch (error) {
      console.error('Error during signup:', error);
      return { 
        success: false, 
        message: error instanceof Error 
          ? `Signup error: ${error.message}` 
          : 'An unexpected error occurred. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

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

// Custom hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  return context;
};
