import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  login,
  logout,
  getUserConnected,
} from '../features/authSlice.js';

const useAuth = () => {
  const dispatch = useDispatch();

  // Sélecteurs
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const token = useSelector((state) => state.auth.token);
  const isInitialized = useSelector((state) => state.auth.isInitialized);

  
  useEffect(() => {
    if (!isInitialized) {
      dispatch(getUserConnected());
    }
  }, [dispatch, isInitialized]);

  // Login
  const loginUser = useCallback(
    async ({ email, motDePasse }) => {
      try {
        const result = await dispatch(login({ email, motDePasse })).unwrap();
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error };
      }
    },
    [dispatch]
  );

  // Logout
  const logoutUser = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: true };
    }
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    token,
    isInitialized,
    loginUser,
    logoutUser,
  };
};

export default useAuth;
