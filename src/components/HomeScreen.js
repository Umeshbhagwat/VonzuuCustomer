import React, { useState, useEffect } from "react";
import {
  View,Text,TextInput,StyleSheet,
  Image,ScrollView,
  TouchableOpacity,PermissionsAndroid,
  SafeAreaView} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { setCartData, setCartError } from "../reduxtoolkit/CartSlice";
import {
  setLatLongData,
  setLaLongError,
  clearData,
} from "../reduxtoolkit/LatLongSlice";
import { useSelector, useDispatch } from "react-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import GlobleStyle from "../utils/GlobleStyle";
import { products, localBrandData, foodOutlet } from "./products";
import ProductCategory from "./HomeScreenComponents/ProductCategory";
import LocalBrands from "./HomeScreenComponents/LocalBrands";
import SpecialOffers from "./HomeScreenComponents/SpecialOffers";
import FoodOutlets from "./HomeScreenComponents/FoodOutlets";
import PopularRestaurants from "./HomeScreenComponents/PopularRestaurants";
import InternationalBrands from "./HomeScreenComponents/InternationalBrands";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Geolocation from "@react-native-community/geolocation";
import axios from "axios"; // Import the Axios library
import SearchLocation from "./SearchLocation";
import Api from "../services/Api";
import * as logger from "../utils/logger";
import Toast from "react-native-toast-message"
import { MAP_API_KEY } from "@env";
import { Wave } from "react-native-animated-spinkit";
import { RFPercentage } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const [Loading, setLoading] = useState(false)
  const [locationName, setLocationName] = useState(null); // State to store the location name
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [selectLocationLatLog, setSelectLocationLatLog] = useState({
    latitude: null,
    longitude: null,
  });
  const [totalQuantity, setTotalQuantity] = useState(null);
  const splitAddress = locationName ? locationName.split(", ") : [];
  const dispatch = useDispatch();
  const latLongData = useSelector((state) => state.LatlongSlices.userLatLong);
  const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);
  logger.log("This is an LocationData ****", latLongData);
  console.log("This is an testing....");
  useEffect(() => {
    const endpoint = `/api/v1/Catalog/GetFullCart?CustomerID=${cutomerId}`; // Replace with your actual API endpoint
    fetchCartData(endpoint);
    setLoading(true)
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      setcartitem(0)
      fetchCartDataa()
    }, []))
  const [cartItem, setcartitem] = useState(null)
  // console.log(cartItem,"------------------->")
  const fetchCartDataa = async () => {
    try {
      const endpoint = `api/v1/Catalog/GetFullCart?CustomerID=${cutomerId}`;
      const response = await Api.fetchEndpointData(endpoint);
      const TotalQuantity = response.data.map((data) => {
        setcartitem(data.totalQuantity);
      }
      )
      dispatch(setCartData(response.data));
      dispatch(setCartError(null));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleLocationSelect = (location) => {
    dispatch(clearData());
    logger.log("selected Location name", location.name);
    setSelectedLocation(location.name); // Assuming you want to store the location name
    setLocationName(location.name);

    // You can now use location.latitude and location.longitude in your component
    setCurrentLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    });
    dispatch(setLatLongData([location.latitude + "," + location.longitude]));
  };

  const fetchCartData = async (endpoint: string) => {
    try {
      const response = await Api.fetchEndpointData(endpoint);
      const totalQuantityFromResponse = response.data[0]?.totalQuantity || 0;
      logger.log("*******", totalQuantityFromResponse);
      setTotalQuantity(totalQuantityFromResponse);
      setLoading(false)
    } catch (error) {
      // dispatch(setError('Error fetching data. Please try again.'));
      logger.error("Error fetching data:", error);
      setLoading(false)
    }
  };

  // logger.log("This is lattide after change ", selectedLocation.coords.longitude);

  const requestLocationPermission = async () => {
    if (Platform.OS === "ios") {
      getOneTimeLocation();
    } else {
      logger.debug("Checking users current location");
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Access Required",
            message: "This App needs to Access your location",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // To Check, If Permission is granted
          getOneTimeLocation();
        } else {
          logger.log("Permission Denied");
        }
      } catch (err) {
        logger.warn(err);
      }
    }
  };

  const getOneTimeLocation = async () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        getGeolocationName(position.coords.latitude, position.coords.longitude);

        setAsyncStorageData(position.coords.latitude, position.coords.longitude)
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        dispatch(
          setLatLongData([position.coords.latitude, position.coords.longitude])
        );
      },
      (error) => {
        logger.log(error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 60000,
        maximumAge: 1000,
      }
    );
  };
  const setAsyncStorageData = async (lat, lon) => {
    console.log(lat, lon, "\\\\\\\\\\\\\\\\\\\\\\\\\\\\")
    try {
      await AsyncStorage.setItem('lat', lat.toString());
      await AsyncStorage.setItem('long', lon.toString());
      console.log('Data stored successfully.');
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };

  const getGeolocationName = async (latitude, longitude) => {
    try {
      const apiKey = MAP_API_KEY;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      if (response.data.results.length > 0) {
        const formattedAddress = response.data.results[0].formatted_address;
        setLocationName(formattedAddress);
        setLoading(false)

      } else {
        setLocationName("Location not found");
        Toast.show({
          visibilityTime: 2000,
          text1: "Vonzuu",
          text2: "loacation not found",
          type: "error"
        })
        setLoading(false)
      }
    } catch (error) {
      logger.error("Error fetching location name:", error);
      setLocationName("Location not found");
      Toast.show({
        visibilityTime: 2000,
        text1: "Vonzuu",
        text2: "Loaction not found please selcet loaction",
        type: "error"
      })
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const firstAddressPart =
    splitAddress.length > 0 ? (
      <Text
        style={[
          GlobleStyle.CustomFont,
          { fontSize: 13, color: "black", left: 10, textAlign: "auto" },
        ]}
      >
        {locationName === "Barbados" ? splitAddress[0] : splitAddress[1]}
      </Text>
    ) : null;

  function addEllipsisAfterCharacters(text, maxChars) {
    if (text.length <= maxChars) {
      return text;
    }
    const truncatedText = text.substring(0, maxChars);
    return `${truncatedText} ...`;
  }
  const maxChars = 28; // The maximum number of characters you want to display before adding "..."
  const remainingAddress =
    splitAddress.length > 2 ? (
      <Text
        style={[
          GlobleStyle.CustomFontText,
          { fontSize: 11, color: "grey", left: 10, textAlign: "auto" },
        ]}
      >
        {addEllipsisAfterCharacters(splitAddress.slice(2).join(", "), maxChars)}
      </Text>
    ) : null;

  const navigation = useNavigation();

  logger.log("This is an Location name", locationName);
  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {
        Loading ? (<View style={{ height: "100%", alignItems: "center", justifyContent: "center" }}>
          <Wave size={50} color='#33FFC2' animating={Loading} />
        </View>) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    top: 5,
                    marginHorizontal: 5,
                  }}
                >
                  <View style={{ flexDirection: "row", flex: 3 }}>
                    <SimpleLineIcons
                      name="location-pin"
                      size={30}
                      color="#33FFC2"
                    />
                    <View style={{ flexDirection: "row", flex: 1 }}>
                      {locationName ? (
                        <TouchableOpacity
                          key="toSearchLocation"
                          onPress={() =>
                            navigation.navigate("SearchLocation", {
                              onLocationSelect: handleLocationSelect,
                            })
                          }
                        >
                          {firstAddressPart}
                          {remainingAddress}
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity onPress={() => navigation.navigate("SearchLocation", {
                          onLocationSelect: handleLocationSelect,
                        })}>
                          <Text style={{ color: 'gray', fontSize: RFPercentage(1.6) }}>Fetching Location...</Text>
                        </TouchableOpacity>

                      )}
                      <MaterialIcons
                        name="keyboard-arrow-down"
                        color="black"
                        size={25}
                        style={{ left: 10 }}
                      />
                    </View>
                  </View>

                  <View
                    style={{
                      height: 40,
                      backgroundColor: "#F2F5F8",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                      flex: 1,
                    }}
                  >
                    <Text style={[GlobleStyle.CustomFont, styles.deliveryBtn]}>
                      Delivery
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                key="toSearchDishesRestaurants"
                onPress={() =>
                  navigation.navigate("SearchDishesRestaurant", {
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                  })
                }
                style={styles.mainSearch}
              >
                <View>
                  <AntDesign name="search1" style={styles.searchIcon} />
                </View>
                <View>
                  <Text style={styles.textInput}>
                    Search for services and partners....
                  </Text>
                </View>
              </TouchableOpacity>

              {/* {currentLocation.latitude !== null &&
     currentLocation.longitude !== null && (
   <ProductCategory />
     )} */}
     {currentLocation.latitude !== null &&
                currentLocation.longitude !== null && (
              <ProductCategory currentLocation={currentLocation}  cutomerId={cutomerId} />
     )}

              {/* {currentLocation.latitude !== null &&
                currentLocation.longitude !== null && (
                  <LocalBrands currentLocation={currentLocation} />
                )} */}
           
              {/* <SpecialOffers /> */}

              {/* <InternationalBrands /> */}

              {/* <FoodOutlets /> */}

              {/* <PopularRestaurants /> */}
            </View>

          </ScrollView>
        )
      }
      {cartItem > 0 ? (
        <TouchableOpacity
          key="toMyCart"
          onPress={() => navigation.navigate("MyCart")}
          style={styles.cartMainContainer}
        >

          <AntDesign name="shoppingcart" size={25} color={"white"} />

          <View
            style={{
              position: "absolute", right: -8, top: -6,
              backgroundColor: "#33FFC2",
              height: 20,
              width: 20,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: RFPercentage(1.7),
                fontWeight: "bold",
                color: "black",
                textAlign: "center",
              }}
            >
              {cartItem}
            </Text>
          </View>

        </TouchableOpacity>
      ) : (
        <View></View>
      )}

 </SafeAreaView>  
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 7,
    position: "relative",
  },
  textInput: {
    flex: 1,
    height: responsiveHeight(5.5),
    borderRadius: 5,
    paddingHorizontal: 5,
    alignItems: "center",
    fontSize: 18,
    color: "#8D9DA8",
    top: 6,
  },
  mainSearch: {
    marginVertical: 10,
    elevation: 7,
    backgroundColor: "white",
    borderRadius: 10,
    marginHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#E7ECEF",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    top: 10,
  },
  searchIcon: {
    fontSize: responsiveHeight(3.5),
    marginHorizontal: 5,
    justifyContent: "center",
  },
  mapIconImage: {
    height: 25,
    width: 25,
    backgroundColor: "#f5f5f5",
    // tintColor:"black"
  },
  deliveryBtn: {
    color: "#9B56FF",
    fontSize: 16,
  },
  cartMainContainer: {
    height: 40,
    width: 40,
    justifyContent: "center",
    borderRadius: 25,
    right: 20, bottom: 50,
    position: "absolute",
    backgroundColor: "#091223",
    flexDirection: "row",
    alignItems: "center",
  },
});

export default HomeScreen;