import { createSlice } from '@reduxjs/toolkit';

// Load cart state from local storage helper
const loadCartState = () => {
  try {
    const serializedCart = localStorage.getItem('aura_cart');
    if (serializedCart === null) {
      return {
        items: [],
        promoCode: null,
        promoType: null,
        promoValue: 0,
        discount: 0,
        shipping: 250, // Standard shipping Rs. 250 in Pakistan
      };
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    return {
      items: [],
      promoCode: null,
      promoType: null,
      promoValue: 0,
      discount: 0,
      shipping: 250,
    };
  }
};

const initialState = loadCartState();

// Helper to calculate discount
const calculateDiscount = (subtotal, type, value) => {
  if (type === 'percent') {
    return Math.round(subtotal * (value / 100));
  } else if (type === 'flat') {
    return Math.min(value, subtotal);
  }
  return 0;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, name, image, price, quantity, engravingText, engravingFont, size } = action.payload;
      const selectedSize = size || '50ml';
      
      // We identify items by productId AND engraving options AND size
      const itemKey = `${product}_${engravingText || ''}_${engravingFont || ''}_${selectedSize}`;
      
      const existingItemIndex = state.items.findIndex(item => item.id === itemKey);

      if (existingItemIndex > -1) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({
          id: itemKey,
          product,
          name,
          image,
          price,
          quantity,
          engravingText: engravingText || '',
          engravingFont: engravingFont || '',
          size: selectedSize
        });
      }

      // Recompute shipping (free shipping above Rs. 5000)
      const subtotal = state.items.reduce((sum, item) => {
        const itemPrice = item.engravingText ? item.price + 500 : item.price;
        return sum + itemPrice * item.quantity;
      }, 0);
      state.shipping = subtotal > 5000 ? 0 : 250;
      
      // Recompute discount
      state.discount = calculateDiscount(subtotal, state.promoType, state.promoValue);
      
      localStorage.setItem('aura_cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);

      const subtotal = state.items.reduce((sum, item) => {
        const itemPrice = item.engravingText ? item.price + 500 : item.price;
        return sum + itemPrice * item.quantity;
      }, 0);
      state.shipping = subtotal > 5000 ? 0 : 250;
      state.discount = calculateDiscount(subtotal, state.promoType, state.promoValue);
      
      localStorage.setItem('aura_cart', JSON.stringify(state));
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);

      if (itemIndex > -1) {
        state.items[itemIndex].quantity = Math.max(1, quantity);
      }

      const subtotal = state.items.reduce((sum, item) => {
        const itemPrice = item.engravingText ? item.price + 500 : item.price;
        return sum + itemPrice * item.quantity;
      }, 0);
      state.shipping = subtotal > 5000 ? 0 : 250;
      state.discount = calculateDiscount(subtotal, state.promoType, state.promoValue);
      
      localStorage.setItem('aura_cart', JSON.stringify(state));
    },
    updateSize: (state, action) => {
      const { id, newSize, newPrice } = action.payload;
      const itemIndex = state.items.findIndex(item => item.id === id);

      if (itemIndex > -1) {
        const item = state.items[itemIndex];
        item.size = newSize;
        item.price = newPrice;

        // Create new ID key since size changed
        const newKey = `${item.product}_${item.engravingText || ''}_${item.engravingFont || ''}_${newSize}`;
        
        // Merge duplicates if changing to a size already in the cart
        const duplicateIndex = state.items.findIndex(other => other.id === newKey && other.id !== id);
        if (duplicateIndex > -1) {
          state.items[duplicateIndex].quantity += item.quantity;
          state.items.splice(itemIndex, 1);
        } else {
          item.id = newKey;
        }
      }

      const subtotal = state.items.reduce((sum, item) => {
        const itemPrice = item.engravingText ? item.price + 500 : item.price;
        return sum + itemPrice * item.quantity;
      }, 0);
      state.shipping = subtotal > 5000 ? 0 : 250;
      state.discount = calculateDiscount(subtotal, state.promoType, state.promoValue);

      localStorage.setItem('aura_cart', JSON.stringify(state));
    },
    applyPromo: (state, action) => {
      const { code, type, value } = action.payload;
      state.promoCode = code;
      state.promoType = type;
      state.promoValue = value;
      
      const subtotal = state.items.reduce((sum, item) => {
        const itemPrice = item.engravingText ? item.price + 500 : item.price;
        return sum + itemPrice * item.quantity;
      }, 0);
      state.discount = calculateDiscount(subtotal, type, value);
      
      localStorage.setItem('aura_cart', JSON.stringify(state));
    },
    removePromo: (state) => {
      state.promoCode = null;
      state.promoType = null;
      state.promoValue = 0;
      state.discount = 0;
      
      localStorage.setItem('aura_cart', JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = [];
      state.promoCode = null;
      state.promoType = null;
      state.promoValue = 0;
      state.discount = 0;
      state.shipping = 250;
      
      localStorage.removeItem('aura_cart');
    }
  }
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  updateSize,
  applyPromo,
  removePromo,
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;
