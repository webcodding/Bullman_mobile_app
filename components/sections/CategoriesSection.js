import React, { Component, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { globalstyle } from "../../styles/globalstyle";
import { fetchFromBackend } from "../../utils/api";

const CategoriesSection = ({ navigation, shopByCategories }) => {
  return (
    <View style={styles.container}>
      <Text style={[globalstyle.text, { fontFamily: "Mada_Bold" }]}>
        ACHETEZ PAR CATÉGORIES
      </Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={[{ marginTop: 10, paddingHorizontal: 0 }]}
      >
        {shopByCategories.map((item, index) => (
          <TouchableOpacity
            style={[globalstyle.column, styles.catBox]}
            key={index}
            onPress={() => {
              navigation.navigate("Filter", { cat: item });
            }}
          >
            <Image src={item.image} style={{ width: 120, height: 120 }} />
            <Text
              style={[
                globalstyle.text,
                {
                  fontSize: 9,
                  textTransform: "uppercase",
                  fontFamily: "Mada_SemiBold",
                },
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  catBox: {
    width: 120,
    height: 140,
    marginRight: 20,
    // marginHorizontal: 10,
    // marginBottom: 8,
  },
});

export default CategoriesSection;
