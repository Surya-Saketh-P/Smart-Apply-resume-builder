import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
export const useApplications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!user) {
            setApplications([]);
            setLoading(false);
            return;
        }
        const colRef = collection(db, 'users', user.uid, 'applications');
        const q = query(colRef, orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const apps = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setApplications(apps);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching applications:", error);
            setLoading(false);
        });
        return unsubscribe;
    }, [user]);
    const addApplication = async (data) => {
        if (!user)
            return;
        const colRef = collection(db, 'users', user.uid, 'applications');
        await addDoc(colRef, {
            ...data,
            createdAt: serverTimestamp()
        });
    };
    const deleteApplication = async (id) => {
        if (!user)
            return;
        const docRef = doc(db, 'users', user.uid, 'applications', id);
        await deleteDoc(docRef);
    };
    const updateStatus = async (id, status) => {
        if (!user)
            return;
        const docRef = doc(db, 'users', user.uid, 'applications', id);
        await updateDoc(docRef, { status });
    };
    return { applications, loading, addApplication, deleteApplication, updateStatus };
};
