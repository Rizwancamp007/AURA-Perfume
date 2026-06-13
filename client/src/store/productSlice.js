import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  featuredProducts: [],
  selectedProduct: null,
  reviews: [],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.loading = false;
      state.products = action.payload;
    },
    fetchFeaturedSuccess: (state, action) => {
      state.loading = false;
      state.featuredProducts = action.payload;
    },
    fetchSingleSuccess: (state, action) => {
      state.loading = false;
      state.selectedProduct = action.payload;
    },
    fetchReviewsSuccess: (state, action) => {
      state.reviews = action.payload;
    },
    addReviewSuccess: (state, action) => {
      state.reviews.unshift(action.payload);
    },
    fetchFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
      state.reviews = [];
    }
  }
});

export const {
  fetchStart,
  fetchSuccess,
  fetchFeaturedSuccess,
  fetchSingleSuccess,
  fetchReviewsSuccess,
  addReviewSuccess,
  fetchFailure,
  clearSelectedProduct
} = productSlice.actions;

export default productSlice.reducer;
