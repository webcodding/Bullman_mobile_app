import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import TopBar from "../../components/Bar/TopBar";
import Logo from "../../assets/img/logo.webp";
import { globalstyle } from "../../styles/globalstyle";
import PrevButton from "../../components/Button/PrevButton";
import ShipImg from "../../assets/img/ship-img-3.jpg";
import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import { fetchFromBackend } from "../../utils/api";
import Loader from "../../components/loader/loader";
import PricingSection from "../../components/Product/PricingSection";
import Tabs from "../../components/Product/Tabs";
import Specification from "../../components/Product/Specification";
import MostViewedProduct from "../../components/Product/MostViewedProduct";

const ProductDetail = ({ navigation, route }) => {
  const Product = route.params.product;
  const id = Product.id;
  //console.log(id);

  const [productDetail, setProductDetail] = useState(null);
  const [variants, setVariants] = useState(null);
  const [specification, setSpecification] = useState(null);
  const [extraImg, setExtraImg] = useState(null);
  const [desc, setDesc] = useState(null);
  const [guarantyTxt, setGuarantyTxt] = useState(null);
  const [shippingTxt, setShippingTxt] = useState(null);
  const [paymentTxt, setPaymentTxt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(
    productDetail?.extra_images[0] || Product.image1
  );

  useEffect(() => {
    const fetchData = async () => {
      const detail = await fetchFromBackend(`/product/${id}`);

      setProductDetail(detail);
      setExtraImg(detail.extra_images);
      setVariants(
        detail.variant_id ? detail.variant_id : detail.variant_details
      );
      setSpecification(detail.specifications);
      // console.log(detail);
      setDesc(detail.description);
      setGuarantyTxt(detail.guarantee_text);
      setShippingTxt(detail.shipping_text);
      setPaymentTxt(detail.payment_text);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    Image.prefetch(Product.image1);
  }, [Product.image1]);

  if (
    loading &&
    !productDetail &&
    !variants &&
    !specification &&
    !desc &&
    !guarantyTxt &&
    !shippingTxt &&
    !paymentTxt
  ) {
    return <Loader />;
  }

  const parseWeight = (poids) => {
    const weightMatch = poids.match(/(\d+(\.\d+)?)/);
    return weightMatch ? parseFloat(weightMatch[0]) : 0;
  };

  const calculateTotalWeight = () => {
    if (typeof variants === "number") {
      return 0; // or some default weight
    }

    return Object.entries(variants).reduce((total, [key, value]) => {
      if (value.Poids) {
        const weight = parseWeight(value.Poids);
        return total + weight * (variantQuantities[key] || 0);
      }
      return total;
    }, 0);
  };

  const maxWeight = variants
    ? Object.entries(variants).reduce((max, [key, value]) => {
        if (value.Poids) {
          const weight = parseWeight(value.Poids);
          return max + weight * 10; // Adjust this multiplier based on your logic
        }
        return max;
      }, 0)
    : 0;

  return (
    <View style={styles.container}>
      <TopBar
        navigation={navigation}
        rightContent={() => (
          <View style={[globalstyle.row, { marginTop: 5 }]}>
            <PrevButton navigation={navigation} />
            <Image
              source={Logo}
              style={{
                width: 120,
                height: 50,
                objectFit: "contain",
                marginLeft: 20,
              }}
            />
          </View>
        )}
      />

      {/* Main content */}
      <ScrollView style={styles.mainContainer}>
        {/* title */}
        <Text style={[globalstyle.text, styles.title]}>{Product.name}</Text>
        {/* product Image */}
        <Image source={{ uri: selectedImage }} style={[styles.productImg]} />
        {/* Select image */}
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 20, marginHorizontal: 15 }}
        >
          {productDetail?.extra_images.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedImage(item)}
            >
              <Image
                src={item}
                style={{
                  width: 55,
                  height: 55,
                  marginHorizontal: 10,
                  borderWidth: selectedImage === item ? 1 : 0.5,
                  borderColor: selectedImage === item ? "#227CF4" : "#acacad",
                  // padding: 10,
                }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Free shipping mark */}
        {/* <View
          style={[
            globalstyle.row,
            {
              marginHorizontal: 20,
              marginVertical: 20,
              borderWidth: 1,
              borderColor: "#315593",
              padding: 3,
              width: 115,
              justifyContent: "center",
            },
          ]}
        >
          <Image source={ShipImg} style={{ width: 20, height: 20 }} />
          <Text
            style={[
              globalstyle.text,
              { color: "#315593", fontSize: 12, marginLeft: 5 },
            ]}
          >
            Livraison gratuite
          </Text>
        </View> */}
        {/* Pricing Section */}
        <View style={{ marginTop: 20 }}>
          <PricingSection
            variants={variants}
            Product={Product}
            productDetail={productDetail}
            id={id}
          />
        </View>
        {/* Tab section */}
        <Tabs
          desc={desc}
          guarantyTxt={guarantyTxt}
          shippingTxt={shippingTxt}
          paymentTxt={paymentTxt}
        />
        {/* Specificatin */}
        {specification && <Specification specification={specification} />}
        {/* Most Viewed Product */}
        <MostViewedProduct navigation={navigation} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContainer: {
    marginTop: 110,
    marginBottom: 30,
  },
  title: {
    fontSize: 34,
    fontFamily: "Mada_Bold",
    textTransform: "uppercase",
    letterSpacing: -1.3,
    paddingHorizontal: 20,
  },
  productImg: {
    width: "100%",
    height: 300,
    backgroundColor: "#fafafc",
  },
});

export default ProductDetail;
