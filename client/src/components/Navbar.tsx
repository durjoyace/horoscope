import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { AuthModals } from './AuthModals';

export const Navbar: React.FC = () => {
  const { user, logout } = useUser();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  return (
    <>
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/">
                  <span className="text-2xl font-playfair font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-indigo-950 cursor-pointer">
                    HoroscopeHealth
                  </span>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user?.isAuthenticated ? (
                <>
                  <Link href="/dashboard">
                    <Button variant="link" className="text-indigo-900 hover:text-indigo-800">
                      My Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={logout}
                    className="text-indigo-900 hover:text-indigo-800"
                    variant="ghost"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="link"
                    className="text-indigo-900 hover:text-indigo-800"
                    onClick={() => setIsLoginModalOpen(true)}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => setIsSignupModalOpen(true)}
                    className="bg-gradient-to-r from-teal-600 to-teal-400 text-white font-semibold shadow hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModals
        isLoginOpen={isLoginModalOpen}
        isSignupOpen={isSignupModalOpen}
        onLoginClose={() => setIsLoginModalOpen(false)}
        onSignupClose={() => setIsSignupModalOpen(false)}
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
        onSwitchToLogin={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </>
  );
};
