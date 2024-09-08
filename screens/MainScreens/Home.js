import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  FlatList,
} from "react-native";

import Logo from "../../assets/img/logo.webp";
import TopBar from "../../components/Bar/TopBar";
import ProductCard from "../../components/Card/ProductCard";
import Loader from "../../components/loader/loader";
import { fetchFromBackend } from "../../utils/api";
import CategoriesSection from "../../components/sections/CategoriesSection";

const Home = ({ navigation }) => {
  const [bestSellerId, setBestSellerId] = useState(null);
  const [products, setProducts] = useState([]);
  const [shopByCategories, setShopByCategories] = useState([]);

  useEffect(() => {
    if (bestSellerId) {
      const getCategoryProducts = async () => {
        const categoryProducts = await fetchFromBackend(
          `/best-seller-products`
        );
        //console.log(categoryProducts);
      };

      //getCategoryProducts();
    }

    const getProducts = async () => {
      const categoryProducts = await fetchFromBackend(`/categories/60`);
      // console.log(categoryProducts);
      setProducts(categoryProducts.products);
    };

    //fetchData();
    getProducts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const shopByCategoriesData = await fetchFromBackend(
        "/sections/shop_by_categories"
      );
      setShopByCategories(shopByCategoriesData);
      // console.log("Shop by Categories:", shopByCategoriesData);
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <TopBar
        navigation={navigation}
        rightContent={() => (
          <Image
            source={Logo}
            style={{ width: 120, height: 50, objectFit: "contain" }}
          />
        )}
      />

      {/* {products && products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductCard product={item} navigation={navigation} />
          )}
          keyExtractor={(item, index) => index.toString()}
          style={{
            flex: 1,
            //paddingHorizontal: 10,
            marginTop: 120,
            marginBottom: 70,
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Loader />
      )} */}

      <ScrollView
        style={{
          flex: 1,
          //paddingHorizontal: 10,
          marginTop: 100,
          marginBottom: 70,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 10 }}>
          <CategoriesSection
            shopByCategories={shopByCategories}
            navigation={navigation}
          />
        </View>
        {products && products.length > 0 ? (
          products.map((item, index) => (
            <ProductCard key={index} product={item} navigation={navigation} />
          ))
        ) : (
          <Loader />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafc",
  },
});

export default Home;
