import React, { createContext, useContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('jwt'));

  // Save user to MongoDB after Firebase authentication
  const saveUserToMongo = async (user) => {
    try {
      const response = await fetch('http://localhost:8080/api/users?action=register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: user.email,
          password: user.uid  // Using Firebase UID as password
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setToken(data.token);
        }
      }
    } catch (error) {
      console.error("Error saving user to MongoDB:", error);
    }
  };

  const verifyToken = async (token) => {
    try {
      const response = await fetch('http://localhost:8080/api/users/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  // Google login
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      await saveUserToMongo(result.user);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Email registration
  const registerWithEmail = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      await saveUserToMongo(result.user);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // Email login
  const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      
      // Authenticate with backend
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password: result.user.uid
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('jwt', data.token);
          setToken(data.token);
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('jwt');
    setToken(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const token = localStorage.getItem('jwt');
        if (token) {
          const isValid = await verifyToken(token);
          if (!isValid) {
            // If token is invalid, try to get a new one
            await saveUserToMongo(currentUser);
          }
        } else {
          // If no token exists, get one
          await saveUserToMongo(currentUser);
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('jwt');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        signInWithGoogle,
        registerWithEmail,
        signInWithEmail,
        logout,
        isAuthenticated: !!user && !!token,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;