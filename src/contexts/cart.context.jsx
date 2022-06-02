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
  // if (!existingItem) {
  //   return [...cartItems, { ...productToAdd, quantity: 1 }];
  // } else {
  //   return ;
  // }
  //If found, increment quantity
  //return new array with modified cartItems/ new cart item
};

export const CartContext = createContext({
  isCartOpen: false,
  setIsCartOpen: () => {},
  cartItems: [],
  addItemToCart: () => {},
  cartCount: 0,
});

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  //we want to recalculate cart count everytime cartItems array changes
  useEffect(() => {
    const newCartCount = cartItems.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );
    setCartCount(newCartCount);
  }, [cartItems]);

  const addItemToCart = (productToAdd) => {
    setCartItems(addCartItem(cartItems, productToAdd));
  };
  const value = {
    isCartOpen,
    setIsCartOpen,
    addItemToCart,
    cartItems,
    cartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
