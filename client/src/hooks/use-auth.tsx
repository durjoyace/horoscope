import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { ZodiacSign } from "@shared/types";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { signInWithGoogle, signOutUser } from "@/lib/firebase";

type User = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  zodiacSign: ZodiacSign;
  isPremium: boolean;
  isAdmin: boolean;
  photoUrl?: string | null;
};

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  zodiacSign: ZodiacSign;
};

type GoogleAuthData = {
  email: string;
  uid: string;
  displayName?: string;
  photoURL?: string;
  zodiacSign?: ZodiacSign;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  googleAuthMutation: UseMutationResult<User, Error, GoogleAuthData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
  loginWithGoogle: (zodiacSign?: ZodiacSign) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [zodiacSignForGoogle, setZodiacSignForGoogle] = useState<ZodiacSign | undefined>();

  const {
    data: userData,
    error,
    isLoading,
  } = useQuery<{ success: boolean; user: User } | null>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/user", {
          credentials: "include"
        });
        
        if (res.status === 401) {
          return null;
        }
        
        if (!res.ok) {
          throw new Error("Failed to fetch user data");
        }
        
        return await res.json();
      } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
      }
    },
    retry: false,
    staleTime: 300000, // 5 minutes
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include"
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }
      
      const data = await res.json();
      return data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const googleAuthMutation = useMutation({
    mutationFn: async (googleData: GoogleAuthData) => {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(googleData),
        credentials: "include"
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Google authentication failed");
      }
      
      const data = await res.json();
      return data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Google authentication successful",
        description: "You have been signed in with Google!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Google authentication failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterData) => {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
        credentials: "include"
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }
      
      const data = await res.json();
      return data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // First, sign out from Firebase if used
      try {
        await signOutUser();
      } catch (err) {
        console.error("Error signing out from Firebase:", err);
      }
      
      // Then sign out from our server session
      const res = await fetch("/api/logout", {
        method: "POST",
        credentials: "include"
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Logout failed");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      queryClient.invalidateQueries();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Function to handle Google sign-in
  const loginWithGoogle = async (zodiacSign?: ZodiacSign) => {
    try {
      // Store zodiac sign for use in Google auth flow
      if (zodiacSign) {
        setZodiacSignForGoogle(zodiacSign);
      }
      
      // Sign in with Google via Firebase
      const googleUser = await signInWithGoogle();
      
      if (!googleUser) {
        throw new Error("Google sign in failed");
      }
      
      // Send Google user data to our server
      googleAuthMutation.mutate({
        email: googleUser.email!,
        uid: googleUser.uid,
        displayName: googleUser.displayName || undefined,
        photoURL: googleUser.photoURL || undefined,
        zodiacSign: zodiacSign || zodiacSignForGoogle,
      });
      
    } catch (error) {
      console.error("Error signing in with Google:", error);
      toast({
        title: "Google sign in failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: userData?.user ?? null,
        isLoading,
        error,
        loginMutation,
        googleAuthMutation,
        logoutMutation,
        registerMutation,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}