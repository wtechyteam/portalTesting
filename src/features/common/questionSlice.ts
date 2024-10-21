import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Question } from '@/helper/types'; // Ensure this type is defined in your types file

// API for creating a question
export const createQuestion = createAsyncThunk<Question, { text: string; askedForUserId: string;}>(
  'questions/createQuestion',
  async (questionData, thunkApi) => {
    try {
      const response = await axios.post<Question>('http://localhost:5000/api/questions', questionData);
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue('Failed to create question');
    }
  }
);

// API for getting all questions
export const getQuestions = createAsyncThunk<Question[], void>(
  'questions/getQuestions',
  async (_, thunkApi) => {
    try {
      const response = await axios.get<Question[]>('http://localhost:5000/api/questions');
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue('Failed to fetch questions');
    }
  }
);

// API for updating a question
export const updateQuestion = createAsyncThunk<Question, { id: string; text: string }>(
  'questions/updateQuestion',
  async ({ id, text }, thunkApi) => {
    try {
      const response = await axios.put<Question>(`http://localhost:5000/api/questions/${id}`, { text });
      return response.data;
    } catch (error) {
      return thunkApi.rejectWithValue('Failed to update question');
    }
  }
);

// API for deleting a question
export const deleteQuestion = createAsyncThunk<string, string>(
  'questions/deleteQuestion',
  async (id, thunkApi) => {
    try {
      await axios.delete(`http://localhost:5000/api/questions/${id}`);
      return id; // Return the ID to remove it from the state
    } catch (error) {
      return thunkApi.rejectWithValue('Failed to delete question');
    }
  }
);

const initialState: { questions: Question[]; loading: boolean; error: string | null } = {
  questions: [],
  loading: false,
  error: null,
};

export const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(getQuestions.fulfilled, (state, action: PayloadAction<Question[]>) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(getQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
        state.questions.push(action.payload);
      })
      .addCase(updateQuestion.fulfilled, (state, action: PayloadAction<Question>) => {
        const index = state.questions.findIndex(q => q._id === action.payload._id);
        if (index !== -1) {
          state.questions[index] = action.payload;
        }
      })
      .addCase(deleteQuestion.fulfilled, (state, action: PayloadAction<string>) => {
        state.questions = state.questions.filter(q => q._id !== action.payload);
      });
  },
});

export default questionSlice.reducer;
