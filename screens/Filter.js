import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import TopBar from "../components/Bar/TopBar";
import PrevButton from "../components/Button/PrevButton";
import { globalstyle } from "../styles/globalstyle";
import Slug from "../components/Slug";
import { fetchFromBackend } from "../utils/api";
import ProductCard from "../components/Card/ProductCard";
import Loader from "../components/loader/loader";
import SmallProductCard from "../components/Card/SmallProductCards";
import { LinearGradient } from "expo-linear-gradient";
import FilterSidebar from "../components/Sidebar/FilterSidebar";

const FilterScreen = ({ navigation, route }) => {
  const cat = route.params.cat;
  const catId = cat.id;
  const [products, setProducts] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const [showSorts, setShowSorts] = useState(false);
  const [filters, setFilters] = useState(null);
  const [subCategories, setSubCategories] = useState(null);
  const [promotions, setPromotions] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 2960]);
  const [weightRange, setWeightRange] = useState([0, 200]);
  const [loading, setLoading] = useState(true);
  const [sorts, setSorts] = useState([
    "Nom, A à Z",
    "Nom, Z à A",
    "Prix, croissant",
    "Prix, décroissant",
  ]);
  const [selectedSort, setSelectedSort] = useState(sorts[0]);
  const [fetchingProducts, setFetchingProducts] = useState(false);

  const price = `${priceRange[0]}-${priceRange[1]}`;
  const weight = `${weightRange[0]}-${weightRange[1]}`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setProducts([]); // Clear previous products
      setSelectedSort([sorts[0]]);
      setSelectedSubCategory(null);
      setSelectedPromotion(null);
      const catProduct = await fetchFromBackend(`/categories/${catId}`);
      setFilters(catProduct.filters);
      setProducts(catProduct.products);
      setSubCategories(catProduct.filters.subcategories);
      setPromotions(catProduct.filters.delivery_promotions);
      setPriceRange([0, catProduct.filters.max_price]);
      setWeightRange([0, catProduct.filters.max_weight]);
      setLoading(false);
    };

    fetchData();
  }, [catId]);

  useEffect(() => {
    let fetchTimeout;

    const fetchSortedProducts = async () => {
      const sortedProducts = await fetchFromBackend(
        `/categories/${catId}/subcategory/${selectedSubCategory}/promotion/${selectedPromotion}/limit/60/order/name/asc/price/${price}/weight/${weight}`
      );
      // console.log(sortedProducts);
      setProducts(sortedProducts.products);
      // setTotalPages(Math.ceil(sortedProducts.products.length / selectedLimit));
      setFetchingProducts(false);
    };

    if (!loading && selectedSort) {
      setFetchingProducts(true);
      fetchTimeout = setTimeout(fetchSortedProducts, 500);
    }

    return () => {
      clearTimeout(fetchTimeout);
      setFetchingProducts(false);
    };
  }, [
    selectedSubCategory,
    selectedPromotion,
    selectedSort,
    price,
    weight,
    loading,
  ]);

  const handleSortClick = async (item) => {
    setSelectedSort(item);
    setShowFilterModal(false);
  };

  const handleSubcategoryChange = (item) => {
    setSelectedSubCategory(item);
    setShowFilterModal(false);
  };

  const handlePromotionChange = (item) => {
    setSelectedPromotion(item);
    setShowFilterModal(false);
  };

  // Sort products based on selectedSort
  const sortedProducts = [...products].sort((a, b) => {
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

  // Slice the sorted products array to get the current products for the page

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
      style={styles.productContainer}
    >
      <SmallProductCard product={item} navigation={navigation} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopBar
        navigation={navigation}
        rightContent={() => (
          <View style={[globalstyle.row, { marginTop: 5 }]}>
            <PrevButton navigation={navigation} />
            <Slug slug={`${cat.name}`} />
          </View>
        )}
      />
      {/* Category name */}
      <Text
        style={[
          globalstyle.text,
          {
            marginTop: 110,
            paddingHorizontal: 20,
            fontFamily: "Mada_Bold",
            textTransform: "uppercase",
            fontSize: 22,
          },
        ]}
      >
        {cat.name}
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
            Showing {products.length}
          </Text>
          <Text style={[globalstyle.text, { fontSize: 14 }]}> Products</Text>
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
        subCategories={subCategories}
        sorts={sorts}
        promotions={promotions}
        handleSubcategoryChange={handleSubcategoryChange}
        handleSortClick={handleSortClick}
        handlePromotionChange={handlePromotionChange}
        selectedSort={selectedSort} // Pass selectedSort
        selectedSubCategory={selectedSubCategory} // Pass selectedSubCategory
        selectedPromotion={selectedPromotion} // Pass selectedPromotion
      />
      {/* Filtered products */}
      {loading || fetchingProducts ? (
        <Loader />
      ) : products && products.length > 0 && sortedProducts.length > 0 ? (
        <FlatList
          data={sortedProducts}
          renderItem={renderProduct}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={[globalstyle.row, { justifyContent: "center" }]}>
          <Text style={[globalstyle.text]}>No Products with this filter.</Text>
        </View>
      )}
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

export default FilterScreen;
