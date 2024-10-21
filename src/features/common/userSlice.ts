import { APIResponse, UserProfile } from '@/helper/types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';



export const getUserInfo = createAsyncThunk<UserProfile, string>(
    "user/getUserInfo",
    async (userId: string, thunkApi) => {
        try {
            const response = await axios.get<UserProfile>(`http://localhost:5000/api/users/${userId}`);
            console.log(response.data)
            return response.data; // This returns { name, avatar, emailId }
            
        } catch (error) {
            return thunkApi.rejectWithValue('Failed to fetch user info');
        }
    }
);

// userSlice.ts

export const registerUser = createAsyncThunk<
  UserProfile, // Return type
  { name: string; email: string; password: string; role: string }, // Argument type
  { rejectValue: string } // Reject value type
>(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      return { ...data, token: data.token }; // Make sure to include the token here
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Something went wrong');
    }
  }
);

export const loginUser = createAsyncThunk<
  UserProfile, // Return type
  { email: string; password: string }, // Argument type
  { rejectValue: string } // Reject value type
>(
  'user/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:5000/api/users/login', { // Update with your actual login API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      return { ...data, token: data.token }; // Ensure the token is included in the response
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Something went wrong');
    }
  }
);


const initialState: UserProfile & { token?: string } = {
    name: "",
    avatar: "",
    emailId: "",
    token: "",
    role: ""
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {



    },

    extraReducers: (builder) => {
        builder.addCase(getUserInfo.pending, (state) => {

        });
        builder.addCase(getUserInfo.fulfilled, (state, action) => {
            console.log(action.payload)
            state.name = action.payload.name
            state.avatar = action.payload.avatar
            state.role = action.payload.role;
            state.emailId = action.payload.emailId;
        });
        builder.addCase(getUserInfo.rejected, (state) => {

        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.name = action.payload.name;
            state.avatar = action.payload.avatar;
            state.emailId = action.payload.emailId;
            state.token = action.payload.token;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.name = action.payload.name;
            state.avatar = action.payload.avatar;
            state.emailId = action.payload.emailId;
            state.token = action.payload.token;
        });
        
    }
});

export const { } = userSlice.actions;

export default userSlice.reducer;
