import { createSlice } from '@reduxjs/toolkit';

// 1. The slice manages the state for all nodes in the flow.
//    We use an array as initialState because each node is an object with its own id and data.
const nodesSlice = createSlice({
  name: 'nodes', // 2. The name of the slice, used in Redux DevTools and as a key in the store.
  initialState: [],
  reducers: {
    // 3. setNodes: Replace the entire nodes array (e.g., when loading or resetting the flow).
    setNodes: (state, action) => action.payload,

    // 4. addNode: Add a new node to the array.
    addNode: (state, action) => { state.push(action.payload); },

    // 5. updateNode: Find a node by id and update its data.
    updateNode: (state, action) => {
      const idx = state.findIndex(n => n.id === action.payload.id);
      if (idx !== -1) state[idx] = action.payload;
    },

    // 6. removeNode: Remove a node by id.
    removeNode: (state, action) => state.filter(n => n.id !== action.payload),
  },
});

// 7. Export the actions for use in components (dispatching).
export const { setNodes, addNode, updateNode, removeNode } = nodesSlice.actions;

// 8. Export the reducer to be combined in the Redux store.
export default nodesSlice.reducer;