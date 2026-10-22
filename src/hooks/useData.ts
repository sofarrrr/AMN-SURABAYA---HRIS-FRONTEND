import { useContext } from 'react';
import { DataContext } from '../data/DataContext';

export const useData = () => useContext(DataContext);
