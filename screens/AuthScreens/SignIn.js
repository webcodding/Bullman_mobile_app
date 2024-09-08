import { FontAwesome } from "@expo/vector-icons";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import PrevButton from "../../components/Button/PrevButton";
import { globalstyle } from "../../styles/globalstyle";
import BlueButton from "../../components/Button/BlueButton";
import { registerUser } from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContext from "../../context/AuthContext";
import WhiteRadioBtn from "../../components/Button/WhiteRadioButton";

const SignIn = ({ navigation }) => {
  const { setAuth } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkNewsletter, setCheckNewsLetter] = useState(false);
  const [checkPrivacy, setCheckPrivacy] = useState(false);

  const handleRegister = async () => {
    const userData = {
      title: title,
      fname: fname,
      lname: lname,
      email: email,
      password: password,
      newsletter: checkNewsletter,
      privacy: checkPrivacy,
    };

    // console.log(userData);

    try {
      const response = await registerUser(userData);
      console.log("Registration successful:", response.user);
      setAuth({
        token: response.token,
        user: response.user,
      });
      await AsyncStorage.setItem("token", response.token);
      await AsyncStorage.setItem("user", JSON.stringify(response.user));
      navigation.navigate("User");
    } catch (error) {
      // console.error("Error registering user:", error);
      console.log(error);

      alert("User already exist");
    }
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <View style={[globalstyle.row, { marginTop: 40 }]}>
        <PrevButton navigation={navigation} />
        <Text style={styles.header}>CREATE AN ACCOUNT</Text>
      </View>

      <Text style={styles.title}>EMAIL</Text>
      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#acacad"
        style={styles.input}
      />
      <Text style={styles.title}>ENTER PASSWORD</Text>
      <View style={[styles.input, { marginBottom: 22 }]}>
        <TextInput
          placeholder=""
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#acacad"
          secureTextEntry={!isPasswordVisible}
          style={{ color: "#fff", fontSize: 17, fontFamily: "Mada_Medium" }}
        />
        <TouchableOpacity
          style={styles.visibilityButton}
          onPress={togglePasswordVisibility}
        >
          {isPasswordVisible ? (
            <FontAwesome name="eye-slash" size={20} color="#acacad" />
          ) : (
            <FontAwesome name="eye" size={20} color="#acacad" />
          )}
        </TouchableOpacity>
      </View>
      <Text style={[styles.title, { marginTop: 10 }]}>GENDER</Text>
      <View style={[styles.radioContainer, { marginTop: 10 }]}>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setTitle("M")}
        >
          <WhiteRadioBtn selectedOption={title} matchText={"M"} />
          <Text style={styles.radioText}>M</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.radioButton}
          onPress={() => setTitle("Mme")}
        >
          <WhiteRadioBtn selectedOption={title} matchText={"Mme"} />
          <Text style={styles.radioText}>Mme</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>NAME</Text>
      <View style={styles.nameContainer}>
        <TextInput
          placeholder="First Name"
          value={fname}
          onChangeText={setFname}
          placeholderTextColor="#acacad"
          style={[styles.input, { width: 170 }]}
        />
        <TextInput
          placeholder="Last Name"
          value={lname}
          onChangeText={setLname}
          placeholderTextColor="#acacad"
          style={[styles.input, { width: 170 }]}
        />
      </View>
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          onPress={() => setCheckNewsLetter(!checkNewsletter)}
          style={[globalstyle.row]}
        >
          <View style={[styles.checkbox]}>
            {checkNewsletter && (
              <FontAwesome name="check" size={14} color="#fff" />
            )}
          </View>
          <View>
            <Text style={styles.checkboxLabel}>Receive our newsletter</Text>
            <Text style={styles.checkText}>
              You can unsubscribe at any moment. For this purpose, please find
              our contact information in the terms of use of the site.
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          onPress={() => setCheckPrivacy(!checkPrivacy)}
          style={[globalstyle.row]}
        >
          <View style={[styles.checkbox, { marginTop: -22 }]}>
            {checkPrivacy && (
              <FontAwesome name="check" size={14} color="#fff" />
            )}
          </View>

          <Text style={[styles.checkboxLabel, { marginRight: 1 }]}>
            I accept the terms and conditions and the privacy policy
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[{ width: "100%", marginTop: 40 }]}>
        <BlueButton text={"CREATE AN ACCOUNT"} onclick={handleRegister} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    backgroundColor: "#000",
    paddingHorizontal: 20,
  },
  header: {
    textAlign: "center",
    fontFamily: "Mada_Bold",
    fontSize: 19,
    color: "#fff",
    marginLeft: 65,
  },
  title: {
    marginTop: 20,
    fontFamily: "Mada_SemiBold",
    fontSize: 16,
    color: "#fff",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#fff",
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 2,
    marginBottom: 10,
    color: "#fff",
    marginTop: 5,
    fontFamily: "Mada_Medium",
    fontSize: 17,
  },
  visibilityButton: {
    position: "absolute",
    right: 10,
    top: 15,
  },
  radioContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#acacad",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selectedRadioCircle: {
    backgroundColor: "#fff",
  },
  radioText: {
    fontFamily: "Mada_Medium",
    fontSize: 17,
    color: "#acacad",
  },
  nameContainer: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  checkbox: {
    height: 18,
    width: 18,
    borderWidth: 1,
    borderColor: "#acacad",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checkboxLabel: {
    fontFamily: "Mada_Medium",
    fontSize: 17,
    color: "#acacad",
  },
  checkText: {
    marginLeft: 28,
    fontFamily: "Mada_Regular",
    fontSize: 14,
    color: "#acacad",
  },
});

export default SignIn;
