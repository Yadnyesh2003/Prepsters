import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1200);

        return () => clearTimeout(timer);
    }, []);

    return (
        <ThemeContext.Provider value={{ loading }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
