import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { responsiveScreenHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GlobleStyle from '../utils/GlobleStyle';
 
const SearchAddress = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
        placeholderTextColor={"grey"}
          placeholder='Search for area, street or location'
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.backButton}
          
          onPress={() => navigation.navigate('ManageAddress')}
        >
          <Ionicons name="chevron-back" size={30} color={"black"} />
        </TouchableOpacity>
      </View>
      <View style={styles.divider}></View>
      <TouchableOpacity onPress={()=>navigation.navigate('AddNewAdress')}>
      <View style={styles.locationContainer}>
        <View style={styles.locationIcon}>
          <MaterialIcons name="my-location" size={30} color={"green"} />
        </View>
        <View style={styles.locationText}>
          <Text style={[GlobleStyle.CustomFont, styles.locationTitle]}>Your Current Location</Text>
          <Text style={[GlobleStyle.CustomFontText, styles.locationDescription]}>Using GPS</Text>
        </View>
      </View>
     </TouchableOpacity>
    </View>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  inputContainer: {
    height: responsiveScreenHeight(6),
    width: responsiveWidth(90),
    justifyContent: 'center',
    backgroundColor: "#E7ECEF",
    marginHorizontal: 20,
    borderRadius: 10
  },
  input: {
    left: 40,
    top: 12,
    alignItems: "center",
    justifyContent: "center",
    top: 22,
    fontSize:20,
    color:"black",
  },
  backButton: {
    bottom: 25,
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  divider: {
    borderWidth: 1,
    borderColor: '#E3E7EF',
    marginTop: 20
  },
  locationContainer: {
    flexDirection: "row",
    margin: 15
  },
  locationIcon: {
    height: 60,
    width: 60,
    backgroundColor: "#9CFFE1",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10
  },
  locationText: {
    left: 10
  },
  locationTitle: {
    color: "#1DC291",
    fontSize: 18
  },
  locationDescription: {
    color: "black",
    fontSize: 15
  }
});
 
export default SearchAddress;
 