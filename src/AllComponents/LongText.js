import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { wp } from '../utils/SizeResponcive';
import { RFPercentage } from 'react-native-responsive-fontsize';
import GlobleStyle from '../utils/GlobleStyle';
 
const LongText = ({ text, maxLength = 30 }) => {
    const [showAllText, setShowAllText] = useState(false);
 
    const toggleText = () => {
      setShowAllText(!showAllText);
    };
  return (
    <View>
    <Text style={[GlobleStyle.CustomFont,{paddingHorizontal:15,color:"black",width:wp(68),fontSize:RFPercentage(1.9),}]}>
      {showAllText ? text : `${text.slice(0, maxLength)}...`}
      {!showAllText && (
        <TouchableOpacity onPress={toggleText}>
    
          <Text style={{ color:"black",fontSize:RFPercentage(1.8),fontFamily: "Poppins-SemiBold",marginHorizontal:20}}>Show more</Text>
        </TouchableOpacity>
      )}
      {showAllText && (
        <TouchableOpacity onPress={toggleText}>
          <Text style={{ color:"#8296A9",tSize:RFPercentage(1.8),fontFamily:"Poppins-SemiBold",marginHorizontal:20}}>Show less</Text>
        </TouchableOpacity>
      )}
    </Text>
  </View>
  )
}

export default LongText

const styles = StyleSheet.create({})