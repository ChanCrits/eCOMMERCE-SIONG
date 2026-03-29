'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { auth, db, OperationType, handleFirestoreError } from '@/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'buyer' | 'seller' | 'admin';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (role?: 'buyer' | 'seller') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      // Cleanup previous profile listener if any
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }

      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Listen for profile changes
        unsubProfile = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            setProfile(null);
          }
          setLoading(false);
        }, (error) => {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
    };
  }, []);

  const login = async (role: 'buyer' | 'seller' = 'buyer') => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if profile exists, if not create one
      const userDocRef = doc(db, 'users', user.uid);
      
      let docSnap;
      try {
        docSnap = await getDoc(userDocRef);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
        throw error;
      }
      
      if (!docSnap.exists()) {
        const newProfile: UserProfile = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'User',
          role: role,
          createdAt: new Date().toISOString(),
        };
        try {
          await setDoc(userDocRef, newProfile);
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}`);
          throw error;
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
