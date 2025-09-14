import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';

interface OptimizeTaskRequest {
  taskIds: number[];
}

interface OptimizeTaskResponse {
  message: string;
  newTask: null | {
    id: number;
    description: string;
    startDate: string;
    endDate: string;
  };
  deletedIds: number[];
}

interface OptimizeTaskState {
  loading: boolean;
  error: string | null;
  result: OptimizeTaskResponse | null;
}

const initialState: OptimizeTaskState = {
  loading: false,
  error: null,
  result: null,
};

export const optimizeTask = createAsyncThunk(
  'optimizeTask/optimize',
  async (payload: OptimizeTaskRequest, { rejectWithValue }) => {
    try {
  const response = await api.post('tasks/optimize', payload);
      return response.data as OptimizeTaskResponse;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Optimize işlemi başarısız');
    }
  }
);

const optimizeTaskSlice = createSlice({
  name: 'optimizeTask',
  initialState,
  reducers: {
    clearOptimizeResult: (state) => {
      state.result = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(optimizeTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(optimizeTask.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(optimizeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOptimizeResult } = optimizeTaskSlice.actions;
export default optimizeTaskSlice.reducer;