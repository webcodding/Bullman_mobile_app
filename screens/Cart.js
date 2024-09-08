import React, { Component, useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { globalstyle } from "../styles/globalstyle";
import TopBar from "../components/Bar/TopBar";
import { AntDesign, Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import PrevButton from "../components/Button/PrevButton";
import Slug from "../components/Slug";
import { useCart } from "../context/CartContext";
import ShipImg from "../assets/img/ship-img-3.jpg";
import BlueButton from "../components/Button/BlueButton";
import MostViewedProduct from "../components/Product/MostViewedProduct";
import AuthContext from "../context/AuthContext";

const Cart = ({ navigation }) => {
  //console.log(cartItems);
  const { auth } = useContext(AuthContext);
  const { cartItems, removeFromCart } = useCart();
  const [promo, setPromo] = useState("");
  const [quantities, setQuantities] = useState({});
  const [isExpanded, setIsExpanded] = useState(true);
  const [totalWithoutVAT, setTotalWithoutVAT] = useState(0);
  const [totalVAT, setTotalVAT] = useState(0);
  const [totalWithVAT, setTotalWithVAT] = useState(0); // Set initial state to true to show items by default
  const [totalShippingCharge, setTotalShippingCharge] = useState(0);

  const [amount, setAmount] = useState(0);
  const [totalProductWeight, setTotalProductWeight] = useState(null);
  const [totalPackWeight, setTotalPackWeight] = useState(null);
  const [productDetails, setProductDetails] = useState([]);
  const [shippingCharge, setShippingCharge] = useState(0);

  //console.log(cartItems);

  useEffect(() => {
    const initialQuantities = {};
    cartItems.forEach((item) => {
      if (item.selectedVariants.length > 0) {
        item.selectedVariants.forEach((variant) => {
          const variantKey = Object.keys(variant).find(
            (key) => key !== "priceInclTax" && key !== "quantity"
          );
          initialQuantities[`${item.name}-${variant[variantKey]}`] =
            variant.quantity;
        });
      } else {
        initialQuantities[item.name] = item.quantity;
      }
    });
    setQuantities(initialQuantities);
  }, [cartItems]);

  useEffect(() => {
    calculateTotals();
  }, [quantities, cartItems]);

  const calculateTotals = () => {
    let totalWithoutVAT = 0;
    let totalVAT = 0;
    let totalWithVAT = 0;
    let totalWeight = 0;
    let totalPackWeight = 0;
    let totalShippingCharge = 0; // Initialize total shipping charge
    const productDetails = [];

    cartItems.forEach((item) => {
      if (item.selectedVariants.length > 0) {
        item.selectedVariants.forEach((variant) => {
          const variantKey = Object.keys(variant).find(
            (key) => key !== "priceInclTax" && key !== "quantity"
          );
          const itemKey = `${item.name}-${variant[variantKey]}`;
          const variantQuantity = quantities[itemKey] || variant.quantity;

          // Calculate price
          const itemTotalExclVAT = variant.priceExclTax * variantQuantity;
          const itemTotalInclVAT = variant.priceInclTax * variantQuantity;

          totalWithoutVAT += itemTotalExclVAT;
          totalWithVAT += itemTotalInclVAT;
          totalVAT += itemTotalInclVAT - itemTotalExclVAT;

          // Calculate weight
          const itemWeight = item.totalWeight * variantQuantity;
          totalWeight += itemWeight;

          if (item.variants === "package") {
            totalPackWeight += itemWeight;
          }

          // Calculate shipping charge
          totalShippingCharge += item.shipping_charge * variantQuantity;

          // Add to productDetails
          productDetails.push({
            id: parseInt(`${item.variants}`),
            qty: variantQuantity,
          });
        });
      } else {
        const itemQuantity = quantities[item.name] || item.quantity;

        // Calculate price
        const itemTotalExclVAT = item.priceExclTax * itemQuantity;
        const itemTotalInclVAT = item.priceInclTax * itemQuantity;

        totalWithoutVAT += itemTotalExclVAT;
        totalWithVAT += itemTotalInclVAT;
        totalVAT += itemTotalInclVAT - itemTotalExclVAT;

        // Calculate weight
        const itemWeight = item.totalWeight * itemQuantity;
        totalWeight += itemWeight;

        if (item.variants === "package") {
          totalPackWeight += itemWeight;
          productDetails.push({
            id: parseInt(`${item.productId}`),
            qty: itemQuantity,
          });
        } else {
          // Add to productDetails
          productDetails.push({
            id: parseInt(`${item.variants}`),
            qty: itemQuantity,
          });
        }

        // Calculate shipping charge
        totalShippingCharge += item.shipping_charge * itemQuantity;
      }
    });

    // Add totalShippingCharge to totalWithoutVAT and totalWithVAT
    totalWithoutVAT += totalShippingCharge;
    totalWithVAT += totalShippingCharge;

    setTotalWithoutVAT(totalWithoutVAT.toFixed(2));
    setTotalVAT(totalVAT.toFixed(2));
    setTotalWithVAT(totalWithVAT.toFixed(2));
    setTotalProductWeight(totalWeight.toFixed(2));
    setTotalPackWeight(totalPackWeight.toFixed(2));

    setTotalShippingCharge(totalShippingCharge.toFixed(2)); // Set total shipping charge

    // Set product details
    setProductDetails(productDetails);
    setShippingCharge(totalShippingCharge);
    setAmount(parseInt(totalWithVAT));
  };

  const increaseQuantity = (itemKey) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemKey]: (prevQuantities[itemKey] || 0) + 1,
    }));
  };

  const decreaseQuantity = (itemKey) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemKey]:
        (prevQuantities[itemKey] || 1) > 1 ? prevQuantities[itemKey] - 1 : 1,
    }));
  };

  const handleContinue = () => {
    if (auth.user) {
      navigation.navigate("CheckOut", {
        shippingCharge: shippingCharge,
        productDetails: productDetails,
        amount: amount,
      });
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TopBar
          navigation={navigation}
          rightContent={() => (
            <View style={[globalstyle.row, { marginTop: 5 }]}>
              <PrevButton navigation={navigation} />
              <Slug slug={"Cart"} />
            </View>
          )}
        />

        {/* Top content */}
        <Text
          style={[
            globalstyle.text,
            {
              marginTop: 110,
              fontFamily: "Mada_Bold",
              fontSize: 24,
              paddingHorizontal: 20,
            },
          ]}
        >
          VOTRE PANIER
        </Text>
        {cartItems.length > 0 ? (
          <>
            <Text
              style={[
                globalstyle.text,
                {
                  marginTop: 5,
                  fontFamily: "Mada_Regular",
                  fontSize: 20,
                  paddingHorizontal: 20,
                },
              ]}
            >
              {cartItems.length} articles
            </Text>
            <ScrollView
              style={{
                flex: 1,
                paddingHorizontal: 20,
                marginBottom: 10,
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* Orderd product */}
              <View style={{ borderBottomWidth: 1, paddingBottom: 30 }}>
                {cartItems.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      globalstyle.column,
                      styles.main,
                      { alignItems: "flex-start" },
                    ]}
                  >
                    {item.selectedVariants.length > 0 ? (
                      item.selectedVariants.map((variant) => {
                        const variantKey = Object.keys(variant).find(
                          (key) => key !== "priceInclTax" && key !== "quantity"
                        );

                        return (
                          <View key={variant[variantKey]}>
                            {/* Product Top content */}
                            <View
                              style={[
                                globalstyle.row,
                                {
                                  justifyContent: "flex-start",
                                  alignItems: "flex-start",
                                },
                              ]}
                            >
                              <Image src={item.image} style={[styles.image]} />
                              <View
                                style={[
                                  globalstyle.column,
                                  {
                                    alignItems: "flex-start",
                                    justifyContent: "flex-start",
                                    width: "82%",
                                  },
                                ]}
                              >
                                <Text style={[styles.name, , { width: 240 }]}>
                                  {item.name}
                                </Text>
                                <Text style={[styles.normalText]}>
                                  {variantKey}: {variant[variantKey]}
                                </Text>

                                <View
                                  style={[
                                    globalstyle.row,
                                    {
                                      justifyContent: "space-between",
                                      marginTop: 15,
                                      width: "87%",
                                    },
                                  ]}
                                >
                                  {/* shipping charge */}
                                  <View
                                    style={[
                                      globalstyle.row,
                                      styles.shippingContainer,
                                    ]}
                                  >
                                    <Image
                                      source={ShipImg}
                                      style={{ width: 15, height: 15 }}
                                    />
                                    <Text
                                      style={[
                                        globalstyle.text,
                                        {
                                          color: "#315593",
                                          fontSize: 10,
                                          marginLeft: 5,
                                        },
                                      ]}
                                    >
                                      Livraison{" "}
                                      {item.shipping_charge > 0
                                        ? `${item.shipping_charge} €`
                                        : "gratuite"}
                                    </Text>
                                  </View>
                                  {/* cart item delete button */}
                                  <TouchableOpacity
                                    onPress={() =>
                                      removeFromCart(item.uniqueKey)
                                    }
                                  >
                                    <Text
                                      style={[
                                        styles.normalText,
                                        {
                                          textDecorationLine: "underline",
                                          color: "#de1627",
                                        },
                                      ]}
                                    >
                                      Retirer
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                            {/* Product Bottom content */}
                            <View
                              style={[
                                globalstyle.row,
                                styles.bottomContent,
                                {
                                  justifyContent: "space-between",
                                  width: "100%",
                                },
                              ]}
                            >
                              <View style={[globalstyle.row]}>
                                {/* (-) */}
                                <TouchableOpacity
                                  style={[
                                    globalstyle.row,
                                    styles.quantityBox2,
                                    { marginLeft: 0 },
                                  ]}
                                  onPress={() =>
                                    decreaseQuantity(
                                      `${item.name}-${variant[variantKey]}`
                                    )
                                  }
                                >
                                  <Entypo
                                    name="minus"
                                    size={24}
                                    color="#787272"
                                  />
                                </TouchableOpacity>
                                {/* (Num) */}
                                <View
                                  style={[globalstyle.row, styles.quantityBox]}
                                >
                                  <Text style={[globalstyle.text]}>
                                    {
                                      quantities[
                                        `${item.name}-${variant[variantKey]}`
                                      ]
                                    }
                                  </Text>
                                </View>
                                {/* (+) */}
                                <TouchableOpacity
                                  style={[globalstyle.row, styles.quantityBox2]}
                                  onPress={() =>
                                    increaseQuantity(
                                      `${item.name}-${variant[variantKey]}`
                                    )
                                  }
                                >
                                  <Entypo name="plus" size={24} color="black" />
                                </TouchableOpacity>
                              </View>
                              <View style={[globalstyle.column, styles.price]}>
                                <View style={[globalstyle.row]}>
                                  <Text
                                    style={[
                                      {
                                        fontFamily: "Mada_SemiBold",
                                        fontSize: 16,
                                      },
                                    ]}
                                  >
                                    €
                                    {(
                                      parseInt(variant.priceInclTax) *
                                      (quantities[
                                        `${item.name}-${variant[variantKey]}`
                                      ] || variant.quantity)
                                    ).toFixed(2)}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.normalText,
                                      { marginLeft: 2 },
                                    ]}
                                  >
                                    ttc.
                                  </Text>
                                </View>
                                <View style={[globalstyle.row]}>
                                  <Text
                                    style={[
                                      {
                                        fontFamily: "Mada_Medium",
                                        fontSize: 14,
                                      },
                                    ]}
                                  >
                                    €
                                    {(
                                      parseInt(variant.priceExclTax) *
                                      (quantities[
                                        `${item.name}-${variant[variantKey]}`
                                      ] || variant.quantity)
                                    ).toFixed(2)}
                                  </Text>
                                  <Text
                                    style={[
                                      styles.normalText,
                                      { marginLeft: 2 },
                                    ]}
                                  >
                                    ht.
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        );
                      })
                    ) : (
                      <>
                        {/* Product Top content */}
                        <View
                          style={[
                            globalstyle.row,
                            {
                              justifyContent: "flex-start",
                              alignItems: "flex-start",
                            },
                          ]}
                        >
                          <Image src={item.image} style={[styles.image]} />
                          <View
                            style={[
                              {
                                alignItems: "flex-start",
                                justifyContent: "flex-start",
                                //width: "82%",
                              },
                            ]}
                          >
                            <Text style={[styles.name, { width: 240 }]}>
                              {item.name}
                            </Text>
                            <View
                              style={[
                                globalstyle.row,
                                {
                                  justifyContent: "space-between",
                                  marginTop: 15,
                                  width: "87%",
                                },
                              ]}
                            >
                              {/* shipping charge */}
                              <View
                                style={[
                                  globalstyle.row,
                                  styles.shippingContainer,
                                ]}
                              >
                                <Image
                                  source={ShipImg}
                                  style={{ width: 15, height: 15 }}
                                />
                                <Text
                                  style={[
                                    globalstyle.text,
                                    {
                                      color: "#315593",
                                      fontSize: 10,
                                      marginLeft: 5,
                                    },
                                  ]}
                                >
                                  Livraison{" "}
                                  {item.shipping_charge > 0
                                    ? `${item.shipping_charge} €`
                                    : "gratuite"}
                                </Text>
                              </View>
                              {/* cart item delete button */}
                              <TouchableOpacity
                                onPress={() => removeFromCart(item.uniqueKey)}
                              >
                                <Text
                                  style={[
                                    styles.normalText,
                                    {
                                      textDecorationLine: "underline",
                                      color: "#de1627",
                                    },
                                  ]}
                                >
                                  Retirer
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                        {/* Product Bottom content */}
                        <View
                          style={[
                            globalstyle.row,
                            styles.bottomContent,
                            { justifyContent: "space-between", width: "100%" },
                          ]}
                        >
                          <View style={[globalstyle.row]}>
                            {/* (-) */}
                            <TouchableOpacity
                              onPress={() => decreaseQuantity(item.name)}
                              style={[
                                globalstyle.row,
                                styles.quantityBox2,
                                { marginLeft: 0 },
                              ]}
                            >
                              <Entypo name="minus" size={24} color="#787272" />
                            </TouchableOpacity>
                            {/* (Num) */}
                            <View style={[globalstyle.row, styles.quantityBox]}>
                              <Text style={[globalstyle.text]}>
                                {quantities[item.name]}
                              </Text>
                            </View>
                            {/* (+) */}
                            <TouchableOpacity
                              onPress={() => increaseQuantity(item.name)}
                              style={[globalstyle.row, styles.quantityBox2]}
                            >
                              <Text
                                style={[
                                  globalstyle.text,
                                  { fontFamily: "Mada_Bold", fontSize: 22 },
                                ]}
                              >
                                <Entypo name="plus" size={24} color="black" />
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View style={[globalstyle.column, styles.price]}>
                            <View style={[globalstyle.row]}>
                              <Text
                                style={[
                                  { fontFamily: "Mada_SemiBold", fontSize: 16 },
                                ]}
                              >
                                €
                                {(
                                  parseInt(item.priceInclTax) *
                                  (quantities[item.name] || item.quantity)
                                ).toFixed(2)}
                              </Text>
                              <Text
                                style={[styles.normalText, { marginLeft: 2 }]}
                              >
                                ttc.
                              </Text>
                            </View>
                            <View style={[globalstyle.row]}>
                              <Text
                                style={[
                                  { fontFamily: "Mada_Medium", fontSize: 14 },
                                ]}
                              >
                                €
                                {(
                                  parseInt(item.priceExclTax) *
                                  (quantities[item.name] || item.quantity)
                                ).toFixed(2)}
                              </Text>
                              <Text
                                style={[styles.normalText, { marginLeft: 2 }]}
                              >
                                ht.
                              </Text>
                            </View>
                          </View>
                        </View>
                      </>
                    )}
                  </View>
                ))}
              </View>
              {/* Totals */}
              <View
                style={[
                  globalstyle.column,
                  {
                    marginTop: 30,
                    backgroundColor: "#f2f3f5",
                    paddingHorizontal: 5,
                  },
                ]}
              >
                {/* Bottom Content */}
                <View style={[globalstyle.row, styles.heading]}>
                  <Text style={[styles.headingText]}>Poids :</Text>
                  <Text style={[styles.headingText2]}>
                    {totalProductWeight}Kg
                  </Text>
                </View>
                <View style={[globalstyle.row, styles.heading]}>
                  <Text style={[styles.headingText]}>Livraison :</Text>
                  <Text style={[styles.headingText2]}>
                    {totalShippingCharge > 0
                      ? `${totalShippingCharge} €`
                      : "Gratuit"}
                  </Text>
                </View>
                <View style={[globalstyle.row, styles.heading]}>
                  <Text style={[styles.headingText]}>TVA :</Text>
                  <Text style={[styles.headingText2]}>{totalVAT}€</Text>
                </View>
                <View style={[globalstyle.row, styles.heading]}>
                  <Text style={[styles.headingText]}>Total HT :</Text>
                  <Text style={[styles.headingText2]}>{totalWithoutVAT}€</Text>
                </View>
                <View style={[globalstyle.row, styles.heading]}>
                  <Text style={[styles.headingText]}>Total TTC :</Text>
                  <Text style={[styles.headingText2]}>{totalWithVAT}€</Text>
                </View>
              </View>
              {/* Most Viewed Product */}
              <MostViewedProduct
                containerStyle={{ paddingHorizontal: 0 }}
                navigation={navigation}
              />
            </ScrollView>
            <BlueButton
              text={"vérifier"}
              textStyle={{ fontSize: 22 }}
              style={{ height: 55 }}
              onclick={() => handleContinue()}
            />
          </>
        ) : (
          <Text
            style={[
              globalstyle.text,
              {
                marginTop: 5,
                fontFamily: "Mada_Regular",
                fontSize: 20,
                paddingHorizontal: 20,
              },
            ]}
          >
            Aucun article de panier !
          </Text>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  main: {
    borderTopWidth: 0.8,
    borderColor: "#acacad",
    marginTop: 30,
  },
  image: {
    marginTop: 20,
    marginRight: 15,
    width: 70,
    height: 70,
    backgroundColor: "#f2f5f5",
  },
  name: {
    marginTop: 15,
    fontFamily: "Mada_SemiBold",
    fontSize: 14,
  },

  normalText: {
    fontFamily: "Mada_Regular",
    fontSize: 13,
  },
  quantityBox2: {
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#acacad",
    width: 40,
    height: 45,
    marginLeft: 10,
    //marginTop: 16,
  },
  quantityBox: {
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#acacad",
    width: 55,
    height: 45,
    marginLeft: 10,
    //marginTop: 16,
  },
  bottomContent: {
    marginTop: 20,
    backgroundColor: "#f2f5f5",
    padding: 10,
  },
  heading: {
    justifyContent: "space-between",
    width: "100%",
    borderBottomWidth: 0.8,
    borderColor: "#acacad",
    paddingBottom: 5,
    marginBottom: 15,
  },
  headingText: {
    fontFamily: "Mada_Medium",
    fontSize: 18,
  },
  headingText2: {
    fontFamily: "Mada_SemiBold",
    fontSize: 20,
  },
  shippingContainer: {
    borderWidth: 1,
    borderColor: "#315593",
    width: 100,
    justifyContent: "center",
    marginTop: 8,
  },
});

export default Cart;
