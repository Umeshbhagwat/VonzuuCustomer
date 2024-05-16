import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import Api from '../../services/Api';
import { hp, wp } from '../../utils/SizeResponcive';
import { TouchableOpacity } from 'react-native-gesture-handler';
import GlobleStyle from '../../utils/GlobleStyle';
import { RFPercentage } from 'react-native-responsive-fontsize';

const InternationalBrands = () => {
  const [offerData, setOfferData] = useState([]);

  useEffect(() => {
    getInternationalBrands();
  }, []);

  const getInternationalBrands = async () => {
    try {
      const endPoint = '/api/v1/Catalog/HomePage?StoreID=1046';
      const response = await Api.fetchEndpointData(endPoint);

      // Filter the data to only include items with sectionTitle "Special Offer"
      const getInternationalBrandsData = response.data.filter(item => item.sectionTitle === "International Brands");

      setOfferData(getInternationalBrandsData);
    } catch (error) {
      console.log('Error in getSpecialOffers:', error);
    }
  };

  return (
    <View>
      {offerData.map((data, index) => (
        <View key={index} style={styles.sectionContainer}>
          <Text style={[GlobleStyle.headerText]}>{data.sectionTitle}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{}}>
            {data.subList.map((item) => (
              // <View style={{backgroundColor:"black",width:"90%"}}>
              <TouchableOpacity key={item.id} style={styles.itemContainer}>

                <Image source={{ uri: item.imageUrl }} style={styles.specialOfferImage} />
               
              <Text style={GlobleStyle.NameOfRes}>{item.name}</Text>
               <Text style={GlobleStyle.Description}>{item.details}</Text>
              </TouchableOpacity>

            ))}
            </ScrollView>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  productsScrollView: {
    paddingVertical: 10,
  },
  sectionContainer: {
    marginHorizontal: 7,
    marginVertical: 5,
  },
  headingText: {
    fontSize: 20,
    color: 'black',
  },
  itemContainer: {
    // width:"100%",
    // marginRight:1,
    marginRight:20,
   
    
    
  },
  specialOfferImage: {
    height:hp(20),
    width:wp(80),
    // backgroundColor: '#C0F6E3',
    resizeMode:'cover',
    borderRadius:10
  },
  spacialOffersDetailstext: {
    fontSize: 15,
    color: '#4C6059',
  },
});

export default InternationalBrands;
