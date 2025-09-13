import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/axios';
import axios from 'axios';

interface PromptState {
  prompts: PromptItem[];
  currentPrompt: string;
  improvedPrompt: string | null;
  loading: boolean;
  error: string | null;
  history: PromptHistory[];
}

interface PromptItem {
  id: string;
  original: string;
  improved: string;
  timestamp: Date;
  category?: string;
}

interface PromptHistory {
  id: string;
  original: string;
  improved: string;
  timestamp: Date;
  category?: string;
}

export type PromptHistoryItem = PromptHistory;

interface ImprovePromptRequest {
  prompt: string;
}

interface ImprovePromptResponse {
  improved: string;
}

const initialState: PromptState = {
  prompts: [],
  currentPrompt: '',
  improvedPrompt: null,
  loading: false,
  error: null,
  history: [],
};

// Async thunk for improving prompt
export const improvePrompt = createAsyncThunk(
  'prompts/improve',
  async (promptData: ImprovePromptRequest, { rejectWithValue }) => {
    try {
      const response = await api.post<ImprovePromptResponse>('/prompt/improve', promptData);
      return {
        original: promptData.prompt,
        improved: response.data.improved,
        timestamp: new Date(),
      };
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data?.message || 'Prompt iyileştirme başarısız');
      }
      return rejectWithValue('Prompt iyileştirme başarısız');
    }
  }
);

// Async thunk for getting prompt history
export const getPromptHistory = createAsyncThunk(
  'prompts/getHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/prompt/history');
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data?.message || 'Geçmiş yüklenemedi');
      }
      return rejectWithValue('Geçmiş yüklenemedi');
    }
  }
);

// Async thunk for saving improved prompt
export const savePrompt = createAsyncThunk(
  'prompts/save',
  async (promptData: { original: string; improved: string; category?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/prompt/save', promptData);
      return response.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        return rejectWithValue(err.response.data?.message || 'Prompt kaydedilemedi');
      }
      return rejectWithValue('Prompt kaydedilemedi');
    }
  }
);

const promptSlice = createSlice({
  name: 'prompts',
  initialState,
  reducers: {
    setCurrentPrompt: (state, action) => {
      state.currentPrompt = action.payload;
      state.improvedPrompt = null;
      state.error = null;
    },
    clearCurrentPrompt: (state) => {
      state.currentPrompt = '';
      state.improvedPrompt = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addToHistory: (state, action) => {
      const newItem = {
        id: Date.now().toString(),
        ...action.payload,
        timestamp: new Date(),
      };
      state.history.unshift(newItem);
      // Keep only last 50 items
      if (state.history.length > 50) {
        state.history = state.history.slice(0, 50);
      }
    },
    removeFromHistory: (state, action) => {
      state.history = state.history.filter(item => item.id !== action.payload);
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Improve prompt
      .addCase(improvePrompt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(improvePrompt.fulfilled, (state, action) => {
        state.loading = false;
        state.improvedPrompt = action.payload.improved;
        
        // Add to local history
        const newItem: PromptHistory = {
          id: Date.now().toString(),
          original: action.payload.original,
          improved: action.payload.improved,
          timestamp: action.payload.timestamp,
        };
        state.history.unshift(newItem);
        
        // Keep only last 50 items
        if (state.history.length > 50) {
          state.history = state.history.slice(0, 50);
        }
      })
      .addCase(improvePrompt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get history
      .addCase(getPromptHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPromptHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(getPromptHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Save prompt
      .addCase(savePrompt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(savePrompt.fulfilled, (state, action) => {
        state.loading = false;
        // Add to prompts list if returned
        if (action.payload) {
          state.prompts.unshift(action.payload);
        }
      })
      .addCase(savePrompt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentPrompt,
  clearCurrentPrompt,
  clearError,
  addToHistory,
  removeFromHistory,
  clearHistory,
} = promptSlice.actions;

export default promptSlice.reducer;
