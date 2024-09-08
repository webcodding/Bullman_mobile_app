import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Touchable,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { globalstyle } from "../../styles/globalstyle";
import TopBar from "../../components/Bar/TopBar";
import PrevButton from "../../components/Button/PrevButton";
import Slug from "../../components/Slug";
import OrderDetails from "../OrderHistory/OrderDetails";
import AuthContext from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createOrder, fetchFromBackend } from "../../utils/api";
import Loader from "../../components/loader/loader";
import { BASE_DOMAIN } from "../../Config/config";

const Orders = ({ navigation }) => {
  const { auth } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(true);
  const [allOrders, setAllOrders] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const orderCreatedRef = useRef(false);
  const user = auth.user || null;
  const userId = user ? user._id : null;
  //console.log(userId);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    const storedOrderData =
      JSON.parse(await AsyncStorage.getItem("orderData")) || null;

    if (storedOrderData && !orderCreatedRef.current) {
      createOrderWhenPageLoads(storedOrderData);
      orderCreatedRef.current = true;
    } else {
      console.log("No order data found in localStorage");
    }

    if (user) {
      await fetchAllOrders();
    } else {
      setAllOrders(null);
    }

    setLoading(false);
  };

  const createOrderWhenPageLoads = async (orderData) => {
    try {
      const formattedDate = new Date().toISOString().split("T")[0]; // Formats date as "2024-01-29"
      const finalData = {
        delivery_address: {
          name: `${orderData.allAddress.deliver_address.fname} ${orderData.allAddress.deliver_address.lname}`,
          street: `${orderData.allAddress.deliver_address.address}`,
          city: `${orderData.allAddress.deliver_address.city}`,
          zip: `${orderData.allAddress.deliver_address.postalCode}`,
          country: `${orderData.allAddress.deliver_address.country}`,
          phone: orderData.allAddress.deliver_address.phone,
        },
        billing_address: {
          name: `${orderData.allAddress.billing_address.fname} ${orderData.allAddress.billing_address.lname}`,
          street: `${orderData.allAddress.billing_address.address}`,
          city: `${orderData.allAddress.billing_address.city}`,
          zip: `${orderData.allAddress.deliver_address.postalCode}`,
          country: `${orderData.allAddress.billing_address.country}`,
          phone: orderData.allAddress.billing_address.phone,
        },
        shipping_charges: orderData.shippingCharge,
        confirm_order: true,
        ecom_customer_id: orderData.userId,
        shipping: orderData.shippingMethod, // gls, dachser, dpd,
        payment_method: orderData.selectedPayment,
        ecom_create_date: formattedDate, // "2024-01-29"
        product_details: orderData.productDetails,
      };
      console.log(finalData);

      // Create the order
      const orderResponse = await createOrder(finalData);
      //console.log(orderResponse);

      if (orderResponse.order_id) {
        AsyncStorage.removeItem("orderData");
        const orderId = await orderResponse.order_id;
        const orderNumber = await orderResponse.order_number;
        const updatedOrderHistory = [
          ...orderHistory,
          { orderId, orderNumber, product_details: orderData.productDetails },
        ];
        setOrderHistory(updatedOrderHistory);

        // Send the updated orderHistory array to your backend
        await saveOrderHistory(updatedOrderHistory, orderData.userId);
      } else {
        //  console.log("Failed to create order", orderCreatedData);
      }
    } catch (error) {
      console.log("An error occurred while creating the order:", error);
    }
  };

  // Function to save order history to the backend
  const saveOrderHistory = async (orderHistory, userId) => {
    try {
      const response = await fetch(`${BASE_DOMAIN}/orders/save-order-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderHistory, userId }),
      });

      if (response.ok) {
        console.log("Order history saved successfully");
      } else {
        console.log("Failed to save order history");
      }
    } catch (error) {
      console.log("An error occurred while saving the order history:", error);
    }
  };

  const fetchAllOrders = async () => {
    const userAllOrders = await fetchFromBackend(`/get-all-orders/${userId}`);
    // console.log(userAllOrders);
    if (userAllOrders) {
      // Sort the orders by item.id in descending order
      userAllOrders.items.sort((a, b) => b.id - a.id);
      setAllOrders(userAllOrders);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchInitialData();
    setRefreshing(false);
  };

  const getStatusStyle = (status) => {
    switch (status.toUpperCase()) {
      case "ASSIGNED":
        return { color: "#000000" }; // Black
      case "DONE":
        return { color: "#1E90FF" }; // Dodger Blue
      case "WAITING":
        return { color: "#FF8C00" }; // Dark Orange
      case "CANCEL":
        return { color: "#FF0000" }; // Red
      case "PARTIAL_DELIVERED":
        return { color: "#4CAF50" }; // Green
      default:
        return { color: "#000000" }; // Default black color
    }
  };

  return (
    <View style={styles.container}>
      <TopBar
        navigation={navigation}
        rightContent={() => (
          <View style={[globalstyle.row, { marginTop: 5 }]}>
            <PrevButton navigation={navigation} />
            <Slug slug={"Ordres"} />
          </View>
        )}
      />
      <View style={{ marginHorizontal: 20, marginTop: 90, marginBottom: 130 }}>
        <View
          style={{
            borderBottomWidth: 1.5,
            borderColor: "black",
            marginBottom: 10,
          }}
        >
          <Text style={styles.headingText}>Historique des commandes</Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.historyContainer}>
            {allOrders ? (
              allOrders.items.length > 0 ? (
                allOrders.items.map((item) => {
                  const statusStyle = getStatusStyle(item.delivery_status);
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("OrderDetails", { id: item.id })
                      }
                      style={styles.main}
                      key={item.id}
                    >
                      <View
                        style={[
                          globalstyle.row,
                          { justifyContent: "space-between" },
                        ]}
                      >
                        <Text style={styles.date}>{item.order_date}</Text>
                        <View style={styles.statusContainer}>
                          <Text style={[styles.status, statusStyle]}>
                            {item.delivery_status}
                          </Text>
                        </View>
                      </View>

                      <View style={[globalstyle.row]}>
                        <Text style={styles.commande}>
                          Commande: {item.number}
                        </Text>
                      </View>
                      <View style={[globalstyle.row]}>
                        <View style={{ width: 135, marginTop: 10 }}>
                          <Text style={styles.nameText}>Facture </Text>
                          <Text style={styles.normalText}>
                            {item.invoice_address}{" "}
                          </Text>
                        </View>
                        <View style={{ width: 135, marginTop: 10 }}>
                          <Text style={styles.nameText}>Total TTC </Text>
                          <Text style={styles.normalText}> €{item.total} </Text>
                        </View>
                        <View style={{ width: 135, marginTop: 10 }}>
                          <Text style={styles.nameText}>Total TVA </Text>
                          <Text style={styles.normalText}>
                            €{item.amount_tax}{" "}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })
              ) : loading ? (
                <Loader />
              ) : (
                <Text style={[globalstyle.text]}>
                  Voici les commandes que vous avez passées depuis la création
                  de votre compte.
                </Text>
              )
            ) : (
              <Text style={[globalstyle.text]}>
                Voici les commandes que vous avez passées depuis la création de
                votre compte.
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headingText: {
    marginTop: 20,
    fontFamily: "Mada_Bold",
    fontSize: 22,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  main: {
    borderRadius: 5,
    backgroundColor: "#ffffff",
    paddingHorizontal: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    paddingVertical: 10,
  },
  date: {
    fontFamily: "Mada_SemiBold",
    fontSize: 17,
    color: "#7a7e80",
    marginBottom: 10,
  },
  commande: {
    fontFamily: "Mada_Regular",
    fontSize: 16,
    paddingHorizontal: 4,
    borderColor: "black",
    borderWidth: 0.7,
  },
  statusContainer: {
    backgroundColor: "#f2f4f5",
    width: 120,
    height: 25,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  status: {
    fontFamily: "Mada_SemiBold",
    fontSize: 13,
    textTransform: "uppercase",
    textAlign: "center",
  },
  nameText: {
    fontFamily: "Mada_SemiBold",
    fontSize: 13,
  },
  normalText: {
    fontFamily: "Mada_Regular",
    fontSize: 13,
  },
});

export default Orders;
