import React, { createContext, useContext, useState, useEffect } from "react";
import { db, auth, googleProvider } from "../config/firebase";
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence
} from "firebase/auth";
import { collection, query, where, getDocs, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

// Create Authentication Context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuth, setIsAuth] = useState(false);
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    // Function to fetch user role from Firestore based on email
    const fetchUserRoleByEmail = async (email) => {
        try {
            const usersRef = collection(db, "Users");
            const q = query(usersRef, where("userEmail", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const userData = querySnapshot.docs[0].data();
                setRole(userData.role);
                redirectUser(userData.role);
                return true; // User already exists
            }
            return false; // User does not exist
        } catch (error) {
            console.error("Error fetching user role:", error);
        }
    };

    // Function to save user details in Firestore if new
    const saveUserToFirestore = async (user) => {
        try {
            const userExists = await fetchUserRoleByEmail(user.email);

            if (!userExists) {
                const userRef = doc(db, "Users", user.uid);
                await setDoc(userRef, {
                    username: user.displayName,
                    userEmail: user.email,
                    enrolledCourses: [], // Initialize empty array
                    role: "student", // Default role
                });
                setRole("student"); // Set default role
                redirectUser("student"); // Redirect as a new student
            }
        } catch (error) {
            console.error("Error saving user:", error);
        }
    };

    // Monitor auth state on page load
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setIsAuth(true);
                await fetchUserRoleByEmail(currentUser.email);
            } else {
                setUser(null);
                setIsAuth(false);
                setRole(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Google Sign-In with 48-hour session
    const signInWithGoogle = async () => {
        try {
            // Set Firebase authentication persistence
            await setPersistence(auth, browserLocalPersistence);

            if (!isAuth) {
                const userCredential = await signInWithPopup(auth, googleProvider);
                const loggedInUser = userCredential.user;
                setUser(loggedInUser);
                setIsAuth(true);

                // Check if user exists & save if new
                await saveUserToFirestore(loggedInUser);
            }
        } catch (error) {
            console.error("Google Sign-in Error:", error.message);
            throw error;
        }
    };

    // Logout function
    const logoutUser = async () => {
        await signOut(auth);
        setIsAuth(false);
        setUser(null);
        setRole(null);
        navigate("/"); // Redirect to login after logout
    };

    // Redirect user based on role
    const redirectUser = (userRole) => {
        if (userRole === "admin") {
            navigate("/ghost");
        } else {
            navigate("/Home");
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuth, role, signInWithGoogle, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use Auth Context
export const useAuth = () => {
    return useContext(AuthContext);
};
