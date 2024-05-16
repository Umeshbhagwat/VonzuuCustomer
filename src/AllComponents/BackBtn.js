import React from 'react';
import { View, TouchableOpacity, Platform, SafeAreaView, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { TxtResize } from './TxtResize';

export default function BackBtn({Text_Label}) {
  TxtResize
  const navigation = useNavigation();

  return (
    <SafeAreaView>
<View style={{marginTop:20,marginHorizontal:2,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>

      <TouchableOpacity onPress={() => navigation.goBack()} style={{padding: 10, backgroundColor: '#f5f5f5', borderRadius: 15,position:'absolute',left:0}}>
       
          <MaterialIcons name="arrow-back" size={22} color={"black"}/>
      
      </TouchableOpacity>
      <Text style={{alignSelf:'center',fontSize:RFPercentage(2.7),fontFamily:"Poppins-SemiBold",color:"black"}}>{Text_Label}</Text>
</View>
    </SafeAreaView>
  
  );
}
