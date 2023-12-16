import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orderItems: [],
  orderItemsSelected: [],
  shippingAddress: {},
  paymentMethod: "",
  //tong gia san pham
  itemsPrice: 0,
  // phi giao hang
  shippingPrice: 0,
  // gia thue
  taxPrice: 0,
  // tong thanh toan
  totalPrice: 0,
  user: "",
  // trang thai thanh toan
  isPaid: false,
  // thoi gian thanh toan
  paidAt: "",
  // trang thai giao hang
  isDelivered: false,
  // thoi gian giao hang
  deliverAt: "",
  isSucessOrder: false,

};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    addOrderProduct: (state, action) => {
      const { orderItem } = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === orderItem?.product
      );
      if (itemOrder) {
        itemOrder.amount += orderItem?.amount;
        state.isSucessOrder = true;
      } else {
        state.orderItems.push(orderItem);
      }
    },
    resetOrder: (state) => {
      state.isSucessOrder = false
    },
    increaseAmount: (state, action) => {
      const idProduct = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = state?.orderItemsSelected?.find(
        (item) => item?.product === idProduct
      );
      if (itemOrder) {
        itemOrder.amount++;
      }
      if (itemOrderSelected) {
        itemOrderSelected.amount++;
      }
    },
    decreaseAmount: (state, action) => {
      const idProduct = action.payload;
      const itemOrder = state?.orderItems?.find(
        (item) => item?.product === idProduct
      );
      const itemOrderSelected = state?.orderItemsSelected?.find(
        (item) => item?.product === idProduct
      );
      itemOrder.amount--;
      if (itemOrderSelected) {
        itemOrderSelected.amount--;
      }
    },
    removeOrderProduct: (state, action) => {
      const idProduct = action.payload;
      const itemOrder = state?.orderItems?.filter(
        (item) => item?.product !== idProduct
      );
      const itemOrderSelected = state?.orderItemsSelected?.filter(
        (item) => item?.product !== idProduct
      );
      state.orderItems = itemOrder;
      state.orderItemsSelected = itemOrderSelected;
    },
    removeAllOrderProduct: (state, action) => {
      const { listChecher } = action.payload;
      const itemOrder = state?.orderItems?.filter(
        (item) => !listChecher?.includes(item?.product)
      );
      const itemOrderSelected = state?.orderItems?.filter(
        (item) => !listChecher?.includes(item?.product)
      );
      state.orderItems = itemOrder;
      state.orderItemsSelected = itemOrderSelected;
    },
    selectedOrder: (state, action) => {
      const { listChecher } = action.payload;
      const orderSelected = [];
      state.orderItems.forEach((item) => {
        if (listChecher.includes(item?.product)) {
          orderSelected.push(item);
        }
      });

      state.orderItemsSelected = orderSelected;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addOrderProduct,
  removeOrderProduct,
  increaseAmount,
  decreaseAmount,
  removeAllOrderProduct,
  selectedOrder,
  resetOrder
} = orderSlice.actions;

export default orderSlice.reducer;
