// hooks/useUserSync.js
import { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// Default expiry time: 1 hour (in milliseconds)
const DEFAULT_EXPIRY_TIME = 60 * 60 * 1000;

export function useUserSync(expiryTime = DEFAULT_EXPIRY_TIME) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [forceRefresh, setForceRefresh] = useState(false);

    // Function to check if data is expired
    const isDataExpired = (lastSyncTime) => {
        if (!lastSyncTime) return true;
        const lastSync = new Date(lastSyncTime);
        const now = new Date();
        return (now - lastSync) > expiryTime;
    };

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in
                const userDocRef = doc(db, 'Users', user.uid);
                const lastSyncTime = localStorage.getItem('lastUserSync');

                // Check if we need to force refresh
                const shouldForceRefresh = forceRefresh || isDataExpired(lastSyncTime);

                // Set up real-time listener for user document
                const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
                    if (doc.exists()) {
                        const userData = { uid: user.uid, ...doc.data() };
                        setCurrentUser(userData);

                        // Save to localStorage
                        localStorage.setItem('currentUser', JSON.stringify(userData));
                        localStorage.setItem('lastUserSync', new Date().toISOString());

                        // Reset force refresh flag if it was set
                        if (forceRefresh) setForceRefresh(false);
                    }
                },
                    (error) => {
                        console.error("Error fetching user data:", error);
                        setLoading(false);
                    });

                return () => unsubscribeUser();
            } else {
                // User is signed out
                setCurrentUser(null);
                localStorage.removeItem('currentUser');
                localStorage.removeItem('lastUserSync');
            }
            setLoading(false);
        });

        // Check for cached user data on initial load
        const cachedUser = localStorage.getItem('currentUser');
        const lastSyncTime = localStorage.getItem('lastUserSync');

        if (cachedUser && !currentUser && !isDataExpired(lastSyncTime)) {
            setCurrentUser(JSON.parse(cachedUser));
        }

        return () => unsubscribeAuth();
    }, [forceRefresh, expiryTime]);

    // Function to manually trigger refresh
    const triggerRefresh = () => {
        setForceRefresh(true);
    };

    return { currentUser, loading, triggerRefresh };
}