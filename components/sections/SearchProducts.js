import React, { Component, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { globalstyle } from "../../styles/globalstyle";
import { LinearGradient } from "expo-linear-gradient";
import Loader from "../loader/loader";
import SmallProductCard from "../Card/SmallProductCards";
import FilterSidebar from "../Sidebar/FilterSidebar";

const SearchFilterProducts = ({ searchProducts, searchQuery, navigation }) => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sorts, setSorts] = useState([
    "Nom, A à Z",
    "Nom, Z à A",
    "Prix, croissant",
    "Prix, décroissant",
  ]);
  const [selectedSort, setSelectedSort] = useState(sorts[0]);

  const handleSortClick = async (item) => {
    setSelectedSort(item);
    setShowFilterModal(false);
  };

  const sortedProducts = [...searchProducts].sort((a, b) => {
    switch (selectedSort) {
      case "Nom, A à Z":
        return a.name.localeCompare(b.name);
      case "Nom, Z à A":
        return b.name.localeCompare(a.name);
      case "Prix, croissant":
        return a.price - b.price;
      case "Prix, décroissant":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  //console.log(sortedProducts);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
      style={styles.productContainer}
    >
      <SmallProductCard
        product={item}
        image={item.image}
        navigation={navigation}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text
        style={[
          globalstyle.text,
          {
            marginTop: 10,
            paddingHorizontal: 20,
            fontFamily: "Mada_Bold",
            textTransform: "uppercase",
            fontSize: 22,
          },
        ]}
      >
        Résultats de recherche pour "{searchQuery}"
      </Text>
      {/* product length and Filter button */}
      <View
        style={[
          globalstyle.row,
          { justifyContent: "space-between", paddingHorizontal: 20 },
        ]}
      >
        {/* product length */}
        <View style={[globalstyle.row]}>
          <Text
            style={[
              globalstyle.text,
              { fontFamily: "Mada_SemiBold", fontSize: 14 },
            ]}
          >
            Showing {searchProducts.length}
          </Text>
          <Text style={[globalstyle.text, { fontSize: 14 }]}>Products</Text>
        </View>
        {/* Filter button */}
        <TouchableOpacity onPress={() => setShowFilterModal(true)}>
          <LinearGradient
            colors={["#f5f6f7", "#dbdbdb"]}
            start={{ x: 0.5, y: 0.3 }}
            end={{ x: 0.5, y: 1 }}
            style={[styles.filterbtn]}
          >
            <Text
              style={[
                globalstyle.text,
                {
                  textTransform: "uppercase",
                  fontFamily: "Mada_SemiBold",
                  fontSize: 17,
                },
              ]}
            >
              Filter
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <FilterSidebar
        isVisible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        sorts={sorts}
        handleSortClick={handleSortClick}
        selectedSort={selectedSort} // Pass selectedSort
        sidebarStyle={{ top: -50 }}
      />

      {/* Filtered products */}

      <FlatList
        data={sortedProducts}
        renderItem={renderProduct}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  productList: {
    paddingHorizontal: 10,
    marginTop: 20,
    paddingBottom: 120,
  },
  productContainer: {
    flex: 1,
    margin: 5,
    //borderWidth: 1,
    //borderColor: "#eee",
    maxWidth: Dimensions.get("window").width / 2 - 20, // Adjust width for each product
  },
  filterbtn: {
    borderWidth: 1,
    borderColor: "#c2c3c4",
    borderRadius: 2,
    paddingHorizontal: 35,
    paddingVertical: 7,
  },
});

export default SearchFilterProducts;
