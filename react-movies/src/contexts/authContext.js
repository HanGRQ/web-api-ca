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

// 自定义钩子，返回 AuthContext 中的值
export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Google 登录
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      console.log("User signed in:", result.user);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // 邮箱和密码注册
  const registerWithEmail = async (email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      console.log("User registered:", result.user);
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // 邮箱和密码登录
  const signInWithEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
      console.log("User signed in:", result.user);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // 用户注销
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // 监听用户登录状态
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signInWithGoogle,
        registerWithEmail,
        signInWithEmail,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
