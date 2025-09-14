/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';

export type TaskStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE';

export interface UpdateTaskStatusPayload {
  id: number;
  status: TaskStatus;
}

export interface UpdateTaskStatusState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: UpdateTaskStatusState = {
  loading: false,
  error: null,
  success: false,
};

export const updateTaskStatus = createAsyncThunk(
  'taskStatus/updateTaskStatus',
  async ({ id, status }: UpdateTaskStatusPayload, { rejectWithValue }) => {
    try {
      const response = await api.patch(`tasks/${id}/status`, { status });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Görev durumu güncellenemedi');
    }
  }
);

const updateTaskStatusSlice = createSlice({
  name: 'updateTaskStatus',
  initialState,
  reducers: {
    resetTaskStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(updateTaskStatus.pending, state => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateTaskStatus.fulfilled, state => {
        state.loading = false;
        state.error = null;
        state.success = true;
      })
      .addCase(updateTaskStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetTaskStatus } = updateTaskStatusSlice.actions;
export default updateTaskStatusSlice.reducer;
