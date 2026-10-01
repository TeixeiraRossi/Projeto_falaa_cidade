import { auth } from "@/firebase-config";
import {
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
export type AuthState = {
  isLogin: boolean;
  isReady: boolean;
  user: User | null;
  signOut: () => void;
};
export const AuthContext = createContext<AuthState>({} as AuthState);
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsReady(true);
    });
    return unsubscribe;
  }, []);
  function signOut() {
    firebaseSignOut(auth);
  }
  return (
    <AuthContext.Provider value={{ isLogin: !!user, isReady, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
