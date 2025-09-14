/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';

interface ActWithPhotoResponse {
  id: string | number;
  message: string;
  type?: string;
  tasks?: Array<{
    id: number;
    description: string;
    startDate: string;
    endDate: string;
  }>;
}

interface ActWithPhotoState {
  loading: boolean;
  error: string | null;
  result: ActWithPhotoResponse | null;
}

const initialState: ActWithPhotoState = {
  loading: false,
  error: null,
  result: null,
};

export const actWithPhoto = createAsyncThunk(
  'actWithPhoto/actWithPhoto',
  async (photo: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('photo', photo);
      const response = await api.post('prompt/actWithPhoto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data as ActWithPhotoResponse;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data?.message || 'Fotoğraf ile işlem başarısız');
    }
  }
);

const actWithPhotoSlice = createSlice({
  name: 'actWithPhoto',
  initialState,
  reducers: {
    clearActWithPhotoResult: (state) => {
      state.result = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actWithPhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actWithPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.result = action.payload;
      })
      .addCase(actWithPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearActWithPhotoResult } = actWithPhotoSlice.actions;
export default actWithPhotoSlice.reducer;
