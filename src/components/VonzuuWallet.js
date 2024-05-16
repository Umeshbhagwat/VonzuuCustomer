import React from 'react';
import { View, Text,TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Foundation from 'react-native-vector-icons/Foundation';
import GlobleStyle from '../utils/GlobleStyle';
import { responsiveHeight,responsiveWidth } from 'react-native-responsive-dimensions';

const VonzuuWallet = () => {
    const navigation=useNavigation()
  return (
    <View style={{flex:1,backgroundColor:"#FFFFFF"}}>
      <View style={{flexDirection:"row", alignItems:"center"}}>
      <TouchableOpacity onPress={()=>navigation.navigate('Account')} >
          <View style={{ padding: 8, backgroundColor: '#F2F5F8', width: 45, borderRadius: 10, left: 10 }}>
            <MaterialIcons name="arrow-back" size={25} color={"black"} />
          </View>
        </TouchableOpacity>
            <View style={{left:20}}>
               <Text style={[GlobleStyle.CustomFont,{fontSize:22,color:"black"}]}>Vonzuu Wallet </Text>
            </View>
      </View>  
     
     <View style={{width:responsiveWidth(90),height:responsiveHeight(30),backgroundColor:"#EBFFF9",margin:15,borderRadius:20,padding:20}}>
         
           <View>
            <Text style={[GlobleStyle.CustomFontText,{fontSize:20,color:"black"}]}>Total balance </Text>
            <Text style={[GlobleStyle.CustomFont,{fontSize:50,color:"black"}]}>$32</Text>
          </View> 

          <View style={{flexDirection:"row",}}>
          <View style={{ height: 80, width: 80, backgroundColor: '#98FF98', borderRadius: 50, justifyContent: "center", alignItems: "center",top:-130,left:210}}>
            <View style={{ height: 60, width: 60, backgroundColor: '#36FCA9', borderRadius: 30, justifyContent: "center", alignItems: "center", transform: [{ rotate: '120deg' }] }}>
                <Foundation name="dollar" size={45} color={"#FFFFFF"} />
            </View>  
            </View>

            <View style={{ height: 50, width: 50, backgroundColor: '#98FF98', borderRadius: 20, justifyContent: "center", alignItems: "center" ,left:180,top:-55}}>
            <View style={{ height: 38, width: 38, backgroundColor: '#36FCA9', borderRadius: 25, justifyContent: "center", alignItems: "center", transform: [{ rotate: '120deg' }] }}>
                <Foundation name="dollar" size={40} color={"#FFFFFF"} />
            </View>  
            </View>

            <View style={{ height: 40, width: 40, backgroundColor: '#98FF98', borderRadius: 15, justifyContent: "center", alignItems: "center" ,left:80,top:-20}}>
            <View style={{ height: 25, width: 25, backgroundColor: '#36FCA9', borderRadius: 10, justifyContent: "center", alignItems: "center", transform: [{ rotate: '120deg' }] }}>
                <Foundation name="dollar" size={20} color={"#FFFFFF"} />
            </View>  
            </View>

          </View>

           <View style={{flexDirection:"row",bottom:60}}>
            <View style={{height:30,width:30,backgroundColor:"#6BFDC0",justifyContent:"center",alignItems:"center",borderRadius:10,}}>
                 <FontAwesome5 name="info" size={20} color={'#FFFFFF'}/>
            </View>

            <View style={{paddingHorizontal:10}}>
            <Text style={[GlobleStyle.CustomFontText,{fontSize:15,color:"black",textAlign:"left",}]}>Wallet money cannot be tranferred to your bank account </Text>
            </View>
           </View>
     </View>

     <View>
        <Text style={[GlobleStyle.CustomFont,{fontSize:22,color:"black",left:20}]}>Transactions</Text>
     </View>

    </View>
  );
}

export default VonzuuWallet;
