import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, TextInput, Alert,Text, Button, StyleSheet, ScrollView, TouchableOpacity, FlatList, PanResponder } from 'react-native';
import BackBtn from '../../AllComponents/BackBtn';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Geolocation from "@react-native-community/geolocation";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapView, { Marker ,Polyline} from 'react-native-maps';
import axios from 'axios';
import { MAP_API_KEY } from "@env";
import Toast from "react-native-toast-message"
import { useNavigation } from '@react-navigation/native';
import GlobleStyle from '../../utils/GlobleStyle';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import Modal from "react-native-modal";
import Api from '../../services/Api';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function PickAndDrop({ route }) {
  const [currentLocation, setCurrentLocation] = useState({ latitude: null, longitude: null });
  const [locationName, setLocationName] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isBottomModal,setBottomModal]=useState(false);
  const [name,setName]=useState('');
  const [phoneNumber,setPhoneNumber]=useState('');
  // const [lastDestinationName,setLastDestinationName]=('')
  const [destinations, setDestinations] = useState([""]);
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState([]);
  const [SelectedDestination,SetSelectedDestinations]=useState([])
  const [selectedDestiLocation, setSelectedDestiLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);
  const { selectedLocation, selectedDestination } = route.params;
  const [error,setError]=useState(false);
  const navigation = useNavigation();
  
  
  const filteredData = destinations.filter(item => item !== "");
  console.log("/////////",filteredData);
  const stops=[];
  filteredData.forEach(location => {
    console.log("This is Locations #####",location.name);
    // setLastDestinationName(location.name)
    const { latitude, longitude } = location;
    // Push latitude and longitude into the stops array
    stops.push({ latitude: latitude.toString(), longitude: longitude.toString() });
  });


  const decodePolyline = encoded => {
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
      points.push({latitude: lat / 1e5, longitude: lng / 1e5});
    }
    return points;
  };

  const fetchDirectionsForLocations = async (locations) => {
   
    for (const address of locations) {
      await fetchDirections(address);
    }
    
  };

  const fetchDirections = async (address) => {
    try {

      const apiKey = "AIzaSyDsvTe0OG3oE9PmRu_DUNFRl2Rz3QrbZjc";
    
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${address.latitude},${address.longitude}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.routes.length > 0) {
        const points = data.routes[0].overview_polyline.points;
        const decodedPoints = decodePolyline(points);
        setRouteCoordinates(decodedPoints);
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };
  
  useEffect(async()=>{
    getAsyncData()
    // setPhoneNumber(custMobileNo)
  },[])
  const [first, setNamess] = useState("")
  console.log(first,"main data")
const getAsyncData = async() =>{
  const custFirstName = await AsyncStorage.getItem("custFirstName");
  const custMobileNo = await AsyncStorage.getItem("custMobileNo");
//  console.log(">>>>>>>",custFirstName,">>>>>>",custMobileNo);
// Alert.alert(custFirstName)
setName(custFirstName)
setPhoneNumber(custMobileNo)
}

  useEffect(() => {
    if (selectedLocation && selectedLocation.latitude && selectedLocation.longitude) {
      const { latitude, longitude, name } = selectedLocation;
      setCurrentLocation({ latitude, longitude });
      setLocationName(name);
      
    }
  }, [selectedDestination]);

  useEffect(() => {
    if (!selectedDestination) {
      getOneTimeLocation();
    }
    fetchDirectionsForLocations(filteredData)
  }, []);

  const toggleModal = () => {
    setPredictions([]);
    setModalVisible(!isModalVisible);
   
  };

  const handleSearch = (text) => {
    const apiKey = MAP_API_KEY;
    const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${apiKey}`;
    axios
      .get(apiUrl)
      .then((response) => {
        const predictions = response.data.predictions.map((item) => item.description);
        setPredictions(predictions);
      })
      .catch((error) => {
        console.error('Error fetching predictions: ', error);
      });
  };

  const handlePredictionSelect = (prediction) => {
    setSearchText(prediction);
    setPredictions([]);
    getGeolocationCoordinates(prediction);
    setModalVisible(false);
    
  };

  const getGeolocationCoordinates = async (location) => {
    try {
      const apiKey = MAP_API_KEY;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${apiKey}`
      );
  
      if (response.data.results.length > 0) {
        const coordinates = response.data.results[0].geometry.location;
        const { lat, lng } = coordinates;
        const selectedLocation = {
          latitude: lat,
          longitude: lng,
          name: location,
        };
  
        // Spread the existing destinations and add the new selectedLocation
        const updatedDestinations = [...destinations, selectedLocation];
        setSelectedDestiLocation(selectedLocation);
        setDestinations(updatedDestinations);
        setModalVisible(false);
      }
    } catch (error) {
      console.error('Error fetching location coordinates:', error);
    }
  };
  
  const getOneTimeLocation = async () => {
    try {
      const granted = await requestLocationPermission();
      if (granted) {
        Geolocation.getCurrentPosition(
          async (position) => {
            getGeolocationName(position.coords.latitude, position.coords.longitude);

            setCurrentLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error(error.message);
          },
          {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 1000,
          }
        );
      } else {
        console.warn('Location permission denied');
      }
    } catch (error) {
      console.error('Error in getting location:', error);
    }
  };
  const getGeolocationName = async (latitude, longitude) => {
    try {
      const apiKey = MAP_API_KEY;
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );


      if (response.data.results.length > 0) {
        const formattedAddress = response.data.results[2].formatted_address;
        setLocationName(formattedAddress);
      } else {
        setLocationName("Location not found");
        showToast("Location not found", "error");
      }
    } catch (error) {
      console.error("Error fetching location name:", error);
      setLocationName("Location not found");
      showToast("Location not found, please select location", "error");
    }
  };
  const requestLocationPermission = async () => {
    return true;
  };
  const next = () => {
    navigation.navigate('SearchLocationPandD');
  };
  const handleDestinationChange = () => {
   
    toggleModal(); // Open the modal when this function is called
   
  };
  const handleAddMoreDestination = () => {
    setDestinations([...destinations, ""]); // Add an empty string for a new destination
  };

  const handleRemoveDestination = (index) => {
    if (index >= 0 && index < destinations.length) {
      const updatedDestinations = [...destinations];
      updatedDestinations.splice(index, 1); // Remove the destination at the specified index
      setDestinations(updatedDestinations);
    }
  };
 const handleBookingFor=()=>{
     setBottomModal(true);
 }

  const showToast = (message, type) => {
    Toast.show({
      visibilityTime: 2000,
      text1: "Vonzuu",
      text2: message,
      type,
    });
  };

  const phoneNumberValidation = (text) => {
    const phoneNumberRegex = /^\d{10}$/;

    if (!phoneNumberRegex.test(text)) {
      setError(true);
      Toast.show({
        visibilityTime: 5000,
        text1: "Vonzuu",
        text2: "Phone number must be 10 digits",
        text2Style: { color: "black" },
        type: "error",
      });
    } else {
      setError(false);
      console.log("Phone Number", text, "name", name);
    }
  };

  const handleNameAndPhone = () => {
    const phoneNumberRegex = /^\d{10}$/;
    if (!phoneNumberRegex.test(phoneNumber)) {
      setError(true);
      console.log("Phone number must be 10 digits");
    } else {
      setError(false);
      setBottomModal(false);
      Toast.show({
        visibilityTime: 4000,
        text1: "Vonzuu",
        text2: "Data Successfully Updated",
        text2Style: { color: "black" },
        type: "success",
      });
      console.log("Phone Number", phoneNumber, "name", name);
    }
  };

  const handleConformLocation = async () => {
    try {
      const endPoint = "/api/v1/Ride/AddRoute";
      const data = {
        "id": 0,
        "sourceLatitude":`${currentLocation.latitude}` ,
        "sourceLongitude": `${currentLocation.longitude}`,
        "destinationLatitude": "string",
        "destinationLongitude": "string",
        "stops":stops,
        "totalDistance": 0,
        "passanger": true,
        "storeID": 1046,
        "dateTime": "2024-03-28T10:35:59.659Z",
        "customerID": `${cutomerId}`,
        "contactPerson": `${name}`,
        "contactNumber": `${phoneNumber}`,
        "paymentMethodSystemName":"",
      };
      console.log("Test ####",data);
      const response = await Api.postEndpointData(endPoint, data);
      const responceVehicle=response.data.data;
      console.log("Response:>>>>>>>>>>>>", responceVehicle);
      if (response.data.statusCode === 200){
          console.log("Juust check")
          navigation.navigate('Pickup', { responceVehicle: responceVehicle, stops: stops ,currentLocation:currentLocation,});
      }
     
    } catch (error) {
      console.log("Error in data posting", error);
    }
  };
  

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => handleDestinationChange()}
      style={{
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'black',
        marginTop: 15,
        borderRadius: 10,
        marginRight: 50,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        paddingVertical: 10,
      }}
    >
      <FontAwesome name="map-marker" size={30} color="#00DB99" style={{}} />
      <Text style={{ textAlign: 'auto', alignContent: 'center',paddingVertical:1,color:"black"}}>
        {index === 0 ? 'Initial Destination' : item.name ? item.name : ''}
      </Text>
      <Ionicons name="close" size={22} color="red" onPress={() => handleRemoveDestination(index)} />
    </TouchableOpacity>
  );
    
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <BackBtn Text_Label={"Plan your ride"} />
      <TouchableOpacity style={{padding:5,justifyContent:"flex-end",alignItems:"flex-end",backgroundColor:'#33FFC2',alignSelf:'flex-end',marginRight:10,borderRadius:5}} onPress={()=>handleBookingFor()}>
        <Text style={{color:'black',fontSize:15,fontWeight:"bold"}}>Booking for?</Text>
      </TouchableOpacity>
     
      <View style={{ marginHorizontal: 10, justifyContent: 'center' }}>
        
        <TouchableOpacity
          style={{ flexDirection: "row", padding: 5, borderWidth: 1,borderColor: "black",marginTop: 20,borderRadius: 10,marginRight: 50 }}
          onPress={() => next()}
        >
          <FontAwesome name="map-marker" size={30} color={"black"} style={{ alignSelf: "center" }} />
          <TextInput
            placeholder='Start'
           
            style={{ left: 20, alignSelf: "center", width: "88%", paddingHorizontal: 10, paddingVertical:2,color:"black" }}
            value={locationName}
            editable={true}
            onChangeText={(text) => setLocationName(text)}
          />
        </TouchableOpacity>

       {/* <TouchableOpacity   style={{padding:5,backgroundColor:"red",justifyContent:"flex-end",alignItems:"flex-end"}}> */}
        <Ionicons
          name="add-outline"
          size={30}
          color={"red"}
          style={{ position: "absolute", right: 10 }}
          onPress={() => handleAddMoreDestination()} 
        />

 <FlatList
        data={destinations}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        extraData={draggedIndex} // Ensure re-rendering when draggedIndex changes
      />

      </View> 

      <View style={{ flex: 1, marginTop: 10 }}>
        {currentLocation.latitude && currentLocation.longitude && (
          <MapView
            style={{ flex: 1, marginTop: 10 }}
            region={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.0100,
              longitudeDelta: 0.0100,
            }}
            zoomControlEnabled={true}
          >
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Current Location"
              description="This is your current location"
            />
             { 
           <Polyline
           coordinates={routeCoordinates}
           strokeColor="#000"
           strokeWidth={2}
         />
          }
        
          </MapView>
        )}
        {
          stops.length >0?(
            <TouchableOpacity style={{padding:15,backgroundColor:'#33FFC2',alignSelf:"center",position:"absolute",bottom:10,paddingHorizontal:50,borderRadius:10}} onPress={()=>handleConformLocation()}>
           
              <Text style={[GlobleStyle.CustomFont,{textAlign:"center",color:"black",fontSize:16,}]}> Confirm location </Text>
           
              
            </TouchableOpacity>
          ):(null)
        }
          
      </View>
      <Modal
       style={{ margin: 0 }}
        animationType="slide"
        transparent={false}
        visible={isModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          toggleModal();
        }}
      >
     
     <SafeAreaView style={styles.container}>
          <View>
            <View style={{ flexDirection: 'row', marginBottom: 20,}}>
              <TouchableOpacity onPress={() => toggleModal()}>
                <View style={{ backgroundColor: '#F2F5F8', padding: 8, borderRadius: 15 }}>
                  <MaterialIcons name="arrow-back" size={30} color={'black'} />
                </View>
              </TouchableOpacity>

              <View style={{ justifyContent: 'center' }}>
                <Text style={[GlobleStyle.CustomFont, { fontSize: 20, color: 'black',left:20}]}>Select a Location</Text>
              </View>
            </View>
          </View>
          <View style={styles.inputContainer}>
            <AntDesign name="search1" size={20} color="gray" style={styles.searchIcon} />
            <TextInput
              // style={styles.input}
              placeholder="Search for a location"
              placeholderTextColor={'grey'}
              value={searchText}
              onChangeText={(text) => {
                setSearchText(text);
                handleSearch(text);
              }}
            />
          </View>

          <ScrollView style={styles.locationList}>
            {predictions.map((prediction, index) => (
              <TouchableOpacity key={index} onPress={() => handlePredictionSelect(prediction)}>
                <View style={styles.locationItem}>
                  <Text style={{ padding: 10, color: 'black' }}>{prediction}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {isBottomModal?(
          <Modal 
          isVisible={isBottomModal}
          style={{ margin: 0 }}
          backdropTransitionOutTiming={0}
          onBackdropPress={() => setBottomModal(false)}
          onSwipeComplete={() => setBottomModal(false)}
          swipeDirection={["down"]}
        
          >
           
          <View style={{backgroundColor:"#FFFFFF",position:"absolute",width:'100%',bottom:0,borderTopLeftRadius:10,borderTopRightRadius:10}}>
            <ScrollView>
            <View style={{padding:25}}>    
            <Text style={{paddingVertical:10,color:"black"}}>Your name</Text>
            <TextInput placeholder='Enter the name'
              onChangeText={(text)=>setName(text)}
              value={name}

            style={{padding:12,borderRadius:10,borderWidth:1,borderColor:"8D9DA8"}}/>

          <TextInput
                  placeholder='Enter the Phone Number'
                  onChangeText={(text) => {
                    setPhoneNumber(text);
                    phoneNumberValidation(text);
                  }}
                  value={phoneNumber}
                  keyboardType={'phone-pad'}
                  maxLength={10}
                  style={{ padding: 12, borderRadius: 10, borderWidth: 1, borderColor: error ? "red" : "#8D9DA8",marginVertical:10}}
                />
    

           <TouchableOpacity style={{padding:15,backgroundColor:"red",marginVertical:30,borderRadius:10}} onPress={()=>handleNameAndPhone()}>
              <Text style={[GlobleStyle.CustomFont,{alignSelf:"center",color:"white"}]}>Add rider</Text>
            </TouchableOpacity> 
            
            </View>
          </ScrollView>
          </View>
      
        </Modal>
      ):(null)
    
     }
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    marginHorizontal:10
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    elevation: 7,
  },
  searchIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    color: 'black',
  },
  locationList: {},
  locationItem: {
    width: '98%',
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '8D9DA8'
  },
  inputError: {
    borderColor: 'red'
  },
  errorText: {
    color: 'red',
    marginTop: 5,
    marginLeft: 10
  }
  
});


