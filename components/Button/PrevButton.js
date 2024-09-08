import { AntDesign, Entypo } from "@expo/vector-icons";
import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const PrevButton = ({ navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Entypo
        name="chevron-left"
        size={28}
        color="#fff"
        style={{ marginTop: 0 }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});

export default PrevButton;
