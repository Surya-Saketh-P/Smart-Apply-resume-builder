import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
export const useProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
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
                setProfile(docSnap.data());
            }
            else {
                setProfile(null);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching profile:", error);
            setLoading(false);
        });
        return unsubscribe;
    }, [user]);
    const updateProfile = async (data) => {
        if (!user)
            return;
        const docRef = doc(db, 'users', user.uid, 'profile', 'data');
        await setDoc(docRef, data);
    };
    return { profile, loading, updateProfile };
};
