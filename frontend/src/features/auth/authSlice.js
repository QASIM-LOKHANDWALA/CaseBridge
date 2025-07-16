import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://localhost:8000/user/login/",
                userData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 200) {
                const { token, user } = response.data;
                localStorage.setItem("token", token);
                return { user, token };
            }

            return rejectWithValue(
                error.response.data.error ||
                    error.response.data.message ||
                    "Login failed"
            );
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(
                    error.response.data.error ||
                        error.response.data.message ||
                        "Server error"
                );
            }
            return rejectWithValue(error.message || "Network error");
        }
    }
);

const signUpUser = createAsyncThunk(
    "auth/signUpUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://localhost:8000/user/signup/",
                userData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.status === 201) {
                const { user, token } = response.data;
                localStorage.setItem("token", token);
                return { user, token };
            }

            return rejectWithValue(
                error.response.data.error ||
                    error.response.data.message ||
                    "Sign up failed"
            );
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(
                    error.response.data.error ||
                        error.response.data.message ||
                        "Server error"
                );
            }
            return rejectWithValue(error.message || "Network error");
        }
    }
);

const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;

            const response = await fetch("http://127.0.0.1:8000/user/logout/", {
                method: "POST",
                headers: {
                    Authorization: `Token ${token}`,
                },
            });
            if (response.ok) {
                localStorage.removeItem("token");
                return { message: "Sign out successfully" };
            }
            return rejectWithValue(
                error.response.data.error ||
                    error.response.data.message ||
                    "Sign out failed"
            );
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(
                    error.response.data.error ||
                        error.response.data.message ||
                        "Server error"
                );
            }
            return rejectWithValue(error.message || "Network error");
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        token: localStorage.getItem("token") || null,
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                state.error = action.payload || "Login failed";
            })

            .addCase(signUpUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(signUpUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(signUpUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Sign up failed";
            })

            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                console.log("Signout fulfilled");
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {} = authSlice.actions;

export default authSlice.reducer;

export { loginUser, signUpUser, logoutUser };
