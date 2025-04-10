import React, { createContext, useState, useContext } from 'react';
import { ZodiacSign } from '@shared/types';

// Basic user data interface
type User = {
  email: string;
  zodiacSign?: ZodiacSign;
};

// Context interface
type UserContextValue = {
  user: User | null;
  signUp: (data: { email: string; zodiacSign?: ZodiacSign }) => Promise<{ success: boolean; message: string }>;
};

// Create context
const UserContext = createContext<UserContextValue | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Simple signup function
  const signUp = async (data: { email: string; zodiacSign?: ZodiacSign }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          zodiacSign: data.zodiacSign || 'aries',
          smsOptIn: false,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setUser({
          email: data.email,
          zodiacSign: data.zodiacSign || 'aries',
        });
        return { success: true, message: result.message || 'Sign up successful!' };
      } else {
        return { success: false, message: result.message || 'Sign up failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'An error occurred during sign up' };
    }
  };

  return (
    <UserContext.Provider value={{ user, signUp }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the context
export function useUser() {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}