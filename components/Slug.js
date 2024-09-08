import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { globalstyle } from "../styles/globalstyle";

const Slug = ({ slug }) => {
  return <Text style={[globalstyle.text, styles.slug]}>{slug}</Text>;
};

const styles = StyleSheet.create({
  slug: {
    color: "#fff",
    marginLeft: 15,
    fontSize: 17,
    textTransform: "uppercase",
  },
});

export default Slug;
