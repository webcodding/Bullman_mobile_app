import React, { Component } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";

const Loader = () => {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#414141" />
    </View>
  );
};

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    marginTop: 100,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Loader;
