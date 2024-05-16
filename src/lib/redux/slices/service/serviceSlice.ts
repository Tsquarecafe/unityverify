import {
  serviceDataType,
  slipDataType,
  subServiceDataType,
  verificationResponseType2,
} from "@/types/service";
import { createSlice } from "@reduxjs/toolkit";
import {
  getAllSlips,
  verifyByDemography,
  verifyByNIN,
  verifyByPhone,
  verifyByVNIN,
} from "./serviceThunk";
import { SlipType } from "@prisma/client";

interface ServiceSliceState {
  selectedService: serviceDataType;
  selectedSubService: subServiceDataType | null;
  slipBlob: null | Blob;
  selectedSlipType: slipDataType;
  allSlips: SlipType[] | null;
  isLoading: boolean;
  response: verificationResponseType2 | null;
}

const initialState: ServiceSliceState = {
  selectedService: {
    title: "",
    description: "",
    slug: "",
    image: "",
    isServiecAvailable: false,
  },
  slipBlob: null,
  selectedSubService: null,
  selectedSlipType: {
    id: "",
    title: "",
    image: "",
    price: 0,
  },
  allSlips: null,
  isLoading: false,
  response: null,
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    selectService: (state, action) => {
      state.selectedService = action.payload;
    },
    selectSubService: (state, action) => {
      state.selectedSubService = action.payload;
    },
    setSlipBlob: (state, action) => {
      state.slipBlob = action.payload;
    },
    selectSlipType: (state, action) => {
      state.selectedSlipType = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder

      // Verify By NIN
      .addCase(verifyByNIN.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyByNIN.fulfilled, (state, action) => {
        state.response = action.payload;
        state.isLoading = false;
      })
      .addCase(verifyByNIN.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(verifyByVNIN.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyByVNIN.fulfilled, (state, action) => {
        state.response = action.payload;
        state.isLoading = false;
      })
      .addCase(verifyByVNIN.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(verifyByDemography.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyByDemography.fulfilled, (state, action) => {
        state.response = action.payload;
        state.isLoading = false;
      })
      .addCase(verifyByDemography.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(verifyByPhone.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyByPhone.fulfilled, (state, action) => {
        state.response = action.payload;
        state.isLoading = false;
      })
      .addCase(verifyByPhone.rejected, (state, action) => {
        state.isLoading = false;
      })

      .addCase(getAllSlips.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllSlips.fulfilled, (state, action) => {
        state.allSlips = action.payload;
        state.isLoading = false;
      })
      .addCase(getAllSlips.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

export const { selectService, selectSubService, selectSlipType, setSlipBlob } =
  serviceSlice.actions;

export default serviceSlice.reducer;
