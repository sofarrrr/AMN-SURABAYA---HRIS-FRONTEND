import { useContext } from 'react';
import { AuthContext } from '../data/AuthContext';

export const useAuth = () => useContext(AuthContext);
