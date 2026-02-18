import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { TOKEN_STORAGE_KEY, fetchMe, login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const persistToken = (t) => {
        setToken(t);
        if (t) localStorage.setItem(TOKEN_STORAGE_KEY, t);
        else localStorage.removeItem(TOKEN_STORAGE_KEY);
    };

    const refreshMe = async () => {
        if (!localStorage.getItem(TOKEN_STORAGE_KEY)) {
            setUser(null);
            return null;
        }
        const me = await fetchMe();
        setUser(me);
        return me;
    };

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                if (token) {
                    const me = await fetchMe();
                    if (!cancelled) setUser(me);
                } else {
                    if (!cancelled) setUser(null);
                }
            } catch {
                // Token invalid/expired
                if (!cancelled) {
                    persistToken(null);
                    setUser(null);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = async (email, password) => {
        const { token: newToken } = await apiLogin(email, password);
        persistToken(newToken);
        return await refreshMe();
    };

    const register = async (email, password, firstName, lastName) => {
        const { token: newToken } = await apiRegister(email, password, firstName, lastName);
        persistToken(newToken);
        return await refreshMe();
    };

    const logout = () => {
        persistToken(null);
        setUser(null);
    };

    const value = useMemo(() => ({
        user,
        token,
        isAuthenticated: Boolean(user),
        loading,
        login,
        register,
        logout,
        refreshMe
    }), [user, token, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
    return ctx;
}

