import React, { createContext, useContext, useState } from 'react';

const GuestContext = createContext();

export const GuestProvider = ({ children }) => {
    const [isGuest, setIsGuest] = useState(false);
    const [guestMode, setGuestMode] = useState('demo'); // 'demo' or 'full'

    return (
        <GuestContext.Provider value={{ isGuest, setIsGuest, guestMode, setGuestMode }}>
            {children}
        </GuestContext.Provider>
    );
};

export const useGuest = () => useContext(GuestContext);