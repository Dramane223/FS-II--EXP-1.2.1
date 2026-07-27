import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  byId: {},
  allIds: [],
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: (state, action) => {
      const post = action.payload
      state.byId[post.id] = post
      state.allIds.unshift(post.id)
    },
    postUpdated: (state, action) => {
      const { id, changes } = action.payload
      state.byId[id] = { ...state.byId[id], ...changes }
    },
    postDeleted: (state, action) => {
      const id = action.payload
      delete state.byId[id]
      state.allIds = state.allIds.filter((postId) => postId !== id)
    },
  },
})

export const { postAdded, postUpdated, postDeleted } = postsSlice.actions
export default postsSlice.reducer