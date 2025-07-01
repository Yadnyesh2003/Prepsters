// context/UserContext.js
import { createContext, useContext } from 'react';
import { useUserSync } from '../hooks/useUserSync';

const UserContext = createContext();

export function UserProvider({ children }) {
    const { currentUser, loading } = useUserSync();

    return (
        <UserContext.Provider value={{ currentUser, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}