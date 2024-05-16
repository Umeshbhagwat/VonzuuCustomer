import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { wp } from '../utils/SizeResponcive';
import { RFPercentage } from 'react-native-responsive-fontsize';
 

const Long = ({ text, maxLength = 40 }) => {
    const [showAllText, setShowAllText] = useState(false);
 
    const toggleText = () => {
      setShowAllText(!showAllText);
    };
  return (
    <View>
      <Text style={{ color: "#737B89",
          fontFamily: "Poppins-Regular",
          fontSize: RFPercentage(1.4),
          marginTop: 2,
          width: wp(30),}}>
        {showAllText ? text : `${text.slice(0, maxLength)}...`}
        {!showAllText && (
          <TouchableOpacity onPress={toggleText}>
            <Text style={{ color:"black",fontSize:RFPercentage(1.5),fontFamily:"Poppins-Regular",marginTop:2}}>Show more</Text>
          </TouchableOpacity>
        )}
        {showAllText && (
          <TouchableOpacity onPress={toggleText}>
            <Text style={{ color:"black",fontSize:RFPercentage(1.5),fontFamily:"Poppins-Regular",marginTop:2 }}>Show less</Text>
          </TouchableOpacity>
        )}
      </Text>
    </View>
  )
}

export default Long

const styles = StyleSheet.create({})