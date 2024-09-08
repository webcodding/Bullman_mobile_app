import React, { Component } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";

const SearchBar = ({ searchQuery, setSearchQuery, setSearchProducts }) => {
  console.log(searchQuery);
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="SEARCH"
        placeholderTextColor="#8a8988"
        style={[styles.input]}
        value={searchQuery ? searchQuery : ""}
        onChangeText={(e) => {
          setSearchQuery(e);
          setSearchProducts([]);
        }}
      />
      <Fontisto
        name="search"
        size={24}
        color="#fff"
        style={{ marginLeft: 5, opacity: 0.8 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#3f403d",
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "90%",
    color: "#fff",
    fontSize: 17,
    fontFamily: "Mada_Medium",
  },
});

export default SearchBar;
