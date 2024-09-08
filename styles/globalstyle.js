import { StyleSheet } from "react-native";

export const globalstyle = StyleSheet.create({
  text: {
    color: "#000",
    fontSize: 20,
    fontFamily: "Mada_Regular",
  },
  primaryColor: {
    color: "#315593",
  },
  primaryBg: {
    backgroundColor: "#315593",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    flexDirection: "column",
    alignItems: "center",
  },
  spaceBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shadowBox: {
    shadowColor: "#363636",
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 40,
    elevation: 15,
    borderWidth: 0.5,
    borderColor: "#eee",
  },
});
