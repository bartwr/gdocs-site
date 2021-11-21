import { createSlice } from '@reduxjs/toolkit'

const findDocument = (documentsArray, documentId) => {
  const theOne = documentsArray.filter(x => {
    return x.documentId == documentId;
  });
  return theOne.length === 1 ? theOne[0] : null;
}

const updateDocument = (documentsArray, documentToUpdate) => {
  return documentsArray.map(x => {
    if(x.documentId == documentToUpdate.documentId) {
      return Object.assign({}, x, {
        title: documentToUpdate.title ? documentToUpdate.title : x.title,
        content: documentToUpdate.content ? documentToUpdate.content : x.content
      })
    }
    return x;
  });
}

export const docSlice = createSlice({
  name: 'doc',
  initialState: [],
  reducers: {
    saveDocTitle: (state, action) => {
      const {documentId, title} = action.payload;
      // If document exists in store: update
      if(findDocument(state, documentId)) {
        state = updateDocument(state, action.payload)
      }
      // If document doesn't exist in store: add it
      else {
        state.push({
          documentId: documentId,
          title: title
        })
      }
      return state;
    },
    saveDocContent: (state, action) => {
      const {documentId, content} = action.payload;
      // If document exists in store: update
      if(findDocument(state, documentId)) {
        state = updateDocument(state, action.payload)
      }
      // If document doesn't exist in store: add it
      else {
        state.push({
          documentId: documentId,
          content: content
        })
      }
      return state;
    }
  },
})

// Action creators are generated for each case reducer function
export const {
  saveDocTitle,
  saveDocContent,
} = docSlice.actions;

// Export helper functions
export {
  findDocument
}

export default docSlice.reducer;
