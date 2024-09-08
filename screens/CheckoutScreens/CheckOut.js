import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import TopBar from "../../components/Bar/TopBar";
import { globalstyle } from "../../styles/globalstyle";
import PrevButton from "../../components/Button/PrevButton";
import Slug from "../../components/Slug";
import Address from "./Address";
import BlueButton from "../../components/Button/BlueButton";
import Shipping from "./Shipping";
import stripe from "../../assets/img/stripe.png";

import apple from "../../assets/img/apple.png";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import BlackRadioBtn from "../../components/Button/BlackRadioButton";
import {
  BASE_DOMAIN,
  BASE_LOCAL_DOMAIN,
  STRIPE_PUBLIC_KEY,
} from "../../Config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../../context/AuthContext";

const CheckOut = ({ navigation, route }) => {
  const amount = route.params.amount;
  const productDetails = route.params.productDetails;
  const shippingCharge = route.params.shippingCharge;
  const { auth } = useContext(AuthContext);
  //console.log(route.params);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [activeTab, setActiveTab] = useState("ADDRESS");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [shippingMethod, setShippingMethod] = useState(null);
  const [allAddress, setAllAddress] = useState({
    deliver_address: {},
    billing_address: {},
  });

  const handlePaymentSelect = async (option) => {
    setSelectedPayment(option);
  };
  console.log(allAddress);
  console.log(shippingMethod);
  console.log(selectedPayment);
  const handlePaymentSubmit = async (event) => {
    //event.preventDefault();
    //setLoading(true);

    if (amount > 5 && selectedPayment && auth.user) {
      const submitData = {
        allAddress,
        selectedPayment,
        shippingCharge,
        shippingMethod,
        productDetails,
        userId: auth.user._id,
      };
      if (selectedPayment === "apple_pay") {
        // Apple Pay payment
      } else {
        try {
          const response = await fetch(
            `${BASE_DOMAIN}/stripe-payment/create-payment-intent`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                amount: amount * 100, // Convert amount to cents
              }),
            }
          );
          if (response.ok) {
            await AsyncStorage.setItem("orderData", JSON.stringify(submitData));
          }
          const { clientSecret } = await response.json();

          const { error } = await initPaymentSheet({
            paymentIntentClientSecret: clientSecret,
            merchantDisplayName: "Bullman Equipment",
            applePay: true,
            googlePay: true,
            style: "automatic",
            testEnv: true,
          });

          if (!error) {
            const { error: paymentError } = await presentPaymentSheet();
            if (paymentError) {
              console.log(paymentError);
              Alert.alert(` ${paymentError.message}`);
            } else {
              Alert.alert("Success", "Your payment was successful!");
              navigation.navigate("Orders");
            }
          } else {
            console.log(error);
            Alert.alert(`Error: ${error.message}`);
          }
        } catch (error) {
          Alert.alert("Error", "Something went wrong during payment.");
          console.error(error);
        }
      }
    } else {
      window.alert("Please Add a Cart item to create an order");
    }
  };

  return (
    <StripeProvider publishableKey={STRIPE_PUBLIC_KEY}>
      <View style={styles.container}>
        <TopBar
          navigation={navigation}
          rightContent={() => (
            <View style={[globalstyle.row, { marginTop: 5 }]}>
              <PrevButton navigation={navigation} />
              <Slug slug={"Check Out"} />
            </View>
          )}
        />
        {/* Tabs */}

        <View style={styles.tabContainer}>
          <View
            style={[styles.tab, activeTab === "ADDRESS" && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "ADDRESS"
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              1.ADRESSE
            </Text>
          </View>
          <View
            style={[styles.tab, activeTab === "SHIPPING" && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "SHIPPING"
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              2.EXPÉDITION
            </Text>
          </View>
          <View
            style={[styles.tab, activeTab === "PAYMENT" && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "PAYMENT"
                  ? styles.activeTabText
                  : styles.inactiveTabText,
              ]}
            >
              3.PAIEMENT
            </Text>
          </View>
        </View>

        {/* Tabs Content */}

        {activeTab === "ADDRESS" && (
          <Address
            navigation={navigation}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setAllAddress={setAllAddress}
          />
        )}
        {activeTab === "SHIPPING" && (
          <Shipping
            setActiveTab={setActiveTab}
            shippingMethod={shippingMethod}
            setShippingMethod={setShippingMethod}
          />
        )}
        {activeTab === "PAYMENT" && (
          <>
            <View style={styles.paymentContainer}>
              <Text
                style={[
                  styles.headingText,
                  {
                    borderBottomWidth: 1.5,
                    borderColor: "black",
                    paddingBottom: 5,
                  },
                ]}
              >
                choisir le mode de paiement
              </Text>

              <View style={[{ marginTop: 40 }]}>
                {/* apple pay */}
                {/* <TouchableOpacity
                  style={[
                    globalstyle.row,
                    {
                      marginBottom: 15,
                    },
                  ]}
                  onPress={() => handlePaymentSelect("apple_pay")}
                >
                  <BlackRadioBtn
                    selectedOption={selectedPayment}
                    matchText={"apple_pay"}
                  />
                  <Image source={apple} style={{ width: 75, height: 55 }} />
                </TouchableOpacity> */}
                {/* stripe pay */}
                <TouchableOpacity
                  onPress={() => handlePaymentSelect("stripe")}
                  style={[globalstyle.row, { marginBottom: 15 }]}
                >
                  <BlackRadioBtn
                    selectedOption={selectedPayment}
                    matchText={"stripe"}
                  />
                  <Image source={stripe} style={{ width: 75, height: 40 }} />
                </TouchableOpacity>
              </View>
            </View>
            <BlueButton
              text={"continuer"}
              textStyle={{ fontSize: 22 }}
              style={{ height: 55 }}
              onclick={() => handlePaymentSubmit()}
            />
          </>
        )}
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    marginTop: 85,
    backgroundColor: "#000",
    width: "100%",
    justifyContent: "space-between",
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20.2,
    // Black background
  },
  tabText: {
    fontFamily: "Mada_SemiBold",
    fontSize: 17,
    textAlign: "center",
  },
  activeTab: {
    borderBottomWidth: 5,
    borderBottomColor: "#888888", // White border for the active tab
  },
  activeTabText: {
    color: "#ffffff", // White text for active tab
  },
  inactiveTabText: {
    color: "#888888", // Faded gray text for inactive tabs
  },
  paymentContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  headingText: {
    marginTop: 20,
    fontFamily: "Mada_Bold",
    fontSize: 22,
    textTransform: "uppercase",
  },
  optionContainer: {
    flexDirection: "column", // Arrange items in a column
    alignItems: "flex-start",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15, // Add space between the options
  },
});

export default CheckOut;
