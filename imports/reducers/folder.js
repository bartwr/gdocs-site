import { createSlice } from '@reduxjs/toolkit'

export const folderSlice = createSlice({
  name: 'folder',
  initialState: [],
  reducers: {
    saveFolderFiles: (state, action) => {
      const files = action.payload;
      state = files;
      return state;
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  saveFolderFiles,
} = folderSlice.actions;

// Export helper functions
export {
}

export default folderSlice.reducer;
