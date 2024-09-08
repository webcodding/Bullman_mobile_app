import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
  AntDesign,
  Octicons,
  MaterialIcons,
  FontAwesome,
} from "@expo/vector-icons";
import Home from "./Home";
import SearchProducts from "./SearchProducts";
import User from "./User";
import Orders from "./Orders";
import { AuthProvider } from "../../context/AuthContext";

const Tab = createBottomTabNavigator();

const MainBottomTab = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          // flex: 1,
          position: "absolute",
          shadowColor: "#363636",
          shadowOpacity: 0.2,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowRadius: 20,
          elevation: 10,
          borderWidth: 0.5,
          borderColor: "#eee",
          // backgroundColor: "#000",
          // marginHorizontal: 10,
          // marginBottom: 8,
          paddingHorizontal: 5,
          paddingBottom: 15,
          height: 60,
          borderWidth: 1,
          borderTopWidth: 1.3,
          borderRadius: 2,
          shadowOpacity: 0,
          shadowRadius: 0,
          shadowColor: "#000",
        },
        keyboardHidesTabBar: false,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.tabIcon}>
              <MaterialCommunityIcons
                name="shopping-outline"
                size={24}
                color={focused ? "#315593" : "#acacad"}
              />

              <Text style={focused ? styles.tabLabel : styles.label}>Shop</Text>
            </View>
          ),
        }}
      >
        {() => <Home navigation={navigation} />}
      </Tab.Screen>
      <Tab.Screen
        name="Search"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.tabIcon}>
              <FontAwesome
                name="star"
                size={24}
                color={focused ? "#315593" : "#acacad"}
              />

              <Text style={focused ? styles.tabLabel : styles.label}>
                Featured
              </Text>
            </View>
          ),
        }}
      >
        {() => <SearchProducts navigation={navigation} />}
      </Tab.Screen>

      <Tab.Screen
        name="Orders"
        //component={WalletScreen}
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.tabIcon}>
              <MaterialIcons
                name="local-shipping"
                size={24}
                color={focused ? "#315593" : "#acacad"}
              />
              <Text style={focused ? styles.tabLabel : styles.label}>
                Orders
              </Text>
            </View>
          ),
        }}
      >
        {() => <Orders navigation={navigation} />}
      </Tab.Screen>

      <Tab.Screen
        name="User"
        options={{
          tabBarLabel: "",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={styles.tabIcon}>
              <FontAwesome5
                name="user"
                size={22}
                color={focused ? "#315593" : "#acacad"}
              />

              <Text style={focused ? [styles.tabLabel] : [styles.label]}>
                Account
              </Text>
            </View>
          ),
        }}
      >
        {() => <User navigation={navigation} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: {
    marginTop: 15,
    flexDirection: "column",
    alignItems: "center",
    ...Platform.select({
      ios: {
        width: 120,
      },
    }),
  },
  tabLabel: {
    fontFamily: "Mada_Bold",
    marginTop: 0,
    paddingBottom: 2,
    color: "#315593",
    borderBottomWidth: 1,
    // borderBottomColor: "#315593",
    marginBottom: -8,
    fontSize: 10,
  },
  label: {
    fontFamily: "Mada_Medium",
    marginTop: 0,
    paddingBottom: 2,
    color: "#acacad",
    marginBottom: -8,
    fontSize: 10,
  },
});

export default MainBottomTab;
