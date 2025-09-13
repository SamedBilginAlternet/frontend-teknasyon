import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import axios from 'axios';

interface AuthState {
  user: null | { 
    email: string; 
    nickname: string; 
    avatarUrl: string;
    avatarBase64?: string;
    avatarMimeType?: string;
  };
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

// Load initial state from localStorage
const loadAuthFromStorage = () => {
  try {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    
    return {
      user,
      token,
      refreshToken,
      loading: false,
      error: null,
    };
  } catch (error) {
    console.error('Error loading auth from localStorage:', error);
    return {
      user: null,
      token: null,
      refreshToken: null,
      loading: false,
      error: null,
    };
  }
};

const initialState: AuthState = loadAuthFromStorage();

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
      state.refreshToken = null;
      state.error = null;
      // Clear localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
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
        // API returns { accessToken, refreshToken, email, nickname, avatarUrl, avatarBase64, avatarMimeType }
        const fullAvatarUrl = action.payload.avatarUrl 
          ? `http://192.168.20.43:8083${action.payload.avatarUrl}`
          : '';
        
        state.user = action.payload.email
          ? {
              email: action.payload.email,
              nickname: action.payload.nickname || '',
              avatarUrl: fullAvatarUrl,
              avatarBase64: action.payload.avatarBase64,
              avatarMimeType: action.payload.avatarMimeType,
            }
          : null;
        state.token = action.payload.accessToken || null;
        state.refreshToken = action.payload.refreshToken || null;
        
        // Save to localStorage
        if (action.payload.accessToken) {
          localStorage.setItem('accessToken', action.payload.accessToken);
        }
        if (action.payload.refreshToken) {
          localStorage.setItem('refreshToken', action.payload.refreshToken);
        }
        if (state.user) {
          localStorage.setItem('user', JSON.stringify(state.user));
        }
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
          // API returns { accessToken, refreshToken, email, nickname, avatarUrl, avatarBase64, avatarMimeType }
          const fullAvatarUrl = action.payload.avatarUrl 
            ? `http://192.168.20.43:8083${action.payload.avatarUrl}`
            : '';
          
          state.user = action.payload.email
            ? {
                email: action.payload.email,
                nickname: action.payload.nickname || '',
                avatarUrl: fullAvatarUrl,
                avatarBase64: action.payload.avatarBase64,
                avatarMimeType: action.payload.avatarMimeType,
              }
            : null;
          state.token = action.payload.accessToken || null;
          state.refreshToken = action.payload.refreshToken || null;
          
          // Save to localStorage
          if (action.payload.accessToken) {
            localStorage.setItem('accessToken', action.payload.accessToken);
          }
          if (action.payload.refreshToken) {
            localStorage.setItem('refreshToken', action.payload.refreshToken);
          }
          if (state.user) {
            localStorage.setItem('user', JSON.stringify(state.user));
          }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
