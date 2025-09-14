/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';

export interface RecentNote {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailySummaryState {
  date: string;
  reignPercent: number;
  productivityScore: number;
  tasksDone: number;
  focusTimeHours: number;
  deadlines: number;
  yesterdaysVictory: string;
  todaysFocus: string;
  aiRecommendations: string[];
  recentNotes: RecentNote[];
  loading: boolean;
  error: string | null;
}

const initialState: DailySummaryState = {
  date: '',
  reignPercent: 0,
  productivityScore: 0,
  tasksDone: 0,
  focusTimeHours: 0,
  deadlines: 0,
  yesterdaysVictory: '',
  todaysFocus: '',
  aiRecommendations: [],
  recentNotes: [],
  loading: false,
  error: null,
};

export const fetchDailySummary = createAsyncThunk(
  'dailySummary/fetchDailySummary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/summary/daily');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Günlük özet alınamadı');
    }
  }
);

const dailySummarySlice = createSlice({
  name: 'dailySummary',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchDailySummary.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailySummary.fulfilled, (state, action) => {
        return { ...state, ...action.payload, loading: false, error: null };
      })
      .addCase(fetchDailySummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default dailySummarySlice.reducer;
