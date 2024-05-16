import React from 'react';
import { View, Text, StyleSheet,Image} from 'react-native';
import GlobleStyle from '../../utils/GlobleStyle'
const NoReviewsYet = () => {
  return (
    <View style={styles.mainContainer}>
       <View style={{}}>
           <Image source={require('../../assets/EmptyScreensImages/NoReviewsYet.png')} style={styles.images}/>
       </View>
       <View style={{justifyContent:"center",alignItems:"center",padding:60,}}>
         <Text style={[GlobleStyle.CustomFont, styles.headingText]}>No reviews yet</Text>
         <Text style={[GlobleStyle.CustomFontText, styles.contentText]}>You did'nt reviewed anyting yet.</Text>
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
  }
    
})

export default NoReviewsYet;
