import React, { Component, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import BlueButton from "../../components/Button/BlueButton";
import stripe from "../../assets/img/stripe.png";
import apple from "../../assets/img/apple.png";
import ErrAlert from "../../components/Alerts/ErrAlert";
import { globalstyle } from "../../styles/globalstyle";

const Payment = ({ navigation }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
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
          choisir le mode de paiement
        </Text>

        <View
          style={[
            globalstyle.column,
            { marginTop: 40, alignItems: "flex-start" },
          ]}
        >
          <View
            style={[
              globalstyle.row,
              {
                marginBottom: 10,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => handleSelect("gls")}
            >
              <View
                style={[
                  styles.radioCircle,
                  selectedOption === "gls" && styles.selectedRadio,
                ]}
              />
              <Image source={apple} style={{ width: 95, height: 75 }} />
            </TouchableOpacity>
          </View>
          <View style={[globalstyle.row]}>
            <TouchableOpacity
              style={styles.radioButton}
              onPress={() => handleSelect("dachser")}
            >
              <View
                style={[
                  styles.radioCircle,
                  selectedOption === "dachser" && styles.selectedRadio,
                ]}
              />
              <Image source={stripe} style={{ width: 95, height: 50 }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <BlueButton
        text={"continuer"}
        textStyle={{ fontSize: 22 }}
        style={{ height: 55 }}
        onclick={() => navigation.navigate("Orders")}
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
  },
  radioCircle: {
    height: 22, // Reduce the size of the radio button
    width: 22, // Reduce the size of the radio button
    borderRadius: 9, // Make the border-radius half of the width/height
    borderWidth: 2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  selectedRadio: {
    backgroundColor: "blue",
  },
});

export default Payment;
