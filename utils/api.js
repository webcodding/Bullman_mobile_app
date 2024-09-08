// utils/api.js (frontend)
import axios from "axios";
//const Ip = "192.168.10.116";
//const Ip = "192.168.30.253";
export const BASE_DOMAIN = "https://bullman-backend-5769954b2d06.herokuapp.com";

const AUTH_URL = `${BASE_DOMAIN}/auth`;
const ODOO_URL = `${BASE_DOMAIN}/odoo`;
const CART_URL = `${BASE_DOMAIN}/cart`;

// Register user
export const registerUser = async (userData) => {
  const response = await axios.post(
    `${AUTH_URL}/register`,
    JSON.stringify(userData),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Login user
export const loginUser = async (userData) => {
  const response = await axios.post(
    `${AUTH_URL}/login`,
    JSON.stringify(userData),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Get user cart items
export const fetchUserCart = async (token) => {
  // console.log("Fetching User cartitems..", token);
  const response = await axios.get(CART_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  //console.log(response);
  return response.data;
};

// Update user cart items
export const updateUserCart = async (token, cartItems) => {
  //console.log(cartItems);
  const response = await axios.post(CART_URL, JSON.stringify(cartItems), {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Remove user cart item by unique key
export const removeUserCartItem = async (token, uniqueKey) => {
  const response = await axios.delete(`${CART_URL}/${uniqueKey}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

//order Odoo Api
export const createOrder = async (orderData) => {
  const url = `${ODOO_URL}/create-order`;
  //console.log(url);
  //console.log(JSON.stringify(orderData));
  const response = await axios.post(url, JSON.stringify(orderData), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  //console.log(response);

  return response.data;
};

//Odoo Api
export const fetchFromBackend = async (endpoint) => {
  try {
    const response = await fetch(`${ODOO_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
