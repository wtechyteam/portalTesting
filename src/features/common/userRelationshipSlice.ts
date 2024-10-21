import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const mapUserRelationships = createAsyncThunk(
    'user/mapUserRelationships',
    async (mappingData: { userId: string; supervisors: string[]; peers: string[]; juniors: string[] }) => {
      const response = await axios.post('http://localhost:5000/api/users/map-user-relationships', mappingData);
      return response.data;
    }
  );

const userRelationshipSlice = createSlice({
    name: 'userRelationships',
    initialState: {
        users: [],
        // Define initial state here
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(mapUserRelationships.fulfilled, (state, action) => {
                // Handle success case
            })
            .addCase(mapUserRelationships.rejected, (state, action) => {
                // Handle error case
            });
    },
});

export default userRelationshipSlice.reducer;
