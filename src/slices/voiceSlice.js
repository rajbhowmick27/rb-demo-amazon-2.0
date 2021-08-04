import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    voiceSearch: false,
};

export const voiceSlice = createSlice({
  name: "voice",
  initialState,
  reducers: {
    //Actions
    setVoiceSearch: (state, action) => {
      state.voiceSearch = action.payload;
    },
  },
});

export const { setVoiceSearch } = voiceSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const getVoiceSearch = (state) => state.voice.voiceSearch;

export default voiceSlice.reducer;