import { createSlice } from '@reduxjs/toolkit';

// Manages UI state (modals, selected node, etc).
const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    selectedNode: null,
    openModal: false,
  },
  reducers: {
    setSelectedNode: (state, action) => { state.selectedNode = action.payload; },
    setOpenModal: (state, action) => { state.openModal = action.payload; },
  },
});

export const { setSelectedNode, setOpenModal } = uiSlice.actions;
export default uiSlice.reducer;