import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Hook personalizado para acceder al estado de autenticación
export const useAuth = () => {
    return useAppSelector((state) => state.auth);
};
