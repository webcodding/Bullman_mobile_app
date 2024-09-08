import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

const WhiteRadioBtn = ({ selectedOption, matchText }) => {
  return (
    <View style={[styles.radioCircle]}>
      <View style={[selectedOption === matchText && styles.selectedRadio]} />
    </View>
  );
};

const styles = StyleSheet.create({
  radioCircle: {
    height: 22, // Reduce the size of the radio button
    width: 22, // Reduce the size of the radio button
    borderRadius: 50, // Make the border-radius half of the width/height
    borderWidth: 2,
    borderColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
    padding: 3,
  },
  selectedRadio: {
    backgroundColor: "#fff",
    width: 12,
    height: 12,
    borderRadius: 50,
  },
});

export default WhiteRadioBtn;
