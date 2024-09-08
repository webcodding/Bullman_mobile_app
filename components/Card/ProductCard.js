import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { globalstyle } from "../../styles/globalstyle";
import { LinearGradient } from "expo-linear-gradient";
import BlueButton from "../Button/BlueButton";

const ProductCard = ({ product, navigation }) => {
  const [currentImage, setCurrentImage] = useState(product.image1);

  const handlePressLeft = () => {
    setCurrentImage(product.image1);
  };

  const handlePressRight = () => {
    setCurrentImage(product.image2);
  };

  return (
    <View style={[styles.card]}>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.leftSide}
          onPress={handlePressLeft}
          activeOpacity={0.7}
        />
        <Image source={{ uri: currentImage }} style={styles.productImg} />
        <TouchableOpacity
          style={styles.rightSide}
          onPress={handlePressRight}
          activeOpacity={0.7}
        />
        <View style={styles.indicatorContainer}>
          <View
            style={[
              styles.indicator,
              currentImage === product.image1 && styles.activeIndicator,
            ]}
          />
          <View
            style={[
              styles.indicator,
              currentImage === product.image2 && styles.activeIndicator,
            ]}
          />
        </View>
      </View>
      <View style={[globalstyle.shadowBox, styles.bottomBox]}>
        <Text style={[globalstyle.text, styles.name]}>{product.name}</Text>
        <View style={[globalstyle.row]}>
          <Text style={[globalstyle.text, styles.price]}>
            €{product.price}{" "}
          </Text>
          <Text style={[globalstyle.text, styles.price, { color: "#acacad" }]}>
            ttc.
          </Text>
        </View>
        <BlueButton
          text={"ACHETEZ MAINTENANT"}
          onclick={() =>
            navigation.navigate("ProductDetail", { product: product })
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 300,
  },
  leftSide: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "50%",
    zIndex: 1,
  },
  rightSide: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: "50%",
    zIndex: 1,
  },
  productImg: {
    width: "100%",
    height: 300,
    backgroundColor: "#fafafc",
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 10,
    left: "50%",
    transform: [{ translateX: -20 }],
    flexDirection: "row",
    alignItems: "center",
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#cccccc",
    marginHorizontal: 5,
  },
  activeIndicator: {
    backgroundColor: "#227CF4",
  },
  card: {
    backgroundColor: "#fafafc",
    paddingTop: 0,
    paddingBottom: 140,
    zIndex: 20,
    position: "relative",
  },
  bottomBox: {
    backgroundColor: "#fff",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 40,
    },
    shadowRadius: 60,
    elevation: 5,
    zIndex: 30,
    position: "absolute",
    width: "100%",
    bottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  name: {
    textTransform: "uppercase",
    fontSize: 17,
    fontFamily: "Mada_ExtraBold",
    letterSpacing: -0.5,
    //marginBottom: 10,
  },
  price: {
    fontSize: 15,
    fontFamily: "Mada_SemiBold",
    marginBottom: 10,
  },
});

export default ProductCard;
