import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import TopBar from "../../components/Bar/TopBar";
import { globalstyle } from "../../styles/globalstyle";
import PrevButton from "../../components/Button/PrevButton";
import Slug from "../../components/Slug";
import Loader from "../../components/loader/loader";
import AuthContext from "../../context/AuthContext";
import { fetchFromBackend } from "../../utils/api";

const OrderDetails = ({ navigation, route }) => {
  const orderId = route.params.id;
  const { auth } = useContext(AuthContext);
  const [orderDetail, setOrderDetail] = useState(null);
  const userId = auth.user._id;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      const userOrderDetail = await fetchFromBackend(
        `/get-single-orders/user/${userId}/order/${orderId}`
      );
      console.log(userOrderDetail);
      if (userOrderDetail) {
        setOrderDetail(userOrderDetail);
      }
    };
    fetchOrderDetails();
  }, []);

  const TrackingSlider = ({ status }) => {
    const checkCircle = () => (
      <View style={styles.circleChecked}>
        <Text style={styles.icon}>✓</Text>
      </View>
    );
    const crossCircle = () => (
      <View style={styles.circleUnchecked}>
        <Text style={styles.iconCross}>!</Text>
      </View>
    );
    const normalCircle = () => <View style={styles.circleNormal}></View>;

    const blueLine = () => <View style={styles.blueLine}></View>;

    const normalLine = () => <View style={styles.normalLine}></View>;

    return (
      <View style={styles.trackingContainer}>
        {/* Row 1 */}
        <View style={styles.row}>
          {/* Order Received */}
          <View style={styles.column}>
            {checkCircle()}
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Order received</Text>
            </View>
          </View>
          {blueLine()}
          {/* Ready */}
          <View style={[styles.column, { marginLeft: -18 }]}>
            {["ready", "partial_delivered", "done", "cancel"].includes(status)
              ? checkCircle()
              : normalCircle()}
            <View style={styles.labelContainer}>
              <Text style={styles.label}>Ready</Text>
            </View>
          </View>
          {["ready", "partial_delivered", "done", "cancel"].includes(status)
            ? blueLine()
            : normalLine()}
          {/* Partial Deliver */}
          {status === "partial_delivered" && (
            <>
              <View style={[styles.column, { marginLeft: -18 }]}>
                {["partial_delivered", "done", "cancel"].includes(status)
                  ? checkCircle()
                  : normalCircle()}
                <View style={styles.labelContainer}>
                  <Text style={styles.label}>Partial Delivered</Text>
                </View>
              </View>
              {["partial_delivered", "done", "cancel"].includes(status)
                ? blueLine()
                : normalLine()}
            </>
          )}
          {/* Shipped */}
          <View style={[styles.column, { marginLeft: -18 }]}>
            {status === "done"
              ? checkCircle()
              : status === "cancel"
              ? crossCircle()
              : normalCircle()}
            <View style={styles.labelContainer}>
              <Text style={styles.label}>
                {status === "cancel" ? "Cancelled" : "Shipped"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopBar
        navigation={navigation}
        rightContent={() => (
          <View style={[globalstyle.row, { marginTop: 5 }]}>
            <PrevButton navigation={navigation} />
            <Slug slug={"Ordre Details"} />
          </View>
        )}
      />
      {orderDetail ? (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.main}>
          <Text style={[styles.headingText]}>Order Details</Text>
          <View
            style={{
              borderTopWidth: 1.5,
              borderColor: "black",
              marginTop: 5,
              paddingTop: 15,
            }}
          >
            <View style={[globalstyle.row]}>
              <Text style={styles.normalText}> Commande passée le: </Text>
              <Text
                style={[
                  globalstyle.text,
                  globalstyle.primaryColor,
                  { fontFamily: "Mada_SemiBold", fontSize: 17 },
                ]}
              >
                {orderDetail.ecom_create_date}
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <View style={[globalstyle.row]}>
                <Text style={styles.sideText}>• Transporteur: </Text>
                <Text style={[styles.Text, { textTransform: "uppercase" }]}>
                  {" "}
                  {orderDetail.shipping}{" "}
                </Text>
              </View>
              <View style={[globalstyle.row]}>
                <Text style={styles.sideText}>• Mode de paiement: </Text>
                <Text style={[styles.Text, { textTransform: "uppercase" }]}>
                  {" "}
                  {orderDetail.payment_method}{" "}
                </Text>
              </View>
              <View style={[globalstyle.row, styles.payment]}>
                <Text style={styles.normalText}> État du paiement </Text>
                <Text style={styles.status}> Accepté </Text>
              </View>
            </View>
            {/* Order Tracking Slider */}
            <View style={{ paddingHorizontal: 20 }}>
              <TrackingSlider status={orderDetail.delivery_status} />
            </View>

            {/* product-prices */}
            <View
              style={[
                {
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 6,
                  elevation: 3,
                },
                styles.productBox,
              ]}
            >
              <View
                style={[
                  globalstyle.row,
                  {
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    width: "100%",
                    borderBottomWidth: 1,
                    borderBottomColor: "#eee",
                    paddingVertical: 10,
                  },
                ]}
              >
                <Text style={styles.headerText}>Produit</Text>
                <Text style={styles.headerText}>Quantité</Text>
                <Text style={styles.headerText}>Prix unitaire</Text>
                <Text style={styles.headerText}>Prix total</Text>
              </View>

              {orderDetail.items.map((item, index) => (
                <View
                  style={[
                    globalstyle.row,
                    {
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                      paddingVertical: 5,
                    },
                  ]}
                >
                  <Text
                    style={[
                      globalstyle.text,
                      styles.productText,
                      { textAlign: "left", fontSize: 11 },
                    ]}
                  >
                    {item.name}
                  </Text>
                  <Text
                    style={[
                      globalstyle.text,
                      styles.productText,
                      { textAlign: "left", paddingLeft: 20 },
                    ]}
                  >
                    {item.qty}
                  </Text>
                  <Text style={[globalstyle.text, styles.productText]}>
                    {item.price_unit} €
                  </Text>
                  <Text style={[globalstyle.text, styles.productText]}>
                    {item.price_incl_tax} €
                  </Text>
                </View>
              ))}
              <View
                style={[
                  globalstyle.column,
                  {
                    alignItems: "flex-end",
                  },
                ]}
              >
                <View
                  style={[
                    globalstyle.row,
                    {
                      borderBottomWidth: 1,
                      borderBottomColor: "#eee",
                      borderLeftWidth: 1,
                      borderLeftColor: "#eee",
                      paddingVertical: 10,
                      paddingLeft: 5,
                    },
                  ]}
                >
                  <Text style={[styles.headerText, { width: 130 }]}>
                    Frais de livraison
                  </Text>
                  <Text
                    style={[
                      globalstyle.text,
                      styles.productText,
                      { textAlign: "right" },
                    ]}
                  >
                    {orderDetail.shipping_charges} €
                  </Text>
                </View>

                <View
                  style={[
                    globalstyle.row,
                    {
                      paddingVertical: 5,
                      borderLeftWidth: 1,
                      borderLeftColor: "#eee",
                      paddingLeft: 5,
                      paddingVertical: 10,
                    },
                  ]}
                >
                  <Text style={[styles.headerText, { width: 130 }]}>Total</Text>
                  <Text
                    style={[
                      globalstyle.text,
                      styles.productText,
                      { textAlign: "right" },
                    ]}
                  >
                    {orderDetail.order_total} €
                  </Text>
                </View>
              </View>
            </View>

            {/* Replace "ready" with the actual status */}
            <View style={[globalstyle.row, styles.delivery]}>
              <View style={{ width: "49%" }}>
                <Text style={[styles.mediumText, { marginBottom: 5 }]}>
                  {" "}
                  Delivery Address{" "}
                </Text>
                <Text style={styles.text}>
                  {" "}
                  {orderDetail.delivery_address.name}
                </Text>
                <Text style={styles.text}>
                  {" "}
                  {orderDetail.delivery_address.street}
                </Text>
                <Text style={styles.text}>
                  {" "}
                  {orderDetail.delivery_address.zip}{" "}
                  {orderDetail.delivery_address.city}{" "}
                </Text>
                <Text style={styles.text}>
                  {" "}
                  {orderDetail.delivery_address.country}
                </Text>
                <Text style={styles.text}>
                  {" "}
                  {orderDetail.delivery_address.phone
                    ? orderDetail.delivery_address.phone
                    : null}{" "}
                </Text>
              </View>
              <View
                style={{
                  width: "51%",
                  paddingLeft: 10,
                  borderLeftWidth: 0.6,
                  borderColor: "#acacad",
                }}
              >
                <Text style={[styles.mediumText, { marginBottom: 5 }]}>
                  {" "}
                  Billing Address{" "}
                </Text>
                <Text style={styles.text}>
                  {" "}
                  {orderDetail.billing_address.name}
                </Text>
                <Text style={styles.text}>
                  {" "}
                  {orderDetail.billing_address.street}
                </Text>
                <Text style={styles.text}>
                  {" "}
                  {orderDetail.delivery_address.zip}{" "}
                  {orderDetail.billing_address.city}
                </Text>
                <Text style={styles.text}>
                  {orderDetail.billing_address.country}
                </Text>
                <Text style={styles.text}>
                  {" "}
                  {orderDetail.billing_address.phone
                    ? orderDetail.billing_address.phone
                    : null}{" "}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <Loader />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  main: {
    marginHorizontal: 20,
    marginTop: 90,
  },
  headingText: {
    marginTop: 20,
    fontFamily: "Mada_Bold",
    fontSize: 22,
    textTransform: "uppercase",
  },
  normalText: {
    fontFamily: "Mada_Medium",
    fontSize: 17,
  },
  sideText: {
    fontFamily: "Mada_SemiBold",
    fontSize: 15,
    marginLeft: 10,
  },
  payment: {
    marginTop: 20,
    justifyContent: "space-between",
    backgroundColor: "#f2f4f5",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  status: {
    backgroundColor: "#227CF4",
    color: "#fff",
    fontFamily: "Mada_Bold",
    borderRadius: 3,
    paddingHorizontal: 3,
  },
  Text: {
    fontFamily: "Mada_Regular",
    fontSize: 17,
  },
  mediumText: {
    fontFamily: "Mada_SemiBold",
    fontSize: 17,
  },
  text: {
    fontFamily: "Mada_Regular",
    fontSize: 14,
  },
  delivery: {
    justifyContent: "space-between",
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    paddingHorizontal: 5,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    paddingVertical: 10,
  },
  trackingContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
  },
  circleChecked: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#227CF4", // navyBlue color
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#227CF4",
  },
  circleUnchecked: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#d1d1d1",
  },
  circleNormal: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "#d1d1d1",
  },
  blueLine: {
    height: 4,
    width: "20%",
    backgroundColor: "#227CF4",
    marginLeft: -18,
    marginTop: -15,
  },
  normalLine: {
    height: 4,
    width: "20%",
    backgroundColor: "#d1d1d1",
    marginLeft: -18,
    marginTop: -15,
  },
  labelContainer: {
    marginTop: 5,
    alignItems: "center",
  },
  label: {
    fontFamily: "Mada_Medium",
    fontSize: 10,
    width: 70,
    color: "#333",
    textAlign: "center",
  },
  icon: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: -5,
  },
  iconCross: {
    color: "#ff0000",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: -5,
  },
  productBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    borderRadius: 5,
    marginTop: 20,
  },
  headerText: {
    fontFamily: "Mada_SemiBold",
    fontSize: 14,
    width: 90,
  },
  productText: {
    fontSize: 13,
    width: 90,
    textAlign: "center",
  },
});

export default OrderDetails;
