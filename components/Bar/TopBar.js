import React, { Component, useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { globalstyle } from "../../styles/globalstyle";
import {
  AntDesign,
  FontAwesome5,
  FontAwesome6,
  Octicons,
} from "@expo/vector-icons";
import { fetchFromBackend } from "../../utils/api";
import { useCart } from "../../context/CartContext";

const TopBar = ({ navigation, rightContent }) => {
  const [showUserBox, setShowUserBox] = useState(false);
  const [showCategoryBox, setShowCategoryBox] = useState(false);
  const [headerCategories, setHeaderCategories] = useState([]);
  const [shopCategories, setShopCategories] = useState([]);
  const { cartItems } = useCart();
  // console.log(cartItems);

  useEffect(() => {
    const fetchData = async () => {
      const headerData = await fetchFromBackend("/categories/header");
      setHeaderCategories(headerData);
      //console.log("Header Categories:", headerData);

      const shopData = await fetchFromBackend("/categories/shop");
      setShopCategories(shopData);
      //console.log("Shop Categories:", shopData);
    };

    fetchData();
  }, []);

  return (
    <>
      <View style={styles.container}>
        {/* Topbar */}
        <View style={[styles.topbar]}>
          <View style={[globalstyle.spaceBetween]}>
            {rightContent()}
            <View
              style={[
                globalstyle.row,
                { position: "absolute", top: 10, right: 10 },
              ]}
            >
              {/* search button */}
              {/* <TouchableOpacity
              style={[globalstyle.spaceBetween, styles.searchBar]}
            >
              <Text
                style={[globalstyle.text, { color: "#414141", fontSize: 15 }]}
              >
                Search...
              </Text>
              <AntDesign name="search1" size={20} color="#414141" />
            </TouchableOpacity> */}

              {/* Cart Icon */}
              <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
                <AntDesign
                  name="shoppingcart"
                  size={22}
                  color="#fff"
                  style={{ marginRight: 25 }}
                />
                {cartItems.length > 0 && (
                  <View
                    style={{
                      backgroundColor: "#227CF4",
                      width: 17,
                      height: 17,
                      borderRadius: 50,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "absolute",
                      top: -5,
                      right: 10,
                    }}
                  >
                    <Text
                      style={[
                        globalstyle.text,
                        {
                          color: "#fff",
                          marginTop: -4,
                          fontSize: 14,
                          fontFamily: "Mada_Bold",
                        },
                      ]}
                    >
                      {cartItems.length}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              {/* Category Icon */}
              <TouchableOpacity
                onPress={() => {
                  setShowCategoryBox((prevOpen) => !prevOpen);
                  setShowUserBox(false);
                }}
              >
                {showCategoryBox ? (
                  <AntDesign name="close" size={18} color="#fff" />
                ) : (
                  <Octicons name="three-bars" size={18} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      {showCategoryBox && (
        <View style={[globalstyle.shadowBox, styles.box2]}>
          {shopCategories.length > 0 &&
            shopCategories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={{ marginVertical: 2 }}
                onPress={() => {
                  navigation.navigate("Filter", { cat: cat });
                  setShowCategoryBox(false);
                }}
              >
                <Text style={[globalstyle.text, styles.boxList]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          {headerCategories.length > 0 &&
            headerCategories.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={{ marginVertical: 2 }}
                onPress={() => {
                  navigation.navigate("Filter", { cat: cat });
                  setShowCategoryBox(false);
                }}
              >
                <Text style={[globalstyle.text, , styles.boxList]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    //marginTop: 50,
    //marginHorizontal: 10,
    // marginBottom: 50,
  },
  topbar: {
    height: 100,
    paddingHorizontal: 15,
    paddingVertical: 10,
    paddingTop: 40,
    backgroundColor: "#000",
    // borderRadius: 4,
    position: "absolute",
    width: "100%",
    zIndex: 50,
  },
  searchBar: {
    borderWidth: 0.8,
    borderColor: "#315593",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    width: 200,
  },
  box: {
    position: "absolute",
    top: 110,
    right: 25,
    padding: 10,
    backgroundColor: "#fff",
    zIndex: 30,
  },
  box2: {
    position: "absolute",
    top: 110,
    right: 15,
    padding: 10,
    backgroundColor: "#fff",
    zIndex: 30,
  },
  boxList: {
    fontSize: 13,
    paddingVertical: 5,
    textTransform: "uppercase",
  },
});

export default TopBar;
