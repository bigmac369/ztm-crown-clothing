import { createContext, useState, useEffect } from "react";

//helper function
const addCartItem = (cartItems, productToAdd) => {
  function findItem(item) {
    return item.id === productToAdd.id;
  }
  //find if cartItems contains productToAdd
  const existingItem = cartItems.find(findItem);

  if (existingItem) {
    return cartItems.map((cartItem) => {
      return cartItem.id === productToAdd.id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem;
    });
  }
  return [...cartItems, { ...productToAdd, quantity: 1 }];
};

const removeCartItem = (cartItems, cartItemToRemove) => {
  //find the cart item to remove
  const existingItem = cartItems.find((item) => {
    return item.id === cartItemToRemove.id;
  });

  //check if quantity is equal to 1, if it is remove that item from the cart
  if (existingItem.quantity === 1) {
    return cartItems.filter((cartItem) => {
      return cartItem.id !== cartItemToRemove.id;
    });
  }
  return cartItems.map((cartItem) => {
    return cartItem.id === cartItemToRemove.id
      ? { ...cartItem, quantity: cartItem.quantity - 1 }
      : cartItem;
  });

  //return back cart items with matching cart item with reduced quantity
};

const removeCheckoutItem = (cartItems, cartItemToRemove) => {
  const existingItem = cartItems.find((item) => {
    return item.id === cartItemToRemove.id;
  });

  if (existingItem) {
    return cartItems.filter((cartItem) => {
      return cartItem.id !== cartItemToRemove.id;
    });
  }
};

export const CartContext = createContext({
  isCartOpen: false,
  setIsCartOpen: () => {},
  cartItems: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  cartCount: 0,
  cartTotal: 0,
});

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);

  //we want to recalculate cart count everytime cartItems array changes
  useEffect(() => {
    const newCartCount = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );
    setCartCount(newCartCount);
  }, [cartItems]);

  useEffect(() => {
    const newCartTotal = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity * cartItem.price,
      0
    );
    setCartTotal(newCartTotal);
  }, [cartItems]);

  const addItemToCart = (productToAdd) => {
    setCartItems(addCartItem(cartItems, productToAdd));
  };

  const removeItemFromCart = (cartItemToRemove) => {
    setCartItems(removeCartItem(cartItems, cartItemToRemove));
  };

  const clearItemFromCart = (checkoutItemToRemove) => {
    setCartItems(removeCheckoutItem(cartItems, checkoutItemToRemove));
  };

  const value = {
    isCartOpen,
    setIsCartOpen,
    addItemToCart,
    removeItemFromCart,
    cartItems,
    cartCount,
    clearItemFromCart,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
