import {  useCallback,
  useMemo,
  useState,
} from 'react';
import { createContext } from 'react';

import { useData } from '../hooks/useData';
export const AuthContext = createContext<any>(null);


/** Menyediakan status autentikasi berdasarkan daftar akun di DataContext. */
export function AuthProvider({ children }) {
  const { users } = useData();
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('amn-user'));
    } catch {
      return null;
    }
  });

  /** Menyimpan perubahan profil aktif ke state dan sesi browser. */
  const saveUser = useCallback((nextUser) => {
    setUser(nextUser);
    sessionStorage.setItem('amn-user', JSON.stringify(nextUser));
  }, []);

  /** Memeriksa kredensial dan status akun dari daftar pengguna bersama. */
  const login = useCallback((email, password) => {
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find(
      (item) =>
        item.email.toLowerCase() === normalizedEmail &&
        item.password === password &&
        item.status !== 'Non Aktif'
    );

    if (!found) return false;

    setUser(found);
    sessionStorage.setItem('amn-user', JSON.stringify(found));

    return found;
  }, [users]);

  /** Mengakhiri sesi pengguna saat ini. */
  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem('amn-user');
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, setUser: saveUser }),
    [user, login, logout, saveUser]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
