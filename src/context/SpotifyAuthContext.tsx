import React, { createContext, useState, useContext } from 'react';


// Define the context type
interface SpotifyAuthContextType {
    accessToken: string | null;
    setAccessToken: (token: string) => void;
}


// Create the context with default values
const SpotifyAuthContext = createContext<SpotifyAuthContextType | undefined>(undefined);

// Context provider component
export const SpotifyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
  
    return (
      <SpotifyAuthContext.Provider value={{ accessToken, setAccessToken }}>
        {children}
      </SpotifyAuthContext.Provider>
    );
};


// Custom hook to use the SpotifyAuthContext
export const useSpotifyAuth = () => {
    const context = useContext(SpotifyAuthContext);
    if (!context) {
      throw new Error('useSpotifyAuth must be used within a SpotifyAuthProvider');
    }
    return context;
};
