import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking, // Import Image component
} from "react-native";
import Geolocation from "@react-native-community/geolocation";
import MapView, { Marker, Callout, Polyline } from "react-native-maps";
import GlobleStyle from "../utils/GlobleStyle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RestaurantLocationMarker from "../assets/TrackingSceenImges/restorant.png";
import UsetrLocationMarker from "../assets/TrackingSceenImges/userLocation.png";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { RFPercentage } from "react-native-responsive-fontsize";

const TrackOrder = (props) => {
  const [Lo, setLo] = useState(true);
  // const logic = 45;
  const { data, logic, orderId,orderType} = props.route.params;

  console.log(data, "llllllllllll");
  console.log(orderType, "lllllKKKKKKKKKKKKKKK");
 
  // const navigation = useNavigation()

  useEffect(() => {
    GetRiderData();
    setLo(true);
  }, []);
  const [shipdata, setshipdata] = useState({});
  const [RiderLocation, setRiderLocation] = useState({});
  const [RideDetails,setRideDetails]=useState([])
  console.log(RiderLocation, ";;;;;");
  
  let newData = RideDetails.map(item => {
    // Destructure the object and extract the "otp" field
    const { otp } = item;
    return otp;
  });
  
  console.log(newData[0]); 


  useEffect(() => {
    const intervalId = setInterval(() => {
      GetRiderData();
    }, 5000000); // 3 minutes in milliseconds

    // Clear the interval when the component unmounts or when the effect is re-executed
    return () => clearInterval(intervalId);
  }, []);

  const GetRiderData = async () => {
    console.log("Just testing");
    // setload(true)
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      `https://vonzuu.ordering.prelive.co.in/api/v1/Ordering/GetOrderTrackingDetails?OrderId=${data}`,
      requestOptions
    )
      .then((response) => response.json())
      .then(async (result) => {
        // setload(false)
        if (result.riderLocation) {
          setRiderLocation(result.riderLocation);
          const rides = result.rides;
          setRideDetails(rides);
          console.log(result,"asdsad")
          // fetchDirections()
          rides.forEach((element) => {
            setshipdata(element);
            fetchDirections(element);
            if (logic === 45) {
              // Alert.alert("45")
            } else {
              getAPi2(element.pickupAddressId);
              // Alert.alert("4")
            }
            //  Alert.alert("jat9n")
          });
          setTimeout(() => {
            setLo(false);
          }, 2000);
          console.log(result.rides, "????");
        } else {
          Toast.show({
            text1: `Cureently ${result.message}`,
            type: "error",
            visibilityTime: 3000,
          });
          navigation.goBack();
        }

        // console.log(result,"this is a data")
      })
      // navigation.navigate('TrackOrder',{result})
      .catch((error) => {
        // setload(false)
        Toast.show({
          text1: "Internal Error",
          visibilityTime: 3000,
          type: "error",
        });
        // navigation.('TrackOrder',)
      });
  };

  const [getDaaforgetapi, setgetDaaforgetapi] = useState({});

  const getAPi2 = async (pickupAddressId) => {
    //  Alert.alert("pickupAddressId",pickupAddressId)

    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    fetch(
      `https://vonzuu.basketapi.prelive.co.in/api/v1/basket/Address/GetCustomerAddress?CustomerID=0&AddressID=${pickupAddressId}&StoreId=1046&APIKey=BDD6B8BC-6C51-49C6-8E17-9E09B86E4DBB&UniqueSeoCode=1`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        // setloading(false)

        // console.log(result.result,"kkkkjadshaggsfkghjkjg")
        const res = result.result;
        res.forEach((element) => {
          setgetDaaforgetapi(element);
        });
      })
      .catch((error) => {
        // setloading(false)

        Toast.show({
          text1: "Internal error",
          type: "error",
          visibilityTime: 3000,
        });
      });
  };

  const [Riderlatlong, setRiderlatlong] = useState({
    latitude: 20.399101,
    longitude: 75.588669,
  });

  // console.log(data,"sdasdsad")
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const navigation = useNavigation();
  const [location, setLocation] = useState({
    latitude: 19.407427,
    longitude: 76.434616,
  });

  const riderLatalon = {};
  const [restaurantLocation, setRestaurantLocation] = useState({
    latitude: 20.141453,
    longitude: 77.335495,
  });

  const fetchDirections = async (key) => {
    console.log(key, "key");
    try {
      const apiKey = "AIzaSyDsvTe0OG3oE9PmRu_DUNFRl2Rz3QrbZjc";
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${key.pickuplat},${key.pickupLong}&destination=${key.shippingLat},${key.shippingLong}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.routes.length > 0) {
        const points = data.routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(points);
        setRouteCoordinates(decodedPoints);
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  const decodePolyline = (encoded) => {
    const points = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;
      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };
  const phoneNumberAsNumber = parseInt(RiderLocation.phoneNumber, 10);
  const HandleCallRider = () => {
    const phoneUrl = `tel:${phoneNumberAsNumber}`;
    Linking.openURL(phoneUrl).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  const number = getDaaforgetapi.phoneNumber;
  const callRider = () => {
    const phoneUrl = `tel:${number}`;
    Linking.openURL(phoneUrl).catch((err) =>
      console.error("An error occurred", err)
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        {Lo ? (
          <View>
            <ActivityIndicator size={40} animating={true} color={"red"} />
          </View>
        ) : (
          <View>
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                zIndex: 1,
                left: 10,
              }}
            >
              <TouchableOpacity
                style={{ top: 15 }}
                onPress={() => navigation.goBack()}
              >
                <MaterialIcons name="arrow-back" size={30} color={"black"} />
              </TouchableOpacity>

              <View>
                <Text
                  style={{
                    position: "absolute",
                    top: 10, // Adjust the top position as needed
                    left: 10, // Adjust the left position as needed
                    //   backgroundColor: 'white',
                    color: "black",
                    padding: 5,
                    fontSize: 22,
                    fontWeight: "bold",
                    zIndex: 1, // To ensure it's displayed above the map
                  }}
                >
                  {logic === 45 ? "Rider Location" : " Order Status"}
                </Text>
              </View>
            </View>

{/* {logic === 45 ?(
  null
):( */}
        {/* <View
              style={{
                backgroundColor: "#F6F6F7",
                position: "absolute",
                zIndex: 1,
                width: "95%",
                alignSelf: "center",
                bottom: 10,
                borderRadius: 12,
                shadowColor: "black",
                elevation: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 20,
                  marginVertical: 15,
                }}
              >
                <Image
                  source={require("../assets/images/CookIcon.png")}
                  style={{ width: 40, height: 40 }}
                />
                <View style={{ marginLeft: 7, justifyContent: "center" }}>
                  <Text
                    style={{
                      color: "#2D2A2E",
                      fontSize: RFPercentage(2.4),
                      fontFamily: "Poppins-SemiBold",
                    }}
                  >
                    Order Processed
                  </Text>
                  <Text
                    style={{
                      color: "#2D2A2E",
                      fontSize: RFPercentage(2),
                      fontFamily: "Poppins-Regular",
                    }}
                  >
                    We are preparing your order.
                  </Text>
                </View>
              </View> 

               <View style={{ backgroundColor: "white", paddingHorizontal: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomColor: "#CDD4DA",
                    borderBottomWidth: 1,
                    paddingVertical: 15,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: "#2D2A2E",
                        fontSize: RFPercentage(2.4),
                        fontFamily: "Poppins-SemiBold",
                        width: "60%",
                      }}
                    >
                      Brown Butter Craft Bar & Kitchen
                    </Text>
                    <Text
                      style={{
                        color: "#50616E",
                        fontSize: RFPercentage(1.8),
                        fontFamily: "Poppins-Regular",
                        marginTop: 4,
                      }}
                    >
                      2 items || ETA: 2hr
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => callRider()}>
                    <Image
                      source={require("../assets/images/call.png")}
                      style={{ width: 38, height: 38 }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 15,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: "#2D2A2E",
                        fontSize: RFPercentage(2.4),
                        fontFamily: "Poppins-SemiBold",
                        width: "60%",
                      }}
                    >
                      {RiderLocation.riderName}
                    </Text>
                    <Text
                      style={{
                        color: "#50616E",
                        fontSize: RFPercentage(1.8),
                        fontFamily: "Poppins-Regular",
                        marginTop: 4,
                      }}
                    >
                      {RiderLocation.riderName} can speak English.{" "}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => HandleCallRider()}>
                    <Image
                      source={require("../assets/images/call.png")}
                      style={{ width: 38, height: 38 }}
                    />
                  </TouchableOpacity>
                </View>
              </View> 
            </View> */}
             <View
              style={{
                backgroundColor: "#F6F6F7",
                position: "absolute",
                zIndex: 1,
                width: "95%",
                alignSelf: "center",
                bottom: 10,
                borderRadius: 12,
                shadowColor: "black",
                elevation: 10,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent:"space-around",
                  // marginLeft: 20,
                  marginVertical: 15,
                }}
              >
                
                
                  <Text
                    style={{
                      color: "#2D2A2E",
                      fontSize: RFPercentage(2.4),
                      fontFamily: "Poppins-SemiBold",
                    }}
                  >
                   Arriving in 5 mins
                  </Text>
                  
                  <Text>{newData[0]}</Text>
               
              </View> 

               <View style={{ backgroundColor: "white", paddingHorizontal: 20 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomColor: "#CDD4DA",
                    borderBottomWidth: 1,
                    paddingVertical: 15,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: "#2D2A2E",
                        fontSize: RFPercentage(2.4),
                        fontFamily: "Poppins-SemiBold",
                        width: "60%",
                      }}
                    >
                      Brown Butter Craft Bar & Kitchen
                    </Text>
                    <Text
                      style={{
                        color: "#50616E",
                        fontSize: RFPercentage(1.8),
                        fontFamily: "Poppins-Regular",
                        marginTop: 4,
                      }}
                    >
                      2 items || ETA: 2hr
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => callRider()}>
                    <Image
                      source={require("../assets/images/call.png")}
                      style={{ width: 38, height: 38 }}
                    />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 15,
                  }}
                >
                  <View>
                    <Text
                      style={{
                        color: "#2D2A2E",
                        fontSize: RFPercentage(2.4),
                        fontFamily: "Poppins-SemiBold",
                        width: "60%",
                      }}
                    >
                      {RiderLocation.riderName}
                    </Text>
                    <Text
                      style={{
                        color: "#50616E",
                        fontSize: RFPercentage(1.8),
                        fontFamily: "Poppins-Regular",
                        marginTop: 4,
                      }}
                    >
                      {RiderLocation.riderName} can speak English.{" "}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => HandleCallRider()}>
                    <Image
                      source={require("../assets/images/call.png")}
                      style={{ width: 38, height: 38 }}
                    />
                  </TouchableOpacity>
                </View>
              </View> 
            </View>

{/* )

} */}

          
            <MapView
              style={{ height: "100%", width: "100%" }}
              initialRegion={{
                latitude: shipdata.pickuplat,
                longitude: shipdata.pickupLong,

                //  latitude: 20.141453,
                //  longitude:77.335495 ,

                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
              showsCompass={true}
              zoomControlEnabled={true}
            >
              <Marker
                coordinate={{
                  latitude: shipdata.shippingLat,
                  longitude: shipdata.shippingLong,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <Image
                  source={UsetrLocationMarker}
                  style={{ width: 30, height: 30, resizeMode: "contain" }}
                />
              </Marker>

              <Marker
                coordinate={{
                  latitude: RiderLocation.latitude,
                  longitude: RiderLocation.longitude,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <Image
                  source={require("../assets/images/Scooterr.png")}
                  style={{ width: 40, height: 40 }}
                />
              </Marker>

              <Marker
                coordinate={{
                  latitude: shipdata.pickuplat,
                  longitude: shipdata.pickupLong,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <Image
                  source={RestaurantLocationMarker}
                  style={{ width: 20, height: 20 }}
                  resizeMode="contain"
                />
              </Marker>
              {location && restaurantLocation && (
                <Polyline
                  coordinates={routeCoordinates}
                  strokeColor="#000"
                  strokeWidth={2}
                />
              )}
            </MapView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // ... your existing styles
});

export default TrackOrder;
