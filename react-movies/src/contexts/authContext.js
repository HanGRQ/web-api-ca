import React, { createContext, useContext, useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
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
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  // MongoDB Email 注册
  const registerWithEmail = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          username: email.split('@')[0],
          favorites: [] // 明确传递 favorites 字段，默认为空数组
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Registration failed');
      }
  
      const data = await response.json();
      if (data.token) {
        const tokenWithBearer = data.token.startsWith('Bearer ') 
          ? data.token 
          : `Bearer ${data.token}`;
        localStorage.setItem('jwt', tokenWithBearer);
        setToken(tokenWithBearer);
        setUserData(data.user);
        setUser(data.user); // 设置用户数据
      }
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message);
      throw error;
    }
  };
  

  // MongoDB Email 登录
  const signInWithEmail = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Login failed');
      }

      const data = await response.json();
      if (data.token) {
        const tokenWithBearer = data.token.startsWith('Bearer ') 
          ? data.token 
          : `Bearer ${data.token}`;
        localStorage.setItem('jwt', tokenWithBearer);
        setToken(tokenWithBearer);
        setUserData(data.user);
        setUser(data.user); // 设置用户数据
      }
      return data;
    } catch (error) {
      console.error("Login error:", error);
      setError(error.message);
      throw error;
    }
  };

  // Google 登录保持不变
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      
      // 保存 Google 用户到 MongoDB
      const mongoResponse = await fetch('http://localhost:8080/api/users/google-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: result.user.email,
          googleId: result.user.uid,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL
        })
      });

      if (!mongoResponse.ok) {
        throw new Error('Failed to sync with MongoDB');
      }

      const mongoData = await mongoResponse.json();
      if (mongoData.token) {
        const tokenWithBearer = mongoData.token.startsWith('Bearer ') 
          ? mongoData.token 
          : `Bearer ${mongoData.token}`;
        localStorage.setItem('jwt', tokenWithBearer);
        setToken(tokenWithBearer);
        setUserData(mongoData.user);
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError(error.message);
    }
  };

  // 统一的登出函数
  const logout = async () => {
    try {
      // 如果是 Google 登录，需要登出 Firebase
      if (user?.providerData?.[0]?.providerId === 'google.com') {
        await signOut(auth);
      }
      // 清除本地状态
      localStorage.removeItem('jwt');
      setToken(null);
      setUser(null);
      setUserData(null);
      setError(null);
    } catch (error) {
      console.error("Logout error:", error);
      setError(error.message);
    }
  };

  // 获取用户数据
  const fetchUserData = async () => {
    try {
      const currentToken = localStorage.getItem('jwt');
      if (!currentToken) return;

      const response = await fetch('http://localhost:8080/api/users/me', {
        headers: {
          'Authorization': currentToken,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
        setUser(data.user);
      } else {
        localStorage.removeItem('jwt');
        setToken(null);
        setUserData(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && firebaseUser.providerData[0].providerId === 'google.com') {
        setUser(firebaseUser);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUserData();
    }
  }, [token]);

  const value = {
    user,
    userData,
    token,
    error,
    loading,
    signInWithGoogle,
    registerWithEmail,
    signInWithEmail,
    logout,
    isAuthenticated: !!user && !!token,
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;