//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { globalstyle } from "../../styles/globalstyle";

const ErrAlert = ({ text }) => {
  return (
    <View style={styles.container}>
      <Text style={[globalstyle.text]}>{text}</Text>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 30,
    shadowOpacity: 1,
    elevation: 10,
    position: "absolute",
    padding: 15,
    paddingVertical: 30,
    top: "40%",
    left: "25%",
    zIndex: 80,
    height: "auto",
    width: 200,
  },
});

//make this component available to the app
export default ErrAlert;
