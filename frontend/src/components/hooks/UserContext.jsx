import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const refreshUser = async () => {
        const res = await api.get('/profile');
        setUser(res.data.data);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await refreshUser();
            } catch (error) {
                console.error("Error al cargar usuario:", error);
            }
        };

        fetchData();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => useContext(UserContext);