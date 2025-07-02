// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check"
import { getAnalytics, logEvent, setUserId, setUserProperties } from "firebase/analytics";
import { getAuth, GoogleAuthProvider  } from "firebase/auth";

import { getFirestore, collection, addDoc, doc, setDoc, serverTimestamp, updateDoc, getDoc, getDocs, deleteDoc, query, where, orderBy, limit, arrayUnion, arrayRemove } from "firebase/firestore";

import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase

export const app = initializeApp(firebaseConfig);

const appCheck = initializeAppCheck(app,
    {
        provider: new
        ReCaptchaV3Provider(import.meta.env.VITE_RECAPTCHA_V3_SITE_KEY),
        isTokenAutoRefreshEnabled: true //Optional, but recommended
    }
)

const analytics = getAnalytics(app);
export const auth = getAuth(app);
// export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const googleProvider = new GoogleAuthProvider();

const db= getFirestore(app);
export { db, collection, addDoc, doc, setDoc, serverTimestamp, updateDoc, getDoc, getDocs, deleteDoc, query, orderBy, limit, where, arrayUnion, arrayRemove, logEvent, analytics, setUserId, setUserProperties }; 

