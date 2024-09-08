import React, { useContext } from "react";
import { View, Text, StyleSheet, Image, Platform } from "react-native";
import TopBar from "../../components/Bar/TopBar";
import { globalstyle } from "../../styles/globalstyle";
import PrevButton from "../../components/Button/PrevButton";
import Slug from "../../components/Slug";
import {
  AntDesign,
  Fontisto,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import BlackButton from "../../components/Button/BlackButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../../context/AuthContext";
import infobg from "../../assets/img/infobg.png";

const User = ({ navigation }) => {
  const { auth, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <TopBar
        navigation={navigation}
        rightContent={() => (
          <View style={[globalstyle.row, { marginTop: 5 }]}>
            <PrevButton navigation={navigation} />
            <Slug slug={"Account"} />
          </View>
        )}
      />

      {!auth.token ? (
        <View style={{ paddingHorizontal: 20 }}>
          <View style={[globalstyle.row, styles.icon]}>
            <MaterialCommunityIcons name="account" size={94} color="#acacad" />
          </View>
          <Text style={[globalstyle.text, styles.text]}>
            Soyez le premier informé des nouveaux produits, enregistrez vos
            informations de paiement pour un achat facile en un clic et
            consultez l'état étape par étape de vos commandes - le tout depuis
            l'application BULLMAN !
          </Text>
          <View style={styles.button}>
            <BlackButton
              text={"CONNECTEZ-VOUS OU CRÉEZ UN COMPTE"}
              onclick={() => navigation.navigate("Login")}
            />
          </View>
        </View>
      ) : (
        <View style={[]}>
          <Image
            source={infobg}
            style={{
              width: "100%",
              height: 380,
              position: "absolute",
              // zIndex: 30,
              top: 90,
            }}
          />
          <View
            style={[
              globalstyle.row,
              {
                width: "100%",
                justifyContent: "center",
                ...Platform.select({
                  ios: {
                    // marginTop: 20,
                  },
                }),
              },
            ]}
          >
            <View style={[globalstyle.row, styles.circle]}>
              {auth.user.title === "M" ? (
                <Fontisto name="male" size={70} color="#acacad" />
              ) : (
                <Fontisto name="female" size={70} color="#acacad" />
              )}
            </View>
          </View>
          <View style={{ marginHorizontal: 20 }}>
            <View style={{ borderBottomWidth: 1, borderColor: "#dcdcdc" }}>
              <Text style={[globalstyle.text, styles.user]}>
                Name : {""}
                {auth.user.fname} {auth.user.lname}
              </Text>
            </View>
            <View style={{ borderBottomWidth: 1, borderColor: "#dcdcdc" }}>
              <Text style={[globalstyle.text, styles.email]}>
                Email : {""}
                {auth.user.email}
              </Text>
            </View>
            <BlackButton
              text={"Log out"}
              onclick={logout}
              style={{ paddingHorizontal: 50, marginTop: 50 }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  circle: {
    marginTop: Platform.OS === "ios" ? 260 : 220,
    backgroundColor: "#fff",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#acacad",
    borderRadius: 120,
    width: 190,
    height: 190,
    marginHorizontal: 135,
  },
  icon: {
    marginTop: 110,
    paddingTop: 50,
    justifyContent: "center",
  },
  text: {
    textAlign: "center",
    color: "#acacad",
    fontFamily: "Mada_Medium",
    fontSize: 22,
  },
  user: {
    marginTop: 50,
    fontFamily: "Mada_SemiBold",
    fontSize: 24,
    paddingBottom: 5,
  },
  email: {
    marginTop: 10,
    fontFamily: "Mada_Medium",
    fontSize: 22,
    paddingBottom: 5,
  },
  button: {
    marginTop: 20,
  },
});

export default User;
