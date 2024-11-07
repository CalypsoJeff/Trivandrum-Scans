import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    unreadCount: 0, 
  },
  reducers: {
    updateUnreadCount: (state, action) => {
        state.unreadCount = action.payload.unreadCount;
      },
      
    resetUnreadCount: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const { updateUnreadCount, resetUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;
