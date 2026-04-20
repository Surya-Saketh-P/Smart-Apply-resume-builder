import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export interface UserProfile {
  name: string;
  email: string;
  skills: string[];
  experience: string;
  education: string;
  linkedin?: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'users', user.uid, 'profile', 'data');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error fetching profile:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const updateProfile = async (data: UserProfile) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'profile', 'data');
    await setDoc(docRef, data);
  };

  return { profile, loading, updateProfile };
};
