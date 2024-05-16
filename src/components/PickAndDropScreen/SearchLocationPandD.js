import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import axios from 'axios';
import GlobleStyle from '../../utils/GlobleStyle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {MAP_API_KEY} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
 
const SearchLocationPandD = () => {
  const navigation = useNavigation();    
  const [searchText, setSearchText] = useState('');
  const [predictions, setPredictions] = useState([]);
 
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
  
    // Fetch the latitude and longitude for the selected location and pass it to onLocationSelect callback
    getGeolocationCoordinates(prediction);
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
          name: location, // You may want to include the location name as well
        };
        
        const selectedDestination={
          latitude: lat,
          longitude: lng,
          name: location, 
        };
        
        navigation.navigate("PickAndDrop",{selectedLocation,selectedDestination});
      }
    } catch (error) {
      console.error('Error fetching location coordinates:', error);
    }
  };

  const setAsyncStorageData = async (lat,lon) => {
    console.log(lat,lon,"\\\\\\\\\\\\\\\\\\\\\\\\\\\\")
    try {
    //   await AsyncStorage.setItem('lat', lat.toString());
    //   await AsyncStorage.setItem('long', lon.toString());
      console.log('Data stored successfully.');
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };
  
  return (
    <SafeAreaView style={{flex:1,backgroundColor:"FFFFFF"}}>
    <View style={styles.container}>
        <View>
        <View style={{ flexDirection: 'row',marginBottom:20}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={{  backgroundColor: '#F2F5F8', padding:10, borderRadius: 15, }}>
            <MaterialIcons name="arrow-back" size={30} color={"black"} />
          </View>
        </TouchableOpacity>
 
        <View style={{ justifyContent: "center", }}>
          <Text style={[GlobleStyle.CustomFont, { fontSize: 20, color: "black" }]}> Select a Location </Text>
        </View>
      </View>
        </View>
      <View style={styles.inputContainer}>
        <AntDesign name="search1" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search for a location"
          placeholderTextColor={"grey"}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            handleSearch(text);
          }}
        />
      </View>
 
      <ScrollView style={styles.locationList}>
        {predictions.map((prediction, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handlePredictionSelect(prediction)}
          >
            <View style={styles.locationItem}>
              <Text style={{padding:10,color:"black"}}>{prediction}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
   </SafeAreaView> 
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor:'#FFFFFF',elevation:7
  },
  searchIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    color:"black"
  },
  locationList: {
    // marginTop: 8,
    //  padding:10,
    //  borderRadius:10
  },
  locationItem: {
    width:"98%",marginVertical:10,
    backgroundColor:"#FFFFFF",borderRadius:10,elevation:5
 
  },
});
 
export default SearchLocationPandD;
 