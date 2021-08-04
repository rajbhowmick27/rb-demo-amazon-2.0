import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "../slices/basketSlice";
import searchReducer from "../slices/searchSlice";
import voiceReducer from "../slices/voiceSlice";


// global store
export const store = configureStore({
  reducer: {
    basket: basketReducer,
    search: searchReducer,
    voice: voiceReducer,
  },
}); 

