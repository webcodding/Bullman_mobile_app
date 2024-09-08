import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import BlueButton from "../../components/Button/BlueButton";
import ErrAlert from "../../components/Alerts/ErrAlert";
import { globalstyle } from "../../styles/globalstyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BlackRadioBtn from "../../components/Button/BlackRadioButton";
import { AntDesign, Entypo } from "@expo/vector-icons";
import BlackButton from "../../components/Button/BlackButton";
import { countries } from "../../Config/config";

const Address = ({ navigation, activeTab, setActiveTab, setAllAddress }) => {
  const [addressComplement, setAddressComplement] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [company, setCompany] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [address, setAddress] = useState("");
  const [aditionalAddress, setAdditionalAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("France");
  const [checkBillingAddress, setCheckBilling] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showCoutries, setShowCountries] = useState(false);
  const [totalAddress, setTotalAddress] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showMoreForm, setShowMoreForm] = useState(false);

  useEffect(() => {
    const fetchStoredAddresses = async () => {
      const storedAddresses = await getStoredAddresses();
      if (storedAddresses?.length > 0) {
        setTotalAddress(storedAddresses);
        setSelectedAddress(storedAddresses[0]);
      }
    };

    fetchStoredAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSelectedAddress((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async () => {
    if (
      fname !== "" &&
      lname !== "" &&
      address !== "" &&
      postalCode !== "" &&
      city !== "" &&
      phone !== ""
    ) {
      const newAddress = {
        fname: fname,
        lname: lname,
        address: address,
        postalCode: postalCode,
        city: city,
        country: country,
        phone: phone,
      };
      await AsyncStorage.setItem("deliverAddress", JSON.stringify(newAddress));
      const updatedAddresses = [...totalAddress, newAddress];
      setTotalAddress(updatedAddresses);
      setShowMoreForm(false);
      await AsyncStorage.setItem(
        "allAddresses",
        JSON.stringify(updatedAddresses)
      );
      setSelectedAddress(newAddress);
      setShowAddressForm(false);
      setShowAddressForm(false);
      setPhone(""), setFname(""), setLname(""), setCity(""), setPostalCode("");
      setAddress("");
    } else {
      window.alert("Please fill in the required fields!");
    }
  };

  const handleAddressSubmit = async () => {
    //  handleContinue();
    setAllAddress({
      deliver_address: selectedAddress,
      billing_address: selectedAddress,
    });
    await AsyncStorage.setItem(
      "selectedAddress",
      JSON.stringify(selectedAddress)
    );
    setActiveTab("SHIPPING");
  };

  const handleDeleteAddress = async (index) => {
    const updatedAddresses = totalAddress.filter((_, i) => i !== index);
    setTotalAddress(updatedAddresses);

    // Update localStorage
    await AsyncStorage.setItem(
      "allAddresses",
      JSON.stringify(updatedAddresses)
    );

    if (updatedAddresses?.length > 0) {
      setSelectedAddress(updatedAddresses[0]);
    } else {
      setSelectedAddress(null);
      await AsyncStorage.removeItem("deliverAddress");
    }
  };

  const getStoredAddresses = async () => {
    try {
      const storedAddresses = await AsyncStorage.getItem("allAddresses");
      if (storedAddresses) {
        return storedAddresses ? JSON.parse(storedAddresses) : [];
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleContinue = () => {
    if (address !== "" && postalCode !== "") {
      setActiveTab("SHIPPING");
    } else {
      return <ErrAlert text={'Please fill "*" fields!'} />;
    }
  };
  //console.log(totalAddress);
  // console.log(getStoredAddresses());

  return (
    <>
      <View
        style={{
          flex: 1,
          marginBottom: 45,
          marginHorizontal: 20,
        }}
      >
        <View>
          <Text style={styles.headingText}>ADRESSE DE LIVRAISON</Text>
          <View
            style={{
              borderTopWidth: 1.5,
              borderColor: "black",
              marginTop: 5,
              paddingTop: 15,
            }}
          >
            {!showAddressForm && totalAddress?.length > 0 ? (
              <ScrollView
                style={{ marginBottom: 40 }}
                showsVerticalScrollIndicator={false}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#f1f1f1",
                    padding: 22,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#000",
                      fontFamily: "Mada_Medium",
                      marginBottom: 12,
                    }}
                  >
                    L'adresse sélectionnée sera utilisée à la fois comme adresse
                    personnelle (pour la facturation) et comme adresse de
                    livraison.
                  </Text>
                  {/* Select Address */}
                  <View>
                    {totalAddress.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[globalstyle.shadowBox, styles.addressBox]}
                        onPress={() => setSelectedAddress(item)}
                      >
                        {/* Delete single Address */}

                        <TouchableOpacity
                          style={[
                            globalstyle.row,
                            { justifyContent: "flex-end" },
                          ]}
                          onPress={() => handleDeleteAddress(index)}
                        >
                          <AntDesign name="close" size={24} color="#ababab" />
                        </TouchableOpacity>
                        <View
                          style={[
                            globalstyle.row,
                            { alignItems: "flex-start" },
                          ]}
                        >
                          <BlackRadioBtn
                            selectedOption={selectedAddress}
                            matchText={item}
                          />
                          <View style={{ marginTop: -8 }}>
                            <Text style={[globalstyle.text]}>
                              {item.fname} {item.lname}
                            </Text>
                            <Text style={[globalstyle.text]}>
                              {item.address}
                            </Text>
                            <Text style={[globalstyle.text]}>
                              {item.postalCode} {item.city}
                            </Text>
                            <Text style={[globalstyle.text]}>
                              {item.country}
                            </Text>
                            <Text style={[globalstyle.text]}>{item.phone}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {/* Add more address button */}
                  <TouchableOpacity
                    style={[
                      globalstyle.row,
                      { marginVertical: 12, cursor: "pointer" },
                    ]}
                    onPress={() => setShowAddressForm(true)}
                  >
                    <AntDesign
                      name="plus"
                      size={24}
                      color="#ababab"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        globalstyle.text,
                        {
                          color: "#ababab",
                          fontFamily: "Mada_SemiBold",
                          fontSize: 16,
                        },
                      ]}
                    >
                      Ajouter une nouvelle adresse
                    </Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#000",
                      fontFamily: "Mada_Medium",
                      marginBottom: 12,
                    }}
                  >
                    L'adresse de facturation diffère de l'adresse de livraison{" "}
                  </Text>
                  {/* <BlackButton
                    text={"Continue"}
                    onclick={handleAddressSubmit}
                  /> */}
                </View>
              </ScrollView>
            ) : showAddressForm || totalAddress?.length === 0 ? (
              <View style={{ position: "relative" }}>
                {/* Address form */}
                {!showMoreForm && (
                  <>
                    <View style={{}}>
                      {/* telephone */}
                      <Text style={styles.label}>
                        Entrez le numéro de téléphone
                      </Text>
                      <TextInput
                        style={styles.input}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                      />
                    </View>
                    {/* country */}
                    <View style={{ marginTop: 10 }}>
                      <Text style={styles.label}>Sélectionnez votre pays</Text>
                      <TouchableOpacity
                        onPress={() => setShowCountries((prev) => !prev)}
                        style={[
                          styles.inputContainer,
                          styles.input,
                          { justifyContent: "space-between" },
                        ]}
                      >
                        <Text
                          style={[
                            globalstyle.text,
                            { fontFamily: "Mada_Medium", fontSize: 15 },
                          ]}
                        >
                          {country}
                        </Text>
                        <Entypo
                          name="chevron-small-down"
                          size={24}
                          color="#acacad"
                        />
                      </TouchableOpacity>
                    </View>

                    {phone !== "" && (
                      <BlueButton
                        text={"continuer"}
                        textStyle={{ fontSize: 18 }}
                        style={{
                          height: 45,
                          width: 150,
                          marginRight: 20,
                          marginTop: 20,
                        }}
                        onclick={() => setShowMoreForm(true)}
                      />
                    )}
                  </>
                )}
                {showMoreForm && (
                  <>
                    <View style={[globalstyle.row]}>
                      {/* first name */}
                      <View style={{ flex: 1, paddingRight: 5 }}>
                        <Text style={styles.label}>Prénom</Text>
                        <TextInput
                          style={styles.input}
                          value={fname}
                          onChangeText={setFname}
                        />
                      </View>
                      {/* last name */}
                      <View style={{ flex: 1, paddingLeft: 5 }}>
                        <Text style={styles.label}>Nom </Text>
                        <TextInput
                          style={styles.input}
                          value={lname}
                          onChangeText={setLname}
                        />
                      </View>
                    </View>
                    {/* postal code */}
                    <View style={[globalstyle.row]}>
                      <View style={{ flex: 1, paddingRight: 5 }}>
                        <Text style={styles.label}>Code postal</Text>
                        <TextInput
                          style={styles.input}
                          value={postalCode}
                          onChangeText={setPostalCode}
                        />
                      </View>
                      {/* city */}
                      <View style={{ flex: 1, paddingLeft: 5 }}>
                        <Text style={styles.label}>Ville</Text>
                        <TextInput
                          style={styles.input}
                          value={city}
                          onChangeText={setCity}
                        />
                      </View>
                    </View>

                    <View style={{ width: "100%" }}>
                      {/* address */}
                      <Text style={styles.label}>Adresse</Text>
                      <TextInput
                        style={styles.input}
                        value={address}
                        onChangeText={setAddress}
                      />
                    </View>
                    <View style={[globalstyle.row, { marginTop: 40 }]}>
                      <BlueButton
                        text={"continuer"}
                        textStyle={{ fontSize: 18 }}
                        style={{ height: 45, width: 150, marginRight: 20 }}
                        onclick={() => handleFormSubmit()}
                      />
                      {totalAddress?.length > 0 && (
                        <BlackButton
                          text={"Annuler"}
                          textStyle={{ fontSize: 18 }}
                          style={{ height: 45, width: 150 }}
                          onclick={() => {
                            setShowAddressForm(false);
                            setShowMoreForm(false);
                            setPhone(""),
                              setFname(""),
                              setLname(""),
                              setCity(""),
                              setPostalCode("");
                            setAddress("");
                          }}
                        />
                      )}
                    </View>
                  </>
                )}
              </View>
            ) : null}
          </View>
        </View>
      </View>
      {!showAddressForm && totalAddress?.length > 0 ? (
        <BlueButton
          text={"Soumettre l'adresse"}
          textStyle={{ fontSize: 22 }}
          style={{ height: 55 }}
          onclick={() => handleAddressSubmit()}
        />
      ) : null}
      {/* all countries */}
      {showCoutries && (
        <ScrollView
          style={[
            globalstyle.shadowBox,
            {
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: "#eee",
              backgroundColor: "#ffffff",
              position: "absolute",
              zIndex: Platform.OS === "ios" ? 999 : 50,
              top: 350,
              left: 20,
              width: "85%",
              height: 300,
            },
          ]}
        >
          {countries.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCountry(item);
                setShowCountries(false);
              }}
              style={{ marginVertical: 5 }}
            >
              <Text
                style={[
                  globalstyle.text,
                  {
                    fontFamily: "Mada_Regular",
                    fontSize: 15,
                    paddingBottom: 15,
                  },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headingText: {
    marginTop: 10,
    fontFamily: "Mada_Bold",
    fontSize: 22,
  },
  userName: {
    fontFamily: "Mada_SemiBold",
    fontSize: 17,
    marginTop: 20,
    marginBottom: 10,
    color: "#5a5f61",
  },
  label: {
    fontFamily: "Mada_Medium",
    fontSize: 15,
    //marginBottom: 5,
  },
  inputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  italicText: {
    position: "absolute",
    right: 10,
    fontStyle: "italic",
    color: "#acacad",
    paddingBottom: 13,
    fontSize: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#acacad",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontFamily: "Mada_Medium",
    fontSize: 15,
    //marginBottom: 5,
    position: "relative",
    zIndex: 30,
  },
  addressBox: {
    borderWidth: 1,
    borderColor: "#d2d2d2",
    padding: 12,
    borderRadius: 7,
    backgroundColor: "#fff",
    marginVertical: 10,
  },
});

export default Address;
