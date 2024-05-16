import React from 'react';
import { View, Text, StyleSheet,Image,TouchableOpacity} from 'react-native';
import GlobleStyle from '../../utils/GlobleStyle'
import { responsiveHeight, responsiveWidth } from "react-native-responsive-dimensions";
const NoRidersAvaliable = () => {
  return (
    <View style={styles.mainContainer}>
       <View style={{}}>
           <Image source={require('../../assets/EmptyScreensImages/NoRidersAvailable.png')} style={styles.images}/>
       </View>
       <View style={{justifyContent:"center",alignItems:"center",padding:30,}}>
         <Text style={[GlobleStyle.CustomFont, styles.headingText]}>No riders available </Text>
         <Text style={[GlobleStyle.CustomFontText, styles.contentText]}>You've not ordered somthing yet.Once you order,it will appear here</Text>
       </View>

       <View style={styles.BtnMain}>
          <TouchableOpacity>
            <View style={[styles.BtnContainer, {backgroundColor:"#33FFC2"}]}>
              <Text style={[styles.BtnText, GlobleStyle.CustomHeadingColor, GlobleStyle.CustomFont]}>Add rider</Text>
            </View>
          </TouchableOpacity>
        </View>
    </View>
  );
}

const styles=StyleSheet.create({
mainContainer:{
    flex:1,
    backgroundColor:"#FFFFFF",
    justifyContent:"center",alignItems:"center"
},
images:{
    height:200,
    width:200
},
headingText: {
    fontSize: 22,
    color: "black",
    textAlign: 'center',
     // Center-align the heading text
  },
  contentText:{
    top:10,
    fontSize: 15,
    color: "#50616E",
    textAlign: 'center' 
  },
  BtnMain: {
       
    alignItems: "center",
  },
  BtnContainer: {
    height: responsiveHeight(7), width: responsiveWidth(70),
    alignItems: "center",
    justifyContent: "center", borderRadius: 10,
    top:20,
    marginVertical:10
  },
  BtnText: {
    fontSize: 20,
  },
    
})

export default NoRidersAvaliable;
