//import liraries
import React, { Component, useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { fetchFromBackend } from "../../utils/api";
import Loader from "../../components/loader/loader";
import TopBar from "../../components/Bar/TopBar";
import PrevButton from "../../components/Button/PrevButton";
import Logo from "../../assets/img/logo.webp";
import { globalstyle } from "../../styles/globalstyle";
import Tabs from "../../components/Product/Tabs";
import MostViewedProduct from "../../components/Product/MostViewedProduct";
import PricingSection from "../../components/Package/PricingSection";

// create a component
const PackageDetails = ({ navigation, route }) => {
  const packId = route.params.id;

  const [packDetails, setPackDetails] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [desc, setDesc] = useState(null);
  const [guarantyTxt, setGuarantyTxt] = useState(null);
  const [shippingTxt, setShippingTxt] = useState(null);
  const [paymentTxt, setPaymentTxt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const detail = await fetchFromBackend(`/pack/${packId}`);
      setPackDetails(detail);
      setAllProducts(detail.pack_details);
      setDesc(detail.description);
      setGuarantyTxt(detail.guarantee_text);
      setShippingTxt(detail.shipping_text);
      setPaymentTxt(detail.payment_text);
      setLoading(false);
      // console.log(detail);
    };

    fetchData();
  }, [packId]);

  if (
    loading &&
    !packDetails &&
    allProducts.length === 0 &&
    !desc &&
    !guarantyTxt &&
    !shippingTxt &&
    !paymentTxt
  ) {
    return <Loader />;
  }

  //console.log(packDetails);
  const parseWeight = (poids) => {
    const weightMatch = poids.match(/(\d+(\.\d+)?)/);
    return weightMatch ? parseFloat(weightMatch[0]) : 0;
  };

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
        <Text style={[globalstyle.text, styles.title]}>{packDetails.name}</Text>
        {/* Image */}
        <Image src={packDetails.image} style={[styles.productImg]} />
        {/* Pricing Section */}
        <PricingSection
          products={allProducts}
          pack={packDetails}
          packId={packId}
          packImg={packDetails.image}
          navigation={navigation}
        />
        {/* Tab section */}
        <Tabs
          desc={desc}
          guarantyTxt={guarantyTxt}
          shippingTxt={shippingTxt}
          paymentTxt={paymentTxt}
        />
        {/* Most Viewed Product */}
        <MostViewedProduct navigation={navigation} />
      </ScrollView>
    </View>
  );
};

// define your styles
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

//make this component available to the app
export default PackageDetails;
