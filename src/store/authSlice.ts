import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import axios from 'axios';

interface AuthState {
  user: null | { email: string; nickname?: string; avatarUrl?: string };
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const register = createAsyncThunk(
  'auth/register',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data?.message || 'Kayıt başarısız');
      }
      return rejectWithValue('Kayıt başarısız');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data?.message || 'Giriş başarısız');
      }
      return rejectWithValue('Giriş başarısız');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        // API returns { accessToken, email, nickname, avatarUrl }
        state.user = action.payload.email
          ? {
              email: action.payload.email,
              nickname: action.payload.nickname,
              avatarUrl: action.payload.avatarUrl,
            }
          : null;
        state.token = action.payload.accessToken || null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
        .addCase(login.fulfilled, (state, action) => {
          state.loading = false;
          // API returns { accessToken, email, nickname, avatarUrl }
          state.user = action.payload.email
            ? {
                email: action.payload.email,
                nickname: action.payload.nickname,
                avatarUrl: action.payload.avatarUrl,
              }
            : null;
          state.token = action.payload.accessToken || null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
