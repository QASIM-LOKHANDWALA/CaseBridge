import { useDispatch, useSelector } from "react-redux";
import { loginUser, signUpUser, logoutUser } from "../features/auth/authSlice";

const useAuth = () => {
    const dispatch = useDispatch();

    const { user, token, isAuthenticated, loading, error } = useSelector(
        (state) => state.auth
    );

    const login = (credentials) => dispatch(loginUser(credentials)).unwrap();
    const signup = (data) => dispatch(signUpUser(data)).unwrap();
    const logout = () => dispatch(logoutUser()).unwrap();

    return {
        user,
        token,
        isAuthenticated,
        loading,
        error,
        login,
        signup,
        logout,
    };
};

export default useAuth;
