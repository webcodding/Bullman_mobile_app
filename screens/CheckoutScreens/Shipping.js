import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import dachser from "../../assets/img/dachser.jpeg";
import dpd from "../../assets/img/dpd.webp";
import gls from "../../assets/img/gls.jpeg";
import { globalstyle } from "../../styles/globalstyle";
import BlueButton from "../../components/Button/BlueButton";
import ErrAlert from "../../components/Alerts/ErrAlert";
import BlackRadioBtn from "../../components/Button/BlackRadioButton";

const Shipping = ({ setActiveTab, shippingMethod, setShippingMethod }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    //setSelectedOption(option);
    setShippingMethod(option);
  };

  const handleContinue = () => {
    if (shippingMethod) {
      setActiveTab("PAYMENT");
    } else {
      return <ErrAlert text={'Please fill "*" fields!'} />;
    }
  };

  return (
    <>
      <View style={styles.container}>
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
          méthode d'expédition
        </Text>

        <View style={[{ marginTop: 40 }]}>
          <View
            style={[
              globalstyle.row,
              {
                marginBottom: 45,
                borderBottomWidth: 0.6,
                borderColor: "#acacad",
              },
            ]}
          >
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => handleSelect("gls")}
            >
              <BlackRadioBtn
                selectedOption={shippingMethod}
                matchText={"gls"}
              />
              <Image source={gls} style={{ width: 55, height: 55 }} />
              <Text style={[styles.normalText]}>GLS</Text>
              <Text style={styles.text}>45 rue Délizy, Pantin</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              globalstyle.row,
              {
                marginBottom: 30,
                borderBottomWidth: 0.6,
                borderColor: "#acacad",
                paddingBottom: 20,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => handleSelect("dachser")}
            >
              <BlackRadioBtn
                selectedOption={shippingMethod}
                matchText={"dachser"}
              />
              <Image source={dachser} style={{ width: 55, height: 20 }} />
              <Text style={styles.normalText}>DACHSER</Text>

              <Text style={styles.text}>Point Relais 24-72h</Text>
            </TouchableOpacity>
          </View>
          <View
            style={[
              globalstyle.row,
              {
                borderBottomWidth: 0.6,
                borderColor: "#acacad",
                paddingBottom: 10,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => handleSelect("dpd")}
            >
              <BlackRadioBtn
                selectedOption={shippingMethod}
                matchText={"dpd"}
              />
              <Image source={dpd} style={{ width: 55, height: 55 }} />
              <Text style={styles.normalText}> DPD Retrait en magasin </Text>
              <Text style={styles.text}>2-3 jours</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <BlueButton
        text={"continuer"}
        textStyle={{ fontSize: 22 }}
        style={{ height: 55 }}
        onclick={() => handleContinue()}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
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
    justifyContent: "space-between",
    width: "100%",
  },

  normalText: {
    fontFamily: "Mada_Medium",
    fontSize: 15,
    marginLeft: 20,
    width: 90,
    //textAlign: "center",
  },
  text: {
    fontFamily: "Mada_Medium",
    fontSize: 15,
    marginLeft: 20,
    width: 130,
    //textAlign: "center",
  },
});

export default Shipping;
