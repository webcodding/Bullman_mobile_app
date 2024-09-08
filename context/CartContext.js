import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import {
  fetchUserCart,
  updateUserCart,
  removeUserCartItem,
} from "../utils/api";
import AuthContext from "./AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

const initialState = {
  cartItems: [],
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { newItem, auth } = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        (item) => item.uniqueKey === newItem.uniqueKey
      );

      let updatedCartItems;
      if (existingItemIndex !== -1) {
        updatedCartItems = [...state.cartItems];
        updatedCartItems[existingItemIndex] = newItem;
      } else {
        updatedCartItems = [...state.cartItems, newItem];
      }

      if (!auth.token) {
        AsyncStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      }
      return { ...state, cartItems: updatedCartItems };
    }

    case "REMOVE_FROM_CART": {
      const { uniqueKey, auth } = action.payload;
      const updatedCartItems = state.cartItems.filter(
        (item) => item.uniqueKey !== uniqueKey
      );

      if (!auth.token) {
        AsyncStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      }
      return { ...state, cartItems: updatedCartItems };
    }

    case "LOAD_USER_CART": {
      return { ...state, cartItems: action.payload };
    }

    case "SET_LOADING": {
      return { ...state, isLoading: action.payload };
    }

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { auth } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCartItems = async () => {
      // console.log("Loading cart items...");

      if (auth.token) {
        //console.log("Token found:", auth.token);
        const data = await fetchUserCart(auth.token);
        // console.log("Fetched cart items:", data);
        if (data && data) {
          dispatch({ type: "LOAD_USER_CART", payload: data });
        }
      } else {
        const storedCartItems = await AsyncStorage.getItem("cartItems");
        if (storedCartItems) {
          dispatch({
            type: "LOAD_USER_CART",
            payload: JSON.parse(storedCartItems),
          });
        }
      }
      setIsLoading(false);
    };

    loadCartItems();
  }, [auth.token]);

  useEffect(() => {
    if (auth.token && !isLoading) {
      updateUserCart(auth.token, state.cartItems);
    } else if (!auth.token) {
      AsyncStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    }
  }, [state.cartItems, auth.token, isLoading]);

  const addToCart = (product) => {
    dispatch({ type: "ADD_TO_CART", payload: { newItem: product, auth } });
  };

  const removeFromCart = async (uniqueKey) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: { uniqueKey, auth } });
    if (auth.token) {
      await removeUserCartItem(auth.token, uniqueKey);
    }
  };

  return (
    <CartContext.Provider
      value={{ cartItems: state.cartItems, addToCart, removeFromCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
