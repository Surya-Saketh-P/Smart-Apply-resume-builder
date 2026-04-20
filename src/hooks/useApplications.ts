import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export interface Application {
  id: string;
  company: string;
  role: string;
  jobDescription: string;
  matchScore: number;
  matchReason: string;
  coverLetter: string;
  resumeBullets: string[];
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  createdAt: Timestamp;
}

export const useApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>(null as any);
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
      })) as Application[];
      setApplications(apps);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching applications:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const addApplication = async (data: Omit<Application, 'id' | 'createdAt'>) => {
    if (!user) return;
    const colRef = collection(db, 'users', user.uid, 'applications');
    await addDoc(colRef, {
      ...data,
      createdAt: serverTimestamp()
    });
  };

  const deleteApplication = async (id: string) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'applications', id);
    await deleteDoc(docRef);
  };

  const updateStatus = async (id: string, status: Application['status']) => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid, 'applications', id);
    await updateDoc(docRef, { status });
  };

  return { applications, loading, addApplication, deleteApplication, updateStatus };
};
