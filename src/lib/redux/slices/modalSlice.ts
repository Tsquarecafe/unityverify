import { createSlice } from "@reduxjs/toolkit";

interface ModalSliceState {
  isOpen: boolean;
  paymentModal: boolean;
  showMobileSidebar: boolean;
  modalTitle?: string;
}

const initialState: ModalSliceState = {
  isOpen: false,
  paymentModal: false,
  showMobileSidebar: false,
  modalTitle: "",
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state) => {
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.paymentModal = false;
      state.isOpen = false;
    },
    setPaymentModal: (state, action) => {
      state.paymentModal = action.payload;
    },
    setShowMobileSidebar: (state, action) => {
      state.showMobileSidebar = action.payload;
    },
    setModalTitle: (state, action) => {
      state.modalTitle = action.payload;
    },
  },
});

export const {
  openModal,
  closeModal,
  setShowMobileSidebar,
  setPaymentModal,
  setModalTitle,
} = modalSlice.actions;

export default modalSlice.reducer;
