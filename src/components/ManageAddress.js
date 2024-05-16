import React from 'react';
import { View, Text,TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import GlobleStyle from '../utils/GlobleStyle';
import { useNavigation } from '@react-navigation/native';

const ManageAddress = () => {
    const navigation = useNavigation();
  return (
    <View style={{flex:1,backgroundColor:"#FFFFFF",}}>
         <View style={{flexDirection:"row",alignItems:"center",left:10,top:10}}>
        <TouchableOpacity onPress={() => navigation.navigate('MyCart')}>
        <View style={{ padding: 10, backgroundColor: '#F2F5F8', width: 50, borderRadius: 15, left: 5 }}>
            <MaterialIcons name="arrow-back" size={30} color={"black"} />
          </View>
        </TouchableOpacity>
         <Text style={[GlobleStyle.CustomFont, { fontSize: 20, color: 'black',left:20,}]}>Manage Address</Text>
       </View>

    <TouchableOpacity onPress={()=>navigation.navigate('AddNewAdress')}>
      <View style={{alignItems:"center",top:20,}}>
       <View style={{height:50,width:350,borderWidth:1,borderColor:"black",borderRadius:10,justifyContent:"center",alignItems:"center",flexDirection:"row"}}>
         <View>
             <MaterialCommunityIcons name="map-marker-plus-outline" size={30} color={"#9B56FF"} />
         </View> 

         <View>
            <Text style={[GlobleStyle.CustomFont,{fontSize:17,left:10,color:"black"}]}>Add new address </Text>
         </View>
       </View>
     </View> 
   </TouchableOpacity>   
    </View>
  );
}

export default ManageAddress;
