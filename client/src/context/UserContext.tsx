import React, { createContext, useContext, useState, useEffect } from 'react';
import { ZodiacSign } from '@shared/types';

interface User {
  email: string;
  zodiacSign?: ZodiacSign;
  firstName?: string;
  lastName?: string;
  phone?: string;
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
  smsOptIn: false,
  newsletterOptIn: true,
  isAuthenticated: false
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
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
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          zodiacSign: data.zodiacSign,
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          smsOptIn: data.smsOptIn || false,
          birthdate: data.birthdate,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setUser({
          ...defaultUser,
          ...data,
          isAuthenticated: true,
        });
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error('Error during signup:', error);
      return { success: false, message: 'An error occurred during signup. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, signUp, logout, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
