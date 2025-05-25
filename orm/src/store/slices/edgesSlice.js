import { createSlice } from '@reduxjs/toolkit';

// Manages all edges in the flow as an array of objects.
const edgesSlice = createSlice({
  name: 'edges',
  initialState: [],
  reducers: {
    setEdges: (state, action) => action.payload,
    addEdge: (state, action) => { state.push(action.payload); },
    updateEdge: (state, action) => {
      const idx = state.findIndex(e => e.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
    },
    removeEdge: (state, action) => state.filter(e => e.id !== action.payload),
  },
});

export const { setEdges, addEdge, updateEdge, removeEdge } = edgesSlice.actions;
export default edgesSlice.reducer;