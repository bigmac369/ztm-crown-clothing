import { createContext, useState, useEffect } from "react";

import PRODUCTS from "../shop-data.json";

export const ProductsContext = createContext({
  products: [],
});

//provider: is the actual component
//provider receive a value which is going to hold the actual contextual value
//UserProvider allowing any of its child component to access the value inside of its useState
export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(PRODUCTS);
  console.log(products);
  const value = { products };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
