import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  total: 0,
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    //Actions
    addToBasket: (state, action) => {
      const index = state.items.findIndex(basketItem => basketItem.product.title === action.payload.title);

      let newBasket = [...state.items];

      if(index >= 0){
        newBasket[index].cnt += 1;
        
      }
      else{
        newBasket.push({
          product: action.payload,
          cnt: 1,
        })
      }

      state.items = newBasket;
      state.total += 1;
    },
    removeFromBasket: (state, action) => {
      const index = state.items.findIndex(basketItem => basketItem.product.title === action.payload.title);

      let newBasket = [...state.items];

      if(index >= 0){
        if(newBasket[index].cnt <= 1)
          newBasket.splice(index, 1);
        else
        {
          newBasket[index].cnt -= 1;
        }
      }
      else{
        console.warn(`Can't remove product (id: ${action.payload.id}) as it's not in the basket`)
      }

      state.items = newBasket;
      state.total -= 1;
    },
  },
});

export const { addToBasket, removeFromBasket } = basketSlice.actions;

// Selectors - This is how we pull information from the Global store slice
export const selectItems = (state) => state.basket;

export const selectFinalPrice = (state) => state.basket.items.reduce((sum,item) => sum + (item.product.price*item.cnt),0)

export default basketSlice.reducer;


// export const basketSlice = createSlice({
//   name: "basket",
//   initialState,
//   reducers: {
//     //Actions
//     addToBasket: (state, action) => {
//       state.items = [...state.items,action.payload];
//     },
//     removeFromBasket: (state, action) => {
//       const index = state.items.findIndex(basketItem => basketItem.id === action.payload.id);

//       let newBasket = [...state.items];

//       if(index >= 0){
//         newBasket.splice(index, 1);
//       }
//       else{
//         console.warn(`Can't remove product (id: ${action.payload.id}) as it's not in the basket`)
//       }

//       state.items = newBasket;
//     },
//   },
// });


// removeFromBasket: (state, action) => {
//   const index = state.items.findIndex(basketItem => basketItem.id === action.payload.id);

//   let newBasket = [...state.items];

//   if(index >= 0){
//     newBasket.splice(index, 1);
//   }
//   else{
//     console.warn(`Can't remove product (id: ${action.payload.id}) as it's not in the basket`)
//   }

//   state.items = newBasket;
// },