import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { IEmployee } from "@/types/models";

// Types
interface LoginCredentials {
  email: string;
  password: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: IEmployee['role'];
  position: string;
  employeeId: string;
  permissions: string[];
  skills: string[];
}

interface LoginResponse {
  data: {
    token: string;
    user: UserData;
  };
}

interface AuthState {
  token: string | null;
  user: UserData | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  token: typeof window !== 'undefined' ? localStorage.getItem("token") : null,
  user: null,
  isLoading: false,
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk<
  LoginResponse['data'],
  LoginCredentials,
  { rejectValue: string }
>(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<LoginResponse>("/api/login", credentials);
      const { token, user } = response.data.data;

      // Store token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("token", token);
      }

      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Login failed";
        return rejectWithValue(errorMessage);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<LoginResponse['data']>) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "An error occurred";
        state.token = null;
        state.user = null;
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
