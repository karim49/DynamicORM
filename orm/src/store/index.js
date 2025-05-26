import { configureStore } from '@reduxjs/toolkit';
import nodesReducer from './slices/nodesSlice';
import edgesReducer from './slices/edgesSlice';
import uiReducer from './slices/uiSlice';
import filesReducer from './slices/filesSlice';

// Combines all slices into the Redux store.
const store = configureStore({
  reducer: {
    nodes: nodesReducer,
    edges: edgesReducer,
    ui: uiReducer,
    files: filesReducer, // Add files slice
  },
});

export default store;