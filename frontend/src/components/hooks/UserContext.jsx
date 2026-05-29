import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../api';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const refreshUser = async () => {
        if (!localStorage.getItem('token')) return;

        try {
            const res = await api.get('/profile');
            setUser(res.data.data);
        } catch (error) {
            if (error.response?.status !== 401) {
                console.error("Error al cargar usuario:", error);
            }
        }
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