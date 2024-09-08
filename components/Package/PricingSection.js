import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { globalstyle } from "../../styles/globalstyle";
import BlueButton from "../Button/BlueButton";
import Fontisto from "react-native-vector-icons/Fontisto";
import { useCart } from "../../context/CartContext";

const PricingSection = ({ products, pack, navigation, packId, packImg }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [totalPriceInclTax, setTotalPriceInclTax] = useState(
    pack.price_incl_tax
  );
  const [totalPriceExclTax, setTotalPriceExclTax] = useState(
    pack.price_excl_tax
  );
  const [totalShippingCharge, setTotalShippingCharge] = useState(0);
  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  useEffect(() => {
    setTotalPriceInclTax((pack.price_incl_tax * quantity).toFixed(2));
    setTotalPriceExclTax((pack.price_excl_tax * quantity).toFixed(2));

    // Calculate total shipping charge
    const totalShipping = products.reduce((acc, item) => {
      return acc + (item.shipping_charges || 0);
    }, 0);

    setTotalShippingCharge(totalShipping);
  }, [quantity, pack.price_incl_tax, pack.price_excl_tax]);

  const generateUniqueKey = () => {
    return `${pack.name}-${packId}`;
  };
  const totalShipping = products.reduce((acc, item) => {
    return acc + (item.shipping_charges || 0);
  }, 0);

  const handleAddToCart = () => {
    const productToAdd = {
      name: pack.name,
      image: packImg,
      priceInclTax: totalPriceInclTax,
      priceExclTax: totalPriceExclTax,
      quantity: quantity,
      variants: "package",
      selectedVariants: [],
      uniqueKey: generateUniqueKey(),
      productId: packId,
      shipping_charge: totalShipping,
      totalWeight: pack.weight,
    };

    console.log(productToAdd);

    addToCart(productToAdd);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.contains}> Ce pack contient</Text>
      <View
        style={[
          {
            marginHorizontal: 20,
            flexDirection: "column",
            fontFamily: "Mada_Medium",
            fontSize: 8,
            borderBottomWidth: 1,
            borderBottomColor: "#acacad",
            marginTop: 10,
            paddingBottom: 15,
          },
        ]}
      >
        {products &&
          products.map((item, index) => (
            <View
              key={index}
              style={[
                globalstyle.row,
                {
                  paddingVertical: 10,
                  borderRightWidth: 0.6,
                  borderRightColor: "#dedfe0",
                  marginRight: 20,
                },
              ]}
            >
              <View
                style={[
                  globalstyle.row,
                  { justifyContent: "space-between", width: "100%" },
                ]}
              >
                <Image src={item.product_image} style={styles.img} />
                <Text style={[globalstyle.text, styles.mediumText]}>
                  {item.product_name}
                </Text>
                <Text
                  style={[
                    globalstyle.text,
                    {
                      fontSize: 17,
                      fontFamily: "Mada_SemiBold",
                      paddingLeft: 10,
                      paddingRight: 10,
                    },
                  ]}
                >
                  {item.product_price} €
                </Text>
              </View>
              <Text
                style={[
                  globalstyle.text,
                  {
                    fontSize: 15,
                    fontFamily: "Mada_Medium",
                    paddingLeft: 10,
                    paddingRight: 10,
                  },
                ]}
              >
                x1
              </Text>
            </View>
          ))}
      </View>
      <View
        style={[
          {
            marginHorizontal: 20,
            marginTop: 10,
            flexDirection: "column",
          },
        ]}
      >
        <View style={[globalstyle.row, { justifyContent: "space-between" }]}>
          <Text
            style={[
              styles.totalPrice,
              { fontSize: 18, fontFamily: "Mada_Medium" },
            ]}
          >
            Prix ​​total:
          </Text>
          {/* quantity */}
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
        {/* Total price */}

        <View style={[globalstyle.row]}>
          {/* two digit after decimal */}
          <Text style={[styles.totalPrice]}>{totalPriceInclTax} €</Text>
          <Text style={[styles.taxText]}>ttc.</Text>
          <Text style={[styles.totalPrice2]}>{totalPriceExclTax} €</Text>
          <Text style={[styles.taxText]}>ht.</Text>
        </View>
      </View>
      <View style={{ marginHorizontal: 20, marginTop: 15 }}>
        <BlueButton text={"Ajouter au panier"} onclick={handleAddToCart} />
      </View>
      {/* whislist button */}
      {/* <View style={[globalstyle.row, { marginHorizontal: 20, marginTop: 15 }]}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  contains: {
    marginTop: 20,
    fontFamily: "Mada_Medium",
    fontSize: 20,
    opacity: 0.7,
    marginHorizontal: 20,
  },
  img: {
    width: 45,
    height: 45,
    borderWidth: 0.4,
    borderColor: "#dedfe0",
  },
  price: {
    fontFamily: "Mada_Bold",
    fontSize: 24,
  },
  quantityBox: {
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#acacad",
    width: 40,
    height: 40,
    marginLeft: 10,
  },
  mediumText: {
    fontSize: 12,
    fontFamily: "Mada_Medium",
    width: 195,
    //paddingTop: 16,
  },
  quantityBox2: {
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#acacad",
    width: 30,
    height: 30,
    marginLeft: 10,
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
