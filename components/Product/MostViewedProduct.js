import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { globalstyle } from "../../styles/globalstyle";
import { fetchFromBackend } from "../../utils/api";

const MostViewedProduct = ({ navigation, containerStyle }) => {
  const [products, setProducts] = useState([]);
  // console.log(products);

  useEffect(() => {
    const fetchData = async () => {
      const mostViewedProducts = await fetchFromBackend(
        "/most-viewed-products"
      );
      setProducts(mostViewedProducts);
      // console.log("Shop by Categories:", shopByCategoriesData);
    };

    fetchData();
  }, []);

  if (products.length > 0) {
    return (
      <View style={[styles.container, containerStyle && containerStyle]}>
        <Text style={[styles.header]}>Produits les plus consultés</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {products.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.box]}
              onPress={() =>
                navigation.navigate("ProductDetail", { product: item })
              }
            >
              <Image src={item.image} style={styles.img} />
              <Text style={[globalstyle.text, styles.title]}>{item.name}</Text>
              <Text style={[globalstyle.text, styles.price]}>
                {item.price}€
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 20,
  },
  header: { fontFamily: "Mada_SemiBold", fontSize: 17 },
  img: {
    width: 180,
    height: 165,
  },
  box: {
    width: 180,
    marginRight: 10,
  },
  title: {
    fontSize: 9,
    fontFamily: "Mada_SemiBold",
  },
  price: {
    fontSize: 12,
    fontFamily: "Mada_Bold",
  },
});

export default MostViewedProduct;
