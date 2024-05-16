import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, FlatList } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Api from '../../services/Api';
import { hp, wp } from '../../utils/SizeResponcive';
import { TouchableOpacity } from 'react-native-gesture-handler';
import GlobleStyle from '../../utils/GlobleStyle';

const SpecialOffers = ({main}) => {
  // console.log(main,"special offer data")
  // const [offerData, setOfferData] = useState([]);

  // useEffect(() => {
  //   getSpecialOffers();
  // }, []);

  // const getSpecialOffers = async () => {
  //   try {
  //     const endPoint = '/api/v1/Catalog/HomePage?StoreID=1046';
  //     const response = await Api.fetchEndpointData(endPoint);

  //     // Filter the data to only include items with sectionTitle "Special Offer"
  //     const specialOfferData = response.data.filter(item => item.sectionTitle === "Special Offer");

  //     setOfferData(specialOfferData);
  //   } catch (error) {
  //     console.log('Error in getSpecialOffers:', error);
  //   }
  // };

  return (
    <View>
 
        {/* // <View key={index} style={styles.sectionContainer}> */}
         
            {/* {.map((item) => (
              console.log(item,"listing")
            //   <View>
            //   <TouchableOpacity key={item.id} style={styles.itemContainer}>

            //     <Image source={{ uri: item.imageUrl }} style={styles.specialOfferImage} />
               
            //   </TouchableOpacity>
            //   <Text style={[GlobleStyle.Description,{marginLeft:7}]}>{item.details}</Text>
            //  </View> 
            ))} */}
            <FlatList
            horizontal={true}
            data={main}
            showsHorizontalScrollIndicator={false}
            renderItem={({item,index})=>{
              // console.log(item,"=============>")
              return(
                <View>
                   <TouchableOpacity key={item.id} style={styles.itemContainer}>
    
                   <Image source={{ uri: item.imageUrl }} style={styles.specialOfferImage} />
                   
                  </TouchableOpacity>
                   <Text style={[GlobleStyle.Description,{marginLeft:7}]}>{item.details}</Text>
                  </View> 
              )
            }}
            />
            
           
        </View>
      
    // </View>
  );
};

const styles = StyleSheet.create({
  productsScrollView: {
    paddingVertical: 10,
  },
  sectionContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  headingText: {
    fontSize: 20,
    color: 'black',
  },
  itemContainer: {
    marginRight: 20,
    marginTop:10
  },
  specialOfferImage: {
    height:hp(20),
    width:wp(80),
    // backgroundColor: '#C0F6E3',
    resizeMode:'contain'
  },
  spacialOffersDetailstext: {
    fontSize: 15,
    color: '#4C6059',
  },
});

export default SpecialOffers;
