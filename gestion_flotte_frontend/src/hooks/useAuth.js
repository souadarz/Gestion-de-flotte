import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect } from "react";
import { login, logout, getUserConnected, setInitialized} from "../features/authSlice.js";

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error, token, isInitialized} =
    useSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isInitialized) {
      dispatch(getUserConnected());
    }

    if (!token && !isInitialized) {
      dispatch(setInitialized());
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
