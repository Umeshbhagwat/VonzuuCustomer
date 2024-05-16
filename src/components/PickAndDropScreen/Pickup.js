import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, SafeAreaView, Image, StyleSheet } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import GlobleStyle from '../../utils/GlobleStyle';
import { FlatList } from 'react-native-gesture-handler';
import { RadioButton } from "react-native-paper";
import Api from '../../services/Api';
import Toast from "react-native-toast-message";

export default function Pickup({ route }) {
  const { responceVehicle, stops, currentLocation } = route.params;
 
  const lastLocation = stops[stops.length - 1];
  console.log("These are the Stops....", lastLocation);
  const navigation = useNavigation();
  const [selectedItem, setSelectedItem] = useState(null);
  const [polylineCoordinates, setPolylineCoordinates] = useState([]);
  const [allPaymentMethods,setAllPAymentMethods]=useState([])
  const [fare,setFare]=useState("");
  const [paymentMethod, setPaymentMethod] = useState('Cash'); // Default payment method
  const [veHicalIdRiderId,setVehicalIdRiderId]=useState({})

  console.log("/////////>>>>>>>>>>>>>>>>>",veHicalIdRiderId);
  console.log("this is an payment method",paymentMethod)
  useEffect(()=>{
     getPaymentMethod();
    
  },[])

  useEffect(() => {
    if (stops.length > 0) {
      const coordinates = stops.map(stop => ({
        latitude: parseFloat(stop.latitude),
        longitude: parseFloat(stop.longitude)
      }));
      setPolylineCoordinates(coordinates);
    }
  }, [stops]);

  const getPaymentMethod=async()=>{
    try {
      const endPoint=`/api/v1/Payment/PaymentMethodSystemName?StoreID=1046`;
      const response= await Api.fetchEndpointData(endPoint);
      console.log(response.data);
      setAllPAymentMethods(response.data);

    } catch (error) {
      console.log("this is and error",error);
    }
  }

  const handleChooseMotor = () => {
    navigation.navigate('ConfirmPickUp',{currentLocation:currentLocation,lastLocation:lastLocation,fare:fare,responceVehicle:responceVehicle,veHicalIdRiderId:veHicalIdRiderId,paymentMethod:paymentMethod})
  }

  const handleSelectedItem = ({ item, index }) => {
    setSelectedItem(index)
    console.log("This is the fare", item.rideId,"and vehicalId",item.id)
    setFare(item.fare);
    setVehicalIdRiderId({
      riderId:item.rideId,
      vehicalId:item.id
    })
  }

  const renderVehicleItem = ({ item, index }) => {
    const isSelected = selectedItem === index;

    return (   
      <View>
        <TouchableOpacity
          style={{
            padding: 10,
            borderRadius: isSelected ? 15 : 0,
            borderWidth: isSelected ? 1 : 0,
            marginHorizontal: 10
          }}
          onPress={() => handleSelectedItem({item,index})}
        >
          <View style={{ marginLeft: 10, flexDirection: "row", padding: 5, justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row" }}>
              <Image source={{ uri: item.imageURL }} style={{ width: 50, height: 50, }} resizeMode='contain' />
              <Text style={[GlobleStyle.CustomFont, { fontWeight: 'bold', paddingHorizontal: 15, color: "black", alignSelf: "center" }]}>{item.vehicleType}</Text>
              <Ionicons name="person-outline" size={20} color={'black'} style={{ alignSelf: "center" }} />
              <Text style={[GlobleStyle.CustomFont, { alignSelf: "center", color: "black" }]}>{item.seats} </Text>
            </View>
            <View style={{ flexDirection: "row", alignSelf: "flex-end", justifyContent: "flex-end" }}>
              <Text style={[GlobleStyle.CustomFont, { color: "black" }]}> ${item.fare}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPaymentMethods = ({ item, index }) => {
    return (
      <View style={{paddingHorizontal:5,}}>
        <RadioButton.Group 
          onValueChange={value => setPaymentMethod(value)} 
          value={paymentMethod}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center',}}>
            <RadioButton.Android uncheckedColor="#BEBEBE" color="#33FFC2" value={item} />
            <Text style={[GlobleStyle.headerText]}>{item}</Text>
          </View>
        </RadioButton.Group>
      </View>
    );
  };
  

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ height: '40%' }}
          initialRegion={{
            latitude: parseFloat(currentLocation.latitude),
            longitude: parseFloat(currentLocation.longitude),
            latitudeDelta: 0.0100,
            longitudeDelta: 0.0100,
          }}
          zoomControlEnabled={true}
        >
          {polylineCoordinates.length > 0 && (
            <Polyline
              coordinates={[
                { latitude: parseFloat(currentLocation.latitude), longitude: parseFloat(currentLocation.longitude) },
                ...polylineCoordinates
              ]}
              strokeColor="#000"
              strokeWidth={2}
            />
          )}
          {stops.map((stop, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(stop.latitude),
                longitude: parseFloat(stop.longitude),
              }}
              title={`Stop ${index + 1}`}
              description={`Stop ${index + 1}`}
            >
              {/* Custom Marker */}
              <View style={styles.customMarker}>
                <Text style={styles.customMarkerText}>{`${index + 1}`}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
     
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', marginBottom: 20, position: "absolute", marginTop: 10,backgroundColor: '#F2F5F8', padding: 10, borderRadius: 15,marginLeft:5 }}>
          <MaterialIcons name="arrow-back" size={30} color={'black'} />
        </TouchableOpacity>
       
        <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderTopLeftRadius: 15, borderTopRightRadius: 15 }}>
          <Text style={[GlobleStyle.CustomFont, { alignSelf: "center", padding: 10, color: "black" }]}>Choose a trip</Text>
         
          <Text style={[GlobleStyle.headerText,{marginRight: 10,color:'black',paddingHorizontal:10}]}>Payment Method:</Text>

          <FlatList
            data={allPaymentMethods}
            renderItem={renderPaymentMethods}
            keyExtractor={(item, index) => index.toString()}
            // numColumns={2}
            // style={{marginVertical:10}}
            scrollEnabled={false}
          />
 
          <FlatList
            data={responceVehicle}
            renderItem={renderVehicleItem}
            keyExtractor={(item, index) => index.toString()}
            
          />

          {selectedItem !== null ? (
            <TouchableOpacity
              onPress={() => handleChooseMotor()}
              style={{
                backgroundColor: "#33FFC2",
                borderRadius: 8,
                alignItems: "center",
                padding: 15,
                marginHorizontal: 10,
                margin: 10
              }}
            >
              <Text style={[styles.signInBtnText, GlobleStyle.CustomHeadingColor]}>
                Choose Moto
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  signInBtnText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  customMarker: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  customMarkerText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
