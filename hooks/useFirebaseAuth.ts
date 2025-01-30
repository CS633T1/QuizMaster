import { useState, useEffect } from "react";
import {
  type User,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase/config";

export function useFirebaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = (email: string, password: string) => {
    console.log("signup!", email, password);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email: string, password: string) => {
    console.log("signin!", email, password);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    console.log("logout!");
    return signOut(auth);
  };

  const resetPassword = (email: string) => {
    console.log("reset password!");
    return sendPasswordResetEmail(auth, email);
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    logOut,
    resetPassword,
  };
}
