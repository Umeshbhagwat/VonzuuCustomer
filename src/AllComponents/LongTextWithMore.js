import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { wp } from '../utils/SizeResponcive';
import { RFPercentage } from 'react-native-responsive-fontsize';
 
const LongTextWithMore = ({ text, maxLength = 30 }) => {
  const [showAllText, setShowAllText] = useState(false);
 
  const toggleText = () => {
    setShowAllText(!showAllText);
  };
 
  return (
    <View>
      <Text style={{color:"#737B89",fontSize:RFPercentage(1.5),fontFamily:"Poppins-Regular",marginTop:2,width:wp(36)}}>
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
  );
};
 
export default LongTextWithMore;
 