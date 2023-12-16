import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  name: "",
  price: "",
  countInStock: "",
  description: "",
  image: "",
  brand: "",
  discount: "",
  selled:''
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    searchProduct: (state, action) => {
      state.search = action.payload;
    },
    detailsProduct: (state, action) => {
      const {
        name = "",
        price = "",
        countInStock = "",
        description = "",
        image = "",
        brand = "",
        discount = "",
        selled = ''
      } = action.payload;
      state.name = name;
      state.price = price;
      state.countInStock = countInStock;
      state.description = description;
      state.image = image;
      state.brand = brand;
      state.discount = discount;
      state.selled = selled
    },
  },
});

// Action creators are generated for each case reducer function
export const { searchProduct, detailsProduct } = productSlice.actions;

export default productSlice.reducer;
