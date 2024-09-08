// App.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import SplashScreen from "./components/video/SplashVideo";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import MainBottomTab from "./screens/MainScreens/MainBottomTab";
import ProductDetail from "./screens/DetailScreens/ProductDetail";
import Cart from "./screens/Cart";
import Login from "./screens/AuthScreens/Login";
import SignIn from "./screens/AuthScreens/SignIn";
import PackageDetails from "./screens/DetailScreens/PackageDetails";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import CheckOut from "./screens/CheckoutScreens/CheckOut";
import OrderDetails from "./screens/OrderHistory/OrderDetails";
import FilterScreen from "./screens/Filter";

const Stack = createNativeStackNavigator();

const App = () => {
  const [isAppReady, setAppReady] = useState(false);
  const [loaded, error] = useFonts({
    Mada_Bold: require("./assets/fonts/Mada/static/Mada-Bold.ttf"),
    Mada_ExtraBold: require("./assets/fonts/Mada/static/Mada-ExtraBold.ttf"),
    Mada_ExtraLight: require("./assets/fonts/Mada/static/Mada-ExtraLight.ttf"),
    Mada_Light: require("./assets/fonts/Mada/static/Mada-Light.ttf"),
    Mada_Medium: require("./assets/fonts/Mada/static/Mada-Medium.ttf"),
    Mada_Regular: require("./assets/fonts/Mada/static/Mada-Regular.ttf"),
    Mada_SemiBold: require("./assets/fonts/Mada/static/Mada-SemiBold.ttf"),
    Mada_Black: require("./assets/fonts/Mada/static/Mada-Black.ttf"),
  });

  if (!isAppReady) {
    return <SplashScreen onFinish={() => setAppReady(true)} />;
  }
  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="MainBottomTab"
              component={MainBottomTab}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Cart"
              component={Cart}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Filter"
              component={FilterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ProductDetail"
              component={ProductDetail}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignIn}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PackageDetail"
              component={PackageDetails}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CheckOut"
              component={CheckOut}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="OrderDetails"
              component={OrderDetails}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
