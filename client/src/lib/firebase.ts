import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult,
  onAuthStateChanged,
  signOut
} from "firebase/auth";

// Firebase configuration from the provided screenshot
const firebaseConfig = {
  apiKey: "AIzaSyA8mLPuC2kK8bXysJlqMWBXxud-vpKGCTO",
  authDomain: "horoscopehealth-web.firebaseapp.com", 
  projectId: "horoscopehealth-web",
  storageBucket: "horoscopehealth-web.firebasestorage.app",
  messagingSenderId: "14982980321",
  appId: "1:14982980321:web:ece6ee4cc98a00f26dc826",
  measurementId: "G-QF5K6VY1RW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Force account selection
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Google sign in using popup
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Google sign in using redirect (better for mobile)
export const signInWithGoogleRedirect = () => {
  signInWithRedirect(auth, googleProvider);
};

// Handle redirect result
export const handleGoogleRedirect = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Error handling Google redirect:", error);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Export auth and app for use in other files
export { auth, app };