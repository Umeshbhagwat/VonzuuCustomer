import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Modal,
  TextInput,
  Button,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import MapView, { Marker, Callout } from "react-native-maps";
import GlobleStyle from "../utils/GlobleStyle";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector, useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import axios, { AxiosResponse } from "axios";
import Api from "../services/Api";
import { MAP_API_KEY } from "@env";
import Toast from "react-native-toast-message";
import { Wave } from "react-native-animated-spinkit";
import { RFPercentage } from "react-native-responsive-fontsize";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { wp } from "../utils/SizeResponcive";
const AddNewAdress = () => {
  const [location, setLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(0);
  const [selectedLabel, setSelelabel] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [userAlladdress, setUserAllAddress] = useState([]);
  const [landmark, setLandmark] = useState("Home");
  const [custEmail, setCustEmail] = useState(null);
  const [custFname, setCustFname] = useState(null);
  const [custLastName, setCustLastName] = useState(null);
  const [custMobileNo, setCustMobileNo] = useState(null);
  const [showConformBtn, setShowConformBtn] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newLabelInput, setNewLabelInput] = useState("");
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    zipCode: "",
    city: "",
    landmarktext: "",
    flatNo: "",
    phoneNumber: "",
    landmark: "",
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapRegion, setMapRegion] = useState(null);
  
  useEffect(()=>{
    getCustomerEmail();
  },[])

  console.log("+++==", typeof selectedAddressId);

  const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);

  console.log("CustomerId", typeof cutomerId);
  const handleTextInputChange = (field, value) => {
    setFormData((prevData) => {
      // If the field is addressLine2 and its value is empty, set it to the value of addressLine1
      if (field === 'addressLine2' && value.trim() === "") {
        return {
          ...prevData,
          addressLine2: prevData.addressLine1,
          [field]: value,
        };
      } else {
        return {
          ...prevData,
          [field]: value,
        };
      }
    });
  };

 
  const getCustomerEmail = async () => {
    try {
      const customerEmail = await AsyncStorage.getItem("custEmail");
      const customerFirstName = await AsyncStorage.getItem("custFirstName");
      const custlastName = await AsyncStorage.getItem("custlastName");
      const custMobileNo = await AsyncStorage.getItem("custMobileNo");
  
      // Extracting mobile number without country code
      const mobileWithoutCountryCode = custMobileNo.split(' ')[1];
      
      console.log("The customerEmail****", customerEmail, "*****", customerFirstName, "*****", custlastName, "#####", custMobileNo);
  
      setCustEmail(customerEmail);
      setCustFname(customerFirstName);
      setCustLastName(custlastName);
      setCustMobileNo(mobileWithoutCountryCode);
    } catch (error) {
      console.error("Error getting customerId from AsyncStorage:", error);
    }
  };
  

  useEffect(() => {
    // Set initial form data from selectedAddress when the component mounts
   
    if (selectedAddress) {
      setFormData({
        addressLine1: selectedAddress.addressLine1 || "",
        addressLine2: selectedAddress.addressLine2 || "",
        zipCode: selectedAddress.zipCode || "",
        city: selectedAddress.city || "",
        landmarktext: selectedAddress.landmarktext || "",
        flatNo: selectedAddress.flatNo || "",
        phoneNumber: selectedAddress.phoneNumber || "",
      });
    }
  }, [selectedAddress]);

  const handleConfirmAddress = () => {
    // Access formData object containing the data from TextInput fields
    
    console.log("Form Data:", formData);

    console.log("======", selectedAddressId);

    navigation.navigate("MyCart", { formData, selectedAddressId });
  };

  // console.log("selected Adreess data", selectedAddress);

  // console.log("======", selectedAddressId);

  const requestLocationPermission = async () => {
    if (Platform.OS === "ios") {
      getOneTimeLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Access Required",

            message: "This App needs to Access your location",
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getOneTimeLocation();
        } else {
          console.log("Permission Denied");
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        console.log("The user Position ", position);

        setLocation(position.coords);

        console.log("Setting up location");

        if (selectedLocation == null) {
          setSelectedLocation({
            latitude: position.coords.latitude,

            longitude: position.coords.longitude,
          });

          setMapRegion({
            latitude: position.coords.latitude,

            longitude: position.coords.longitude,

            latitudeDelta: 0.0922,

            longitudeDelta: 0.0421,
          });
        }
      },
      (error) => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  };

  const getGeolocationName = async (latitude, longitude) => {
    try {
      const apiKey = MAP_API_KEY;

      const endPoint = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

      const response = await axios.get(endPoint);

      if (response.data) {
        const results = response.data.results;

        const selectedAddress = results[0];

        const formattedAddress = selectedAddress.formatted_address;

        setLocationName(formattedAddress);

        const addressComponents = selectedAddress.address_components;

        const address = {};

        addressComponents.forEach((component) => {
          const types = component.types;

          if (types.includes("street_number")) {
            address.addressLine1 = component.long_name;
          } else if (types.includes("route")) {
            address.addressLine1 = `${address.addressLine1} ${component.long_name}`;
          } else if (
            types.includes("sublocality") ||
            types.includes("sublocality_level_1")
          ) {
            address.addressLine2 = component.long_name;
          } else if (types.includes("locality")) {
            address.city = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            address.state = component.long_name;
          } else if (types.includes("postal_code")) {
            address.zipCode = component.long_name;
          } else if (types.includes("country")) {
            address.country = component.long_name;
          }
        });

        setFormData(address);
      } else {
        setLocationName("Location not found");
      }
    } catch (error) {
      console.error("Error fetching location name:", error);

      setLocationName("Location not found");
    }
  };

  const handleLabelPress = (label, id) => {
    setSelectedAddressId(id);

    setSelelabel(label);

    const selectedAddressData = userAlladdress.find(
      (address) => address.label === label
    );

    setSelectedAddress(selectedAddressData);
  };

  useEffect(() => {
    setMapRegion({
      latitude: 18.51,

      longitude: 73.84,

      latitudeDelta: 0.0922,

      longitudeDelta: 0.0421,
    });

    requestLocationPermission();
  }, []);
  // useEffect(() => {

  //   getAddresses();

  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      getAddresses();
    }, [])
  );
  const getAddresses = async () => {
    try {
      const endPoint = `api/v1/basket/Address/GetCustomerAddress?CustomerID=${cutomerId}&StoreId=4046&APIKey=%2Fapi%2Fv1%2Fbasket%2FAddress%2FUpdateCustomerAddress&UniqueSeoCode=1`;

      const response = await Api.fetchEndpointData(endPoint);

      const data = response.data;

      // Update the state with the "result" data

      setUserAllAddress(data.result);
      console.log(data,"This is main logic")
    } catch (error) {
      console.log("Data fetching error", error);
    }
  };

  const [Loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState("");

  const handleInputChange = (property, text) => {
    if (/^\d{0,10}$/.test(text)) {
      setInputs(text);
        setFormData({
            ...formData,
            [property]: text,
        });
    }
   
};


  const handleUpdatedAddress = async () => {
    setLoading(true);

    if (inputs.length === 10) {
      try {
        const data = {
          storeId: 1046,
          apiKey: "BDD6B8BC-6C51-49C6-8E17-9E09B86E4DBB",
          uniqueSeoCode: "1",
          firstName: `${custFname}`,
          lastName: `${custLastName}`,
          email: `${custEmail}`,
          phoneNumber: `${inputs}`,
          landmark: `${selectedLabel}`,
          addressTypeId: 0,
          address1: formData.addressLine1,
          address2: formData.addressLine2,
          city: formData.city,
          zipPostalCode: formData.zipCode,
          custId: cutomerId,
          latitude: 0,
          longitude: 0,
          landmarktxt: formData.landmarktext,
          doorNo: formData.flatNo,
          setAsDefault: true,
          addressID: selectedAddressId,
        };

        console.log("This is an data %%%%%", data);

        if (selectedAddressId == 0) {
          endPoint = "/api/v1/basket/Address/SaveCustomerAddress";
          const responce = await Api.postEndpointData(endPoint, data);
          console.log("this is an responce For", responce);
          console.log(responce);

          if (responce.data.statusCode === 200) {
            getAddresses();
               
          //  setInputs('');
            setShowConformBtn(true);
            Toast.show({
              text1: "Your Address is Save",
              visibilityTime: 2000,
              type: "success",
            });
           
          } else {
            Toast.show({
              text1: "Please Fill proper address",
              visibilityTime: 2000,
              type: "info",
            });
          }

          setLoading(false);
        } else {
          const endPoint = "/api/v1/basket/Address/UpdateCustomerAddress";

          const responce = await Api.putEndpointData(endPoint, data);

          // console.log("this is an responce ", responce.data.result);

          if (responce.data.statusCode === 200) {
          }

          setLoading(false);

          Toast.show({
            text1: "Adress Upadte scussefull ",

            visibilityTime: 2000,

            type: "info",
          });

          setShowConformBtn(true);
        }

        getAddresses();
      } catch (error) {
        setLoading(false);

        Toast.show({
          text1: "please fill data",
          visibilityTime: 2000,
          type: "error",
        });

        console.log("Addresss  update error ", error);
      }
    } else {
      setLoading(false);

      Toast.show({
        text1: "Please fill in all 10 numbers.",

        type: "error",

        visibilityTime: 2000,
      });

      // Alert.alert('Error', 'Please enter at least 10 digits.');
    }
  };
  
  const selectLocationHandler = (event) => {
    setSelectedLocation({
      latitude: event.nativeEvent.coordinate.latitude,

      longitude: event.nativeEvent.coordinate.longitude,
    });

    getGeolocationName(
      event.nativeEvent.coordinate.latitude,

      event.nativeEvent.coordinate.longitude
    );
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleAdd = async () => {
    console.log("Add button pressed with input value:", newLabelInput);

    setModalVisible(false);

    try {
      const endPoint = `/api/v1/basket/Address/SaveCustomerAddress`;
      const data = {
        storeId: 1046,
        apiKey: "BDD6B8BC-6C51-49C6-8E17-9E09B86E4DBB",
        uniqueSeoCode: "1",
        firstName: `${custFname}`,
        lastName: `${custLastName}`,
        email: `${custEmail}`,
        phoneNumber:`${custMobileNo}`,
        landmark: `${newLabelInput}`,
        addressTypeId: 3,
        address1: "string",
        address2: "string",
        city: "string",
        zipPostalCode: "string",
        custId: `${cutomerId}`,
        latitude: 0,
        longitude: 0,
        landmarktxt: "string",
        doorNo: "string",
        setAsDefault: true,
      };

      const responce = await Api.postEndpointData(endPoint, data);

      if (responce.data.statusCode === 200) {
        getAddresses();

        Toast.show({
          text1: "Lable added",

          type: "success",

          visibilityTime: 2000,
        });
      }
    } catch (error) {
      Toast.show({
        text1: "Lable is not added",

        type: "Error",

        visibilityTime: 2000,
      });
    }
  };

  const handleCancel = () => {
    // Add your logic here for handling the "Cancel" button press

    // Close the modal

    setModalVisible(false);
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ position: "absolute", top: 30, left: 10, zIndex: 1 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View
            style={{
              backgroundColor: "#F2F5F8",
              padding: 10,
              borderRadius: 15,
            }}
          >
            <MaterialIcons name="arrow-back" size={30} color={"black"} />
          </View>
        </TouchableOpacity>
      </View>

      <MapView
        style={{ flex: 1 }}
        region={mapRegion}
        onPress={selectLocationHandler}
      >
        {selectedLocation && (
          <Marker title="Selected Location" coordinate={selectedLocation} />
        )}
      </MapView>

      <View
        style={{
          height: "60%",

          width: "100%",

          backgroundColor: "#FFFFFF",

          borderTopLeftRadius: 20,

          borderTopRightRadius: 20,
        }}
      >
        <ScrollView>
          <View style={{ margin: 20, marginBottom: 80 }}>
            <Text
              style={[GlobleStyle.CustomFont, { fontSize: 19, color: "black" }]}
            >
              Enter New address
            </Text>

            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                padding: 5,
                backgroundColor: "#9B56FF",
                borderRadius: 5,
              }}
              onPress={toggleModal}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                Add New Address
              </Text>
            </TouchableOpacity>

            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={toggleModal}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <Text
                    style={[
                      GlobleStyle.CustomHeadingColor,
                      { marginBottom: 10, fontSize: 16, fontWeight: "bold" },
                    ]}
                  >
                    Add New Label
                  </Text>

                  <TextInput
                    style={styles.modalInput}
                    placeholder="Enter label"
                    placeholderTextColor={"black"}
                    value={newLabelInput}
                    onChangeText={(text) => setNewLabelInput(text)}
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity
                      onPress={handleAdd}
                      style={{
                        backgroundColor: "#FFFFFF",
                        padding: 5,
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        elevation: 5,

                        shadowColor: "gray",

                        shadowOffset: {
                          width: 0,

                          height: 2,
                        },

                        shadowOpacity: 0.5,

                        shadowRadius: 3.84,
                      }}
                    >
                      <Text style={{ color: "black", fontWeight: "bold" }}>
                        Add
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleCancel}
                      style={{
                        backgroundColor: "#FFFFFF",
                        padding: 5,
                        borderRadius: 5,
                        paddingHorizontal: 10,
                        elevation: 7,

                        shadowColor: "gray",

                        shadowOffset: {
                          width: 0,

                          height: 2,
                        },

                        shadowOpacity: 0.5,

                        shadowRadius: 3.84,
                      }}
                    >
                      <Text style={{ color: "black", fontWeight: "bold" }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <Text style={styles.lableText}>Save this location for later</Text>

            <View
              style={{
                flexDirection: "row",
                marginVertical: 10,
                flexWrap: "wrap",
              }}
            >
              {userAlladdress.map((address, index) => (
                <TouchableOpacity
                  style={[
                    styles.locationBackgroundContainer,

                    selectedAddress?.label === address.label &&
                      styles.selectedLocationBackground,
                  ]}
                  key={index}
                  onPress={() => handleLabelPress(address.label, address.id)}
                >
                  <Text
                    style={[
                      styles.locationConteinerText,

                      {
                        color:
                          selectedAddress?.label === address.label
                            ? "#0D1D28"
                            : "black",
                      },
                    ]}
                  >
                    {address.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View>
              <View>
                <Text style={styles.lableText}>Address</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",

                  justifyContent: "space-between",
                  paddingVertical: 15,
                }}
              >
                <TextInput
                  placeholder="Enter complete Address"
                  placeholderTextColor={"#737B89"}
                  style={{ flex: 1, color: "black" }}
                  value={formData.addressLine1}
                  onChangeText={(text) =>
                    handleTextInputChange("addressLine1", text)
                  }
                />
              </View>
              <View
                style={{ borderWidth: 1, borderBlockColor: "#E3E7EF" }}
              ></View>

              {/* <Text style={styles.lableText}>Full Address</Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 15,
                }}
              >
                <TextInput
                  placeholder="*Please Enter full address*"
                  placeholderTextColor={"red"}
                  style={{ flex: 1, color: "black" }}
                  value={formData.addressLine2}
                  onChangeText={(text) =>
                    handleTextInputChange("addressLine2", text)
                  }
                />
              </View> */}


              <View
                style={{ borderWidth: 1, borderBlockColor: "#E3E7EF" }}
              ></View>
              <Text style={styles.lableText}>ZipCode</Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 15,
                }}
              >
                <TextInput
                  placeholder="Enter ZipCode"
                  placeholderTextColor={"#737B89"}
                  style={{ flex: 1, color: "black" }}
                  value={formData.zipCode}
                  onChangeText={(text) =>
                    handleTextInputChange("zipCode", text)
                  }
                />
              </View>
              <View
                style={{ borderWidth: 1, borderBlockColor: "#E3E7EF" }}
              ></View>
              <Text style={styles.lableText}>City</Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 15,
                }}
              >
                <TextInput
                  placeholder="Enter Your City"
                  style={{ flex: 1, color: "black" }}
                  placeholderTextColor={"#737B89"}
                  value={formData.city}
                  onChangeText={(text) => handleTextInputChange("city", text)}
                />
              </View>

              <View
                style={{ borderWidth: 1, borderBlockColor: "#E3E7EF" }}
              ></View>
              <Text style={styles.lableText}>Landmark</Text>

              <View
                style={{
                  flexDirection: "row",

                  justifyContent: "space-between",

                  paddingVertical: 15,
                }}
              >
                <TextInput
                  placeholder="Optional"
                  placeholderTextColor={"#737B89"}
                  style={{ flex: 1, color: "black" }}
                  value={formData.landmarktext}
                  onChangeText={(text) =>
                    handleTextInputChange("landmarktext", text)
                  }
                />
              </View>

              <View
                style={{ borderWidth: 1, borderBlockColor: "#E3E7EF" }}
              ></View>

              <View>
                <Text style={styles.lableText}>FlatNo</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 15,
                  }}
                >
                  <TextInput
                    placeholder="Optional"
                    placeholderTextColor={"#737B89"}
                    style={{ flex: 1, color: "black" }}
                    value={formData.flatNo}
                    onChangeText={(text) =>
                      handleTextInputChange("flatNo", text)
                    }
                  />
                </View>
                <View
                  style={{ borderWidth: 1, borderBlockColor: "#E3E7EF" }}
                ></View>

                <Text style={styles.lableText}>Phone Number</Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 15,
                  }}
                >

              <TextInput
                  placeholder="*Please Enter Number*"
                  style={{ flex: 1, color: "black" }}
                  placeholderTextColor={"#737B89"}
                  keyboardType="number-pad"
                  value={formData.phoneNumber}
                  onChangeText={(text) => handleInputChange("phoneNumber", text)}
              />
                </View>
                <View
                  style={{ borderWidth: 1, borderBlockColor: "#E3E7EF" }}
                ></View>
              </View>
            </View>
          </View>
          {Loading ? (
            <View style={{ alignSelf: "flex-end", right: 50, bottom: 20 }}>
              <Wave size={30} color="#33FFC2" animating={Loading} />
            </View>
          ) : (
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                marginRight: 12,
                borderRadius: 12,
                marginBottom: 10,
                backgroundColor: "#9B56FF",
                paddingVertical: 10,
                paddingHorizontal: 18,
               
              }}
              onPress={() => handleUpdatedAddress()}
            >
              <Text
                style={[
                  GlobleStyle.CustomFont,
                  { fontSize: 15, color: "white" },
                ]}
              >
                Save Updated Address
              </Text>
            </TouchableOpacity>
          )}

          {showConformBtn ? (
            <TouchableOpacity
              style={{
                marginBottom: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => handleConfirmAddress()}
            >
              <View
                style={{
                  width: "90%",
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#33FFC2",
                  borderRadius: 10,
                  // bottom:5
                }}
              >
                <Text
                  style={[
                    GlobleStyle.CustomFont,

                    { fontSize: 20, color: "black", left: 10 },
                  ]}
                >
                  Confirm Address
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default AddNewAdress;

const styles = StyleSheet.create({
  locationBackgroundContainer: {
    // height: 30,
    padding: 5,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 10,
    margin: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  selectedLocationBackground: {
    backgroundColor: "#33FFC2",
  },
  locationConteinerText: {
    fontSize: RFPercentage(1.6),
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: wp("70"),
    elevation: 5,
    shadowColor: "gray",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },

  modalInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  lableText: [
    GlobleStyle.CustomFont,

    { fontSize: 15, color: "black", top: 10 },
  ],
});
