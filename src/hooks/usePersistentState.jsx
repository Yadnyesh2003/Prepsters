// src/hooks/usePersistentState.js
import { useState, useEffect } from 'react';

export const usePersistentState = (key, defaultValue) => {
    const [state, setState] = useState(() => {
        const storedValue = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
        return storedValue ? JSON.parse(storedValue) : defaultValue;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(state));
        }
    }, [key, state]);

    return [state, setState];
};