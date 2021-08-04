import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    search: '',
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    //Actions
    setSearch: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { setSearch } = searchSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const getSearchQuery = (state) => state.search;

export default searchSlice.reducer;