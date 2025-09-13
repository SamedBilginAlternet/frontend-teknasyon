import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import axios from 'axios';

interface PromptActState {
  type: string | null;
  message: string | null;
  id: number | null;
  loading: boolean;
  error: string | null;
}

interface PromptActRequest {
  prompt: string;
}

interface PromptActResponse {
  type: string;
  message: string;
  id: number;
  tasks?: Array<{
    id: number;
    description: string;
    startDate: string;
    endDate: string;
  }>;
}

const initialState: PromptActState = {
  type: null,
  message: null,
  id: null,
  loading: false,
  error: null,
};

export const actPrompt = createAsyncThunk(
  'promptAct/act',
  async (promptData: PromptActRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<PromptActResponse>('/prompt/act', promptData);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data?.message || 'Prompt action başarısız');
      }
      return rejectWithValue('Prompt action başarısız');
    }
  }
);

const promptActSlice = createSlice({
  name: 'promptAct',
  initialState,
  reducers: {
    clearPromptAct: (state) => {
      state.type = null;
      state.message = null;
      state.id = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(actPrompt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actPrompt.fulfilled, (state, action) => {
        state.loading = false;
        state.type = action.payload.type;
        state.message = action.payload.message;
        state.id = action.payload.id;
      })
      .addCase(actPrompt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPromptAct } = promptActSlice.actions;
export default promptActSlice.reducer;
