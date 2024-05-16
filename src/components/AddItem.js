import React, { useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import GlobleStyle from '../utils/GlobleStyle';
import { productDetailPosterImages, pickedForYou } from './products';

const AddItem = () => {
  const [showMore, setShowMore] = useState({});

  const HorizontalLine = () => (
    <View style={styles.horizontalLine} />
  );

  const toggleShowMore = (itemId) => {
    setShowMore((prevShowMore) => ({
      ...prevShowMore,
      [itemId]: !prevShowMore[itemId],
    }));
  };

  const renderItem = ({ item, index }) => (
    <ScrollView key={item.id}>
      <View style={styles.itemContainer}>
        <View style={{ alignContent: "center" }}>
          <View style={{ paddingHorizontal: 70 }}>
            <Text style={[GlobleStyle.CustomFont, styles.headingText]}>{item.dishName}</Text>
            <Text style={[GlobleStyle.CustomFont, styles.headingText]}>{item.price}</Text>
          </View>
          <View style={{ paddingHorizontal: 70 }}>
            <Text style={[GlobleStyle.CustomFontText, { color: "black" }]}>
              {item.infoWords && item.infoWords.length > 5
                ? (showMore[item.id] ? item.info : item.infoWords.slice(0, 5).join(' '))
                : item.info}
            </Text>
            {item.infoWords && item.infoWords.length > 5 && (
              <TouchableOpacity onPress={() => toggleShowMore(item.id)}>
                <Text style={[GlobleStyle.CustomFont, { color: "black", fontSize: 17 }]}>{showMore[item.id] ? 'Less' : 'More'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={{ paddingHorizontal: 60 }}>
          <Image source={{ uri: item.productImage }} style={styles.productImage} />
          <View style={{ height: 40, width: 80, backgroundColor: "white", alignItems: "center", justifyContent: "center", bottom: 20, left: 30, borderRadius: 10, elevation: 10 }}>
            <TouchableOpacity>
              <Text style={[GlobleStyle.CustomFont, { color: '#9B56FF' }]}>ADD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <ScrollView style={{marginBottom:150}}>
    <View>
      <View style={{ margin: 10 }}>
        <Text style={[GlobleStyle.CustomFont, styles.headingText]}>Picked For You </Text>
      </View>

      <View>
        <FlatList
          data={pickedForYou}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
       
    </View>
   </ScrollView> 
  );
};


const styles = StyleSheet.create({
    imageContainer: {
      position: 'relative',
    },
    scrollViewContent: {
      flexDirection: 'row', // Horizontal scrolling
    },
    image: {
      height: 400,
      width: 400, // Assuming each image has a width of 400 (adjust as needed)
    },
    imageInfoContainer: {
      position: 'absolute',
      bottom: 10,
      right: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderRadius: 5,
      paddingHorizontal: 5,
    },
    imageInfoText: {
      color: 'white',
    },
    dotsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      position: 'absolute',
      bottom: 10,
      left: 0,
      right: 0,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 4,
    },
    dotActive: {
      backgroundColor: 'white',
    },
    dotInactive: {
      backgroundColor: 'gray',
    },
    searchIconContainer: {
      position: 'absolute',
      top: 10,
      right: 10,
      // alignContent:"flex-start",justifyContent:"flex-start",
      elevation: 7,
    },
    searchIcon: {
      width: 90,
      height: 90,
    },
    headingText: {
      fontSize: 20,
      color: 'black'
    },
    porductImage: {
      height: 140,
      width: 130,
      borderRadius: 10
    },
    itemContainer: {
      flex:1,
      margin: 10,
      // paddingBottom:30,
      // padding: 30,
      
      borderRadius: 5,
      flexDirection: "row",
      // justifyContent: "space-evenly",
      alignItems:"center",
      justifyContent:'space-around'
    },
    horizontalLine: {
      height: 2,
      backgroundColor: '#F2F4F8',
      marginHorizontal: 10,
      paddingVertical:1,bottom:10
    },
    productImage: {
        height: 140,
        width: 130,
        borderRadius: 10
      },
     
      menuMainContainer: {
        height:40,width:100,justifyContent:"center",
        borderRadius:20,
        bottom: 45,
        left: 20,position:'absolute',
        backgroundColor: '#091223',flexDirection:"row"
       
      },
      menubtnConatiner:{
        justifyContent:"center",alignItems:"center",
      },
     menuImage:{
      height:25,width:25,tintColor:"white"
     },
      menuTextConatiner:{
        justifyContent:"center",alignItems:"center",
      },
      menuBtnText:{
        color:"black",color:"white"
      }  
    
  });
  

export default AddItem;
