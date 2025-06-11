import { createSlice } from '@reduxjs/toolkit';

// 1. The slice manages the state for all nodes in the flow.
//    We use an array as initialState because each node is an object with its own id and data.
const initialState = [];

const nodesSlice = createSlice({
  name: 'nodes', // 2. The name of the slice, used in Redux DevTools and as a key in the store.
  initialState,
  reducers: {
    // 3. setNodes: Replace the entire nodes array (e.g., when loading or resetting the flow).
    setNodes: (state, action) => {
      return action.payload;
    },

    // 4. addNode: Add a new node to the array.
    addNode: (state, action) => { state.push(action.payload); },

    // 5. updateNode: Find a node by id and update its data.
    updateNode: (state, action) => {
      const index = state.findIndex(node => node.id === action.payload.id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },

    // 6. removeNode: Remove a node by id.
    removeNode: (state, action) => {
      return state.filter(node => node.id !== action.payload);
    },

    // 7. clearNodes: Clear all nodes from the array.
    clearNodes: () => {
      return initialState;
    }
  },
});

// 8. Export the actions for use in components (dispatching).
export const { setNodes, addNode, updateNode, removeNode, clearNodes } = nodesSlice.actions;

// 9. Export the reducer to be combined in the Redux store.
export default nodesSlice.reducer;