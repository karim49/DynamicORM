import { createSlice } from '@reduxjs/toolkit';

// Manages uploaded files globally
const filesSlice = createSlice({
  name: 'files',
  initialState: [],
  reducers: {
    addFile: (state, action) => {
      // Prevent duplicates by name
      if (!state.some(f => f.originalName === action.payload.originalName)) {
        state.push(action.payload);
      }
    },
    removeFile: (state, action) => state.filter(f => f.originalName !== action.payload),
    setFiles: (state, action) => action.payload,
  },
});

export const { addFile, removeFile, setFiles } = filesSlice.actions;
export default filesSlice.reducer;
