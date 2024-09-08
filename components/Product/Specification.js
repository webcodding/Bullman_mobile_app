import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const Specification = ({ specification }) => {
  // console.log(specification);
  return (
    <View style={styles.container}>
      <Text style={styles.header}>CARACTÉRISTIQUES</Text>
      <ScrollView contentContainerStyle={styles.specList}>
        {Object.entries(specification).map(([key, value], index) => (
          <View key={index} style={styles.specItem}>
            <Text style={styles.specKey}>{key.replace(/_/g, " ")}</Text>
            <Text style={styles.specValue}>{value}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontFamily: "Mada_SemiBold",
    fontSize: 17,
    fontWeight: "500",
    paddingBottom: 5,
    marginBottom: 5,
    textTransform: "capitalize",
  },
  specList: {
    flexDirection: "column",
  },
  specItem: {
    flexDirection: "row",
    justifyContent: "space-between",

    paddingVertical: 5,
  },
  specKey: {
    fontFamily: "Mada_SemiBold",
    fontSize: 14,
    textTransform: "capitalize",
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    flex: 1,
  },
});

export default Specification;
