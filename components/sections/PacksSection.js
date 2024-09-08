import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { globalstyle } from "../../styles/globalstyle";

const PacksSection = ({ packs, navigation }) => {
  // console.log(packs);
  return (
    <View style={styles.container}>
      <Text style={[globalstyle.text, { fontFamily: "Mada_Bold" }]}>
        NOS PACKS
      </Text>
      <ScrollView style={{ marginBottom: 90 }}>
        {packs.map((item, index) => (
          <View key={index} style={[styles.card]}>
            <View style={styles.imageContainer}>
              <Image src={item.image} style={styles.img} />
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PackageDetail", { id: item.id })
                }
                style={[globalstyle.shadowBox, styles.bottomBox]}
              >
                <Text style={[globalstyle.text, styles.name]}>{item.name}</Text>
                <Text style={[globalstyle.text, styles.price]}>
                  {item.price_total} €
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  img: {
    width: "100%",
    height: 300,
    //  backgroundColor: "#fafafc",
  },
  card: {
    backgroundColor: "#fafafc",
    paddingTop: 0,
    zIndex: 20,
    position: "relative",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 400,
  },
  bottomBox: {
    backgroundColor: "#fff",
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 40,
    },
    shadowRadius: 60,
    elevation: 5,
    zIndex: 30,
    position: "absolute",
    width: "100%",
    bottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  name: {
    textTransform: "uppercase",
    fontSize: 17,
    fontFamily: "Mada_ExtraBold",
    letterSpacing: -0.5,
    //marginBottom: 10,
  },
  price: {
    fontSize: 15,
    fontFamily: "Mada_SemiBold",
    marginBottom: 10,
  },
});

export default PacksSection;
