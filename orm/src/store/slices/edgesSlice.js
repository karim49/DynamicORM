import { createSlice } from '@reduxjs/toolkit';

// Manages all edges in the flow as an array of objects.
const edgesSlice = createSlice({
  name: 'edges',
  initialState: [],
  reducers: {
    setEdges: (state, action) => {
      return action.payload;
    },
    addEdge: (state, action) => { state.push(action.payload); },
    updateEdge: (state, action) => {
      const index = state.findIndex(edge => edge.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
    removeEdge: (state, action) => {
      return state.filter(edge => edge.id !== action.payload);
    },
    clearEdges: () => {
      return [];
    }
  },
});

export const { setEdges, addEdge, updateEdge, removeEdge, clearEdges } = edgesSlice.actions;
export default edgesSlice.reducer;