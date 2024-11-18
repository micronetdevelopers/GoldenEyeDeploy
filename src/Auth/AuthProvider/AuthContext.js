// UserContext.js
import React, { createContext, useEffect, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [userName, setUsername] = useState(null);
    const [access, setAccess] = useState(null);



    const [user, setUser] = useState(() => {
        // Load user from localStorage if available
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };



    useEffect(() => {
        const tokenData = JSON.parse(localStorage.getItem("user"))
        if (tokenData) {
            setUsername(tokenData.user);
            setAccess(tokenData.access);
        }
    }, [userName, access, user]);




    return (
        <UserContext.Provider value={{ user, login, logout, userName, access }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
