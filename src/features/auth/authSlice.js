import { createSlice } from "@reduxjs/toolkit";

// Load user from localStorage on initial boot if available
const savedUser = localStorage.getItem("user");
const parsedUser = savedUser ? JSON.parse(savedUser) : null;

const initialState = {
    user: parsedUser,
    isAuthenticated: !!parsedUser,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            const payload = action.payload || {};
            
            // Standardize user properties to ensure customerId is preserved
            const userToStore = {
                ...payload,
                id: payload.userId || payload.id,
                customerId: payload.customerId || payload.customer_id || (payload.roleId === 1 ? payload.userId || payload.id : null),
                expertId: payload.expertId || payload.expert_id || (payload.roleId === 2 ? payload.userId || payload.id : null),
                name: payload.name || `${payload.firstName || ''} ${payload.lastName || ''}`.trim() || 'User',
                role: payload.role || (payload.roleId === 2 ? 'Expert' : 'Customer')
            };

            state.user = userToStore;
            state.isAuthenticated = true;

            // Save complete user object to localStorage
            localStorage.setItem("user", JSON.stringify(userToStore));
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        }
    }
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;