import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  byId: {
    twitter: { id: 'twitter', name: 'X / Twitter', limit: 280 },
    instagram: { id: 'instagram', name: 'Instagram', limit: 2200 },
    linkedin: { id: 'linkedin', name: 'LinkedIn', limit: 3000 },
    facebook: { id: 'facebook', name: 'Facebook', limit: 63206 },
  },
  allIds: ['twitter', 'instagram', 'linkedin', 'facebook'],
  selectedIds: [],
}

const platformsSlice = createSlice({
  name: 'platforms',
  initialState,
  reducers: {
    togglePlatform: (state, action) => {
      const platformId = action.payload

      state.selectedIds = state.selectedIds.includes(platformId)
        ? state.selectedIds.filter((id) => id !== platformId)
        : [...state.selectedIds, platformId]
    },
    setSelectedPlatforms: (state, action) => {
      state.selectedIds = action.payload
    },
  },
})

export const { togglePlatform, setSelectedPlatforms } = platformsSlice.actions
export default platformsSlice.reducer