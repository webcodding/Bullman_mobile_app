import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { globalstyle } from "../../styles/globalstyle";
import TopBar from "../../components/Bar/TopBar";
import PrevButton from "../../components/Button/PrevButton";
import Slug from "../../components/Slug";
import CategoriesSection from "../../components/sections/CategoriesSection";
import PacksSection from "../../components/sections/PacksSection";
import { fetchFromBackend } from "../../utils/api";
import Loader from "../../components/loader/loader";
import SearchBar from "../../components/Bar/SearchBar";
import SearchFilterProducts from "../../components/sections/SearchProducts";

const SearchProducts = ({ navigation }) => {
  const [shopByCategories, setShopByCategories] = useState([]);
  const [packs, setPacks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProducts, setSearchProducts] = useState([]);
  const [noProducts, setNoProducts] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const shopByCategoriesData = await fetchFromBackend(
        "/sections/shop_by_categories"
      );
      setShopByCategories(shopByCategoriesData);
      // console.log("Shop by Categories:", shopByCategoriesData);

      const packsData = await fetchFromBackend("/our/packs");
      setPacks(packsData.products);
      //console.log("Packs:", packsData);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSearchData = async () => {
      if (searchQuery !== "") {
        setLoading(true);
        const searchData = await fetchFromBackend(
          `/search/product/${searchQuery}`
        );
        setSearchProducts(searchData || []);
        setLoading(false);
        // console.log(searchData);
      }
    };

    const debounceFetch = setTimeout(fetchSearchData, 1500);

    return () => clearTimeout(debounceFetch);
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchProducts.length === 0) {
        setNoProducts(true);
      }
    }, 10000); // 8 seconds

    return () => clearTimeout(timer);
  }, [searchProducts, loading]);

  //  console.log(searchQuery);

  return (
    <View style={styles.container}>
      <TopBar
        navigation={navigation}
        rightContent={() => (
          <View style={[globalstyle.row, { marginTop: 5 }]}>
            <PrevButton navigation={navigation} />
            <Slug slug={"Products"} />
          </View>
        )}
      />

      {/* Serach Bar */}
      <View style={{ marginTop: 100 }}>
        <SearchBar
          searchQuery={searchQuery}
          searchProducts={searchProducts}
          setSearchQuery={setSearchQuery}
          setSearchProducts={setSearchProducts}
        />
      </View>
      {/* search products || categories and packs */}
      {searchQuery !== "" ? (
        loading ? (
          <Loader />
        ) : searchProducts && searchProducts.length > 0 ? (
          <SearchFilterProducts
            searchProducts={searchProducts}
            searchQuery={searchQuery}
            navigation={navigation}
          />
        ) : noProducts ? (
          <View>
            <Text style={[globalstyle.text]}>
              No products found with this search!
            </Text>
          </View>
        ) : null
      ) : shopByCategories.length > 0 && packs.length > 0 ? (
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 10 }}
          showsVerticalScrollIndicator={false}
        >
          <CategoriesSection
            shopByCategories={shopByCategories}
            navigation={navigation}
          />
          <PacksSection packs={packs} navigation={navigation} />
        </ScrollView>
      ) : (
        <Loader />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});

export default SearchProducts;
