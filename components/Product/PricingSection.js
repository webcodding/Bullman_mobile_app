import React, { Component, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { globalstyle } from "../../styles/globalstyle";
import BlueButton from "../Button/BlueButton";
import { Fontisto } from "@expo/vector-icons";
import Tabs from "./Tabs";
import { useCart } from "../../context/CartContext";

const PricingSection = ({ variants, Product, productDetail, id }) => {
  const [quantity, setQuantity] = useState(1);
  const [variantQuantities, setVariantQuantities] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    if (variants && typeof variants !== "number") {
      const initialQuantities = {};
      Object.keys(variants).forEach((key) => {
        initialQuantities[key] = 0;
      });
      setVariantQuantities(initialQuantities);
    }
  }, [variants]);

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const increaseTypeQuantity = (type) => {
    setVariantQuantities((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  const decreaseTypeQuantity = (type) => {
    setVariantQuantities((prev) => ({
      ...prev,
      [type]: Math.max(prev[type] - 1, 0),
    }));
  };

  const calculateTotalPriceInclTax = () => {
    if (typeof variants === "number") {
      return productDetail.price_incl_tax * quantity;
    }
    return Object.entries(variants).reduce((total, [key, value]) => {
      return total + value.price_incl_tax * variantQuantities[key];
    }, 0);
  };

  const calculateTotalPriceExclTax = () => {
    if (typeof variants === "number") {
      return productDetail.price_excl_tax * quantity;
    }
    return Object.entries(variants).reduce((total, [key, value]) => {
      return total + value.price_excl_tax * variantQuantities[key];
    }, 0);
  };

  const generateUniqueKey = (variantKey, variantQuantity) => {
    if (typeof variants === "number") {
      return `${productDetail.name}-${quantity}`;
    }
    return `${productDetail.name}-${variantKey}-${variantQuantity}`;
  };

  const calculateProductWeight = (key = null) => {
    // Case when there's a single variant (when variants is a number)
    if (key === null && typeof variants === "number") {
      return productDetail.weight; // Assuming `weight` is a property of `product`
    }

    // Case when there are multiple variants (when variants is an object)
    if (key !== null && variants[key] && variants[key].weight) {
      return variants[key].weight;
    }

    return 0;
  };

  const handleAddToCart = () => {
    const productToAdd = {
      name: productDetail.name,
      image: productDetail.primary_image,
      priceInclTax: calculateTotalPriceInclTax(),
      priceExclTax: calculateTotalPriceExclTax(),
      quantity: quantity,
      selectedVariants: [],
      uniqueKey: generateUniqueKey(),
      productId: id,
      shipping_charge: productDetail.shipping_charges
        ? productDetail.shipping_charges
        : 0,
      totalWeight: calculateProductWeight(),
    };

    if (typeof variants === "number") {
      productToAdd.variants = JSON.stringify(variants);
      console.log(productToAdd);
      addToCart(productToAdd);
    } else {
      const productsToAdd = [];
      Object.entries(variants).forEach(([key, value]) => {
        if (variantQuantities[key] > 0) {
          productsToAdd.push({
            ...productToAdd,
            quantity: variantQuantities[key],
            variants: key,
            selectedVariants: [
              {
                ...value,
                quantity: variantQuantities[key],
                priceInclTax: value.price_incl_tax,
                priceExclTax: value.price_excl_tax,
              },
            ],
            uniqueKey: generateUniqueKey(key, variantQuantities[key]),
            totalWeight: calculateProductWeight(key),
          });
        }
      });
      productsToAdd.forEach((item) => {
        // console.log(item);
        addToCart(item);
      });
    }
  };

  return (
    <View style={styles.container}>
      {variants && typeof variants === "number" ? (
        <>
          {/* name-price-quantity */}
          <View
            style={[
              globalstyle.row,
              { marginHorizontal: 20, justifyContent: "space-between" },
            ]}
          >
            <Text
              style={[
                globalstyle.text,
                { fontSize: 14, fontFamily: "Mada_Medium", width: 150 },
              ]}
            >
              {Product.name}
            </Text>
            <View style={[globalstyle.row]}>
              <TouchableOpacity
                style={[globalstyle.row, styles.quantityBox]}
                onPress={() => decreaseQuantity()}
              >
                <Text style={[globalstyle.text]}>-</Text>
              </TouchableOpacity>
              <View style={[globalstyle.row, styles.quantityBox]}>
                <Text style={[globalstyle.text]}>{quantity}</Text>
              </View>
              <TouchableOpacity
                style={[globalstyle.row, styles.quantityBox]}
                onPress={() => increaseQuantity()}
              >
                <Text style={[globalstyle.text]}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Quantity */}
          <View
            style={[
              {
                marginHorizontal: 20,
                marginTop: 10,
                flexDirection: "column",
              },
            ]}
          >
            <Text
              style={[
                styles.totalPrice,
                { fontSize: 18, fontFamily: "Mada_Medium" },
              ]}
            >
              Prix ​​total:{" "}
            </Text>
            <View style={[globalstyle.row]}>
              <Text style={[styles.totalPrice]}>
                {" "}
                €{calculateTotalPriceInclTax().toFixed(2)}
              </Text>
              <Text style={[styles.taxText]}>ttc.</Text>
              <Text style={[styles.totalPrice2]}>
                {" "}
                €{calculateTotalPriceExclTax().toFixed(2)}
              </Text>
              <Text style={[styles.taxText]}>ht.</Text>
            </View>
          </View>
          {/* Add to cart button */}
          <View style={{ marginHorizontal: 20, marginTop: 15 }}>
            <BlueButton text={"Ajouter au panier"} onclick={handleAddToCart} />
          </View>
          {/* Add to wishlist  */}
          {/* <View
            style={[globalstyle.row, { marginHorizontal: 20, marginTop: 15 }]}
          >
            <Fontisto name="nav-icon-list" size={14} color="black" />
            <Text
              style={[
                globalstyle.text,
                {
                  fontSize: 16,
                  marginLeft: 5,
                },
              ]}
            >
              Ajouter à la liste de souhaits
            </Text>
          </View> */}
        </>
      ) : variants ? (
        <>
          {/* Variants */}
          <View
            style={[
              {
                marginHorizontal: 20,
                //flexDirection: "column",
                fontFamily: "Mada_Medium",
                fontSize: 8,
                borderBottomWidth: 1,
                borderBottomColor: "#acacad",
                paddingBottom: 15,
                //width: "100%",
              },
            ]}
          >
            {Object.entries(variants).map(([key, value]) => {
              return (
                <View
                  key={key}
                  style={[globalstyle.row, { justifyContent: "space-between" }]}
                >
                  {/* single variant name */}
                  {value.Poids ? (
                    <Text
                      style={[globalstyle.text, styles.mediumText]}
                      key={`${key}-poids`}
                    >
                      Poids: {value.Poids}
                    </Text>
                  ) : value.Couleur ? (
                    <Text
                      style={[globalstyle.text, styles.mediumText]}
                      key={`${key}-couleur`}
                    >
                      Couleur: {value.Couleur}
                    </Text>
                  ) : value.Epaisseur ? (
                    <Text
                      style={[globalstyle.text, styles.mediumText]}
                      key={`${key}-epaisseur`}
                    >
                      Epaisseur: {value.Epaisseur}
                    </Text>
                  ) : value.Stacks ? (
                    <Text
                      style={[globalstyle.text, styles.mediumText]}
                      key={`${key}-stacks`}
                    >
                      Stacks: {value.Stacks}
                    </Text>
                  ) : null}
                  {/* single variant price */}
                  <Text
                    style={[
                      globalstyle.text,
                      {
                        fontSize: 16,
                        fontFamily: "Mada_Bold",
                        paddingTop: 16,
                        paddingLeft: 10,
                      },
                    ]}
                  >
                    {value.price_incl_tax} €
                  </Text>
                  {/* single variant quantity */}

                  <View style={[globalstyle.row]}>
                    {/* (-) */}
                    <TouchableOpacity
                      onPress={() => decreaseTypeQuantity(key)}
                      style={[globalstyle.row, styles.quantityBox2]}
                    >
                      <Text style={[globalstyle.text]}>-</Text>
                    </TouchableOpacity>
                    {/* (Num) */}
                    <View style={[globalstyle.row, styles.quantityBox2]}>
                      <Text style={[globalstyle.text]}>
                        {variantQuantities[key]}
                      </Text>
                    </View>
                    {/* (+) */}
                    <TouchableOpacity
                      onPress={() => increaseTypeQuantity(key)}
                      style={[globalstyle.row, styles.quantityBox2]}
                    >
                      <Text style={[globalstyle.text]}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
          {/* Total price */}
          <View
            style={[
              {
                marginHorizontal: 20,
                marginTop: 10,
                flexDirection: "column",
              },
            ]}
          >
            <Text
              style={[
                styles.totalPrice,
                { fontSize: 18, fontFamily: "Mada_Medium" },
              ]}
            >
              Prix ​​total:{" "}
            </Text>
            <View style={[globalstyle.row]}>
              <Text style={[styles.totalPrice]}>
                {" "}
                €{calculateTotalPriceInclTax().toFixed(2)}
              </Text>
              <Text style={[styles.taxText]}>ttc.</Text>
              <Text style={[styles.totalPrice2]}>
                {" "}
                €{calculateTotalPriceExclTax().toFixed(2)}
              </Text>
              <Text style={[styles.taxText]}>ht.</Text>
            </View>
          </View>
          {/* Add to cart button */}
          <View style={{ marginHorizontal: 20, marginTop: 15 }}>
            <BlueButton text={"Ajouter au panier"} onclick={handleAddToCart} />
          </View>
          {/* Add to wishlist  */}
          {/* <View
            style={[globalstyle.row, { marginHorizontal: 20, marginTop: 15 }]}
          >
            <Fontisto name="nav-icon-list" size={14} color="black" />
            <Text
              style={[
                globalstyle.text,
                {
                  fontSize: 16,
                  marginLeft: 5,
                },
              ]}
            >
              Ajouter à la liste de souhaits
            </Text>
          </View> */}
        </>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  price: {
    fontFamily: "Mada_Bold",
    fontSize: 24,
  },
  quantityBox: {
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#acacad",
    width: 35,
    height: 35,
    marginLeft: 5,
  },
  mediumText: {
    fontSize: 13,
    fontFamily: "Mada_Medium",
    width: 120,
    paddingTop: 16,
  },
  quantityBox2: {
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#acacad",
    width: 35,
    height: 35,
    marginLeft: 5,
    marginTop: 16,
  },
  totalPrice: {
    fontSize: 20,
    fontFamily: "Mada_ExtraBold",
  },
  totalPrice2: { marginLeft: 20, fontFamily: "Mada_SemiBold", fontSize: 18 },
  taxText: {
    fontSize: 16,
    fontFamily: "Mada_Light",
    marginLeft: 5,
  },
});

export default PricingSection;
