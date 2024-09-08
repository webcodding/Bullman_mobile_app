import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { globalstyle } from "../../styles/globalstyle";
import FastImage from "react-native-fast-image";

const SmallProductCard = ({ product, navigation, image }) => {
  const [currentImage, setCurrentImage] = useState(product.image1);
  const [loading, setLoading] = useState(true);

  const handlePressLeft = () => {
    setCurrentImage(product.image1);
  };

  const handlePressRight = () => {
    setCurrentImage(product.image2);
  };

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <View style={[styles.card]}>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.leftSide}
          onPress={handlePressLeft}
          activeOpacity={0.7}
        />
        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color="#000" />
          </View>
        )}
        <Image
          source={{ uri: image ? image : currentImage }}
          style={styles.productImg}
          onLoad={handleImageLoad}
        />
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
      <View style={[styles.bottomBox]}>
        <Text style={[globalstyle.text, styles.name]}>{product.name}</Text>
        <View style={[globalstyle.row]}>
          <Text style={[globalstyle.text, styles.price]}>
            €{product.price}{" "}
          </Text>
          <Text style={[globalstyle.text, styles.price, { color: "#acacad" }]}>
            ttc.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 240,
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
    height: 220,
    backgroundColor: "#fafafc",
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
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
    backgroundColor: "#414141",
  },
  card: {
    backgroundColor: "#fafafc",
    paddingTop: 0,
  },
  bottomBox: {
    backgroundColor: "#fff",
    width: "100%",
    height: 80,
    paddingHorizontal: 16,
    paddingVertical: 5,
    marginTop: 3,
  },
  name: {
    textTransform: "uppercase",
    fontSize: 13.4,
    fontFamily: "Mada_Medium",
    letterSpacing: -0.5,
  },
  price: {
    fontSize: 15,
    fontFamily: "Mada_SemiBold",
  },
});

export default SmallProductCard;
