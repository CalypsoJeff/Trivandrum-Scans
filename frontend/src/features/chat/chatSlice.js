import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
      messages: [], // Add a status field for each message
  },
  reducers: {
      updateMessageStatus: (state, action) => {
          const { messageId, status } = action.payload;
          const message = state.messages.find((msg) => msg._id === messageId);
          if (message) {
              message.status = status;
          }
      },
  },
});

export const { updateMessageStatus } = chatSlice.actions;
export default chatSlice.reducer;
