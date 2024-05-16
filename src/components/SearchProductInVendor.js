import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from "react-native-modal";
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import { RadioButton, Checkbox } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import GlobleStyle from '../utils/GlobleStyle';
import { responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import Api from '../services/Api';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { wp } from '../utils/SizeResponcive';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

// import { TextInput } from 'react-native-paper';
const SearchProductInVendor = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isCustomisableVisible, setCutomisableVisible] = useState(false);
  const [customisAttibuteData, setCustomisAttibuteData] = useState([]);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('');
  const [selectedVegies, setselectedVegies] = useState([]);
  const [selectedBread, setSelectedBread] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);
  const [lineItem, setLineItem] = useState(null);
  const [isBottomModalVisible, setBottomIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);

  const navigation = useNavigation();
  const route = useRoute();
  const { venderid } = route.params;
  const latitude = route.params.latitude;
  const longitude = route.params.longitude;

  const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);

  const [showMore, setShowMore] = useState({});
  // Now, you can use the venderid in your component

  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery]);


  const HorizontalLine = () => (
    <View style={styles.horizontalLine} />
  );

  const toggleBottomModal = (item) => {
    setBottomIsModalVisible(true);
    setSelectedItem([item]);
  };

  const toggleCustomisableModal = () => {
    console.log("This is an toggleCustom modal")
    setCutomisableVisible(true);
  }

  const handleRadioPress = (productAttributeMappingId, id) => {
    var key = `${productAttributeMappingId}-${id}`;
    setSelectedBread(key);
  };

  const handleCheckboxPress = (productAttributeMappingId, id) => {
    const newSelectedVegies = [...selectedVegies];
    var key = productAttributeMappingId + "-" + id;
    // Toggle the selection
    if (newSelectedVegies.includes(key)) {
      newSelectedVegies.splice(newSelectedVegies.indexOf(key), 1);
    } else {
      newSelectedVegies.push(key);
    }

    setselectedVegies(newSelectedVegies);
  };

  const isVegiesSelected = (id) => {
    return selectedVegies.includes(id);
  };

  const toggleShowMore = (itemId) => {
    setShowMore((prevShowMore) => ({
      ...prevShowMore,
      [itemId]: !prevShowMore[itemId],
    }));
  };

  const apiEndpoint = `api/v1/Catalog/SearchProduct?VendorIds=${venderid}&pageSize=10&pageIndex=1&Keywords=${searchQuery}&storeID=0&UserID=0`;

  const fetchSearchResults = async () => {
    try {
      console.log('This is a vendor in the gopal', venderid);

      // Make sure to use the correct API utility and handle response appropriately
      const response = await Api.fetchEndpointData(apiEndpoint);

      // Log the response data to the console
      console.log('This is the response data...', response.data);

      // Update state with the search results
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleAddCartData = async (item, isCustomizedItem) => {
    const productAttributes = [];

    if (item == null && isCustomizedItem) {
      item = lineItem;

      if (selectedBread) {
        var attributes = selectedBread.split('-');
        productAttributes.push({
          productAttributeMappingId: parseInt(attributes[0]),
          productAttributeValueId: parseInt(attributes[1])
        });
      }

      selectedVegies.map((subItem) => {
        if (subItem) {
          var attributes = subItem.split('-');
          productAttributes.push({
            productAttributeMappingId: parseInt(attributes[0]),
            productAttributeValueId: parseInt(attributes[1])
          });
        }
      });
    }

    try {

      const endpoint = 'api/v1/Catalog/AddToCart'

      const data =
      {
        "storeId": 1046,
        "apiKey": "BDD6B8BC-6C51-49C6-8E17-9E09B86E4DBB",
        "uniqueSeoCode": "1",
        "cartItemID": 0,
        "customerId": `${cutomerId}`,
        "productId": `${item.id}`,
        "quantity": 1,
        "productAttributes": productAttributes,
        "languageId": 0,
        "shoppingCartTypeId": 1,
        "customerEnteredPrice": 0,
        "productPrice": `${item.price}`,
        "attributesxml": "string",
        "searchedLatlong": `${longitude} ${latitude}`,
        "enteredDeliveryAddress": "pune"
      }

      console.log('TEST:::::', JSON.stringify(data));

      const response = await Api.postEndpointData(endpoint, data);

      setCartMessage(response.data);
      setCutomisableVisible(false)
      setBottomIsModalVisible(false); // Clear the message after hiding the modal
      fetchCartDataa()
      Toast.show({
        text1: "Item Added In cart",
        type: "success",

        visibilityTime: 2000

      })

      // Hide the modal after 3 seconds


    } catch (error) {
      setBottomIsModalVisible(false); // Clear the message after hiding the modal

      fetchCartDataa()
      setCutomisableVisible(false)
      console.error('Error fetching data:', error);
      Toast.show({
        text1: "Item Not Added In cart",
        type: "error",
        visibilityTime: 2000

      })
    }
  }


  const getProductsAttribute = async (id) => {
    console.log("This is an GetProductsAttribute function", id);
    try {
      const endpoint = `/api/v1/Catalog/GetProductsAttribute?ProductID=${id}`
      const response = await Api.fetchEndpointData(endpoint);
      console.log("This is an responce from getProductsAttribute data", response.data);
      setCustomisAttibuteData(response.data);
    } catch (error) {
      // dispatch(setError('Error fetching data. Please try again.'));
      console.error('Error fetching data:', error);
    }
  }


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {

      fetchCartDataa()
    });
    return unsubscribe
  }, [])
  const [cartItem, setcartitem] = useState(0)
  // console.log(typeof(cartItem),"cartdataaaa")
  const fetchCartDataa = async () => {
    try {
      const endpoint = `api/v1/Catalog/GetFullCart?CustomerID=${cutomerId}`;
      const response = await Api.fetchEndpointData(endpoint);
      const TotalQuantity = response.data.map((data) => {
        setcartitem(data.totalQuantity);
      }
      )
      dispatch(setCartData(response.data));
      dispatch(setCartError(null));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const renderItem = ({ item, index }) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 13, paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: "#F2F4F8" }}>
      <View style={{ alignContent: "center", width: "55%" }}>

        <Text style={[GlobleStyle.CustomFont, styles.headingText]}>{item.name}</Text>
        <Text style={{ color: "black", fontSize: RFPercentage(2.4), fontFamily: "Poppins-Bold" }}>${item.price}</Text>


        <Text style={[GlobleStyle.CustomFontText, { color: "black", color: "#6D7E8B", fontSize: RFPercentage(1.6) }]}>
          {/* Adjust the property name based on your data structure */}
          {item.shortDescription}
        </Text>

      </View>

      <View style={{ alignItems: 'center' }}>
        <Image source={{ uri: item.mediaUrl }} resizeMode='contain' style={styles.productImage} />

        <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 2, borderRadius: 5, backgroundColor: "white", alignItems: "center", justifyContent: "center", elevation: 10, bottom: 15 }} onPress={() => {
          // Check the value of item.is_ProductAttribute
          if (item.is_ProductAttribute === 1) {
            toggleCustomisableModal();
            getProductsAttribute(item.id);
            setLineItem(item);
          } else {
            // setLineItem(null);
            toggleBottomModal(item);
          }
        }}>

          <Text style={[GlobleStyle.CustomFont, { color: '#9B56FF' }]}>ADD</Text>
        </TouchableOpacity>

        {item.is_ProductAttribute === 1 && (
          <Text style={[GlobleStyle.CustomFont, { color: '#6D7E8B', fontSize: RFPercentage(1.4), }]}>Customisable</Text>
        )}

      </View>

    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: "white", flex: 1, height: "100%" }}>
      <KeyboardAwareScrollView>

        <View style={{ marginTop: 20 }}>

          <View style={{ flexDirection: 'row', width: "100%", marginTop: 10, paddingHorizontal: 12, justifyContent: 'space-between', alignItems: 'center' }}>
            <TouchableOpacity style={{
              padding: 12,
              backgroundColor: '#F2F5F8',

              borderRadius: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }} onPress={() => navigation.goBack()}>

              <MaterialIcons name="arrow-back" size={20} color="black" />

            </TouchableOpacity>

            <TextInput
              placeholder="Search Anything"
              placeholderTextColor="#C0C0C0"

              style={{
                fontSize: RFPercentage(1.6),
                paddingHorizontal: 20,
                backgroundColor: '#F2F5F8',
                borderRadius: 15,
                fontFamily: 'Poppins-Regular',
                width: "40%",
                height: 50,
              }}
              onChangeText={(text) => {
                setSearchQuery(text);
                // Call fetchSearchResults here if you want to trigger the search while typing
                fetchSearchResults();
              }}
            />

            <TouchableOpacity style={{
              padding: 12,
              backgroundColor: '#F2F5F8',
              // width: 50,
              borderRadius: 15,

              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <MaterialIcons name="search" size={20} color="black" />

            </TouchableOpacity>

          </View>


          <View style={{ paddingHorizontal: 12, marginTop: 13 }}>

            <Text style={[GlobleStyle.CustomFont, { fontSize: RFPercentage(2.7), color: "black", fontFamily: "Poppins-SemiBold" }]}>Picked For You </Text>
          </View>
        </View>


        {
          <Modal
            isVisible={isBottomModalVisible}
            style={{ margin: 0 }}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => setBottomIsModalVisible(false)}
            onSwipeComplete={() => setBottomIsModalVisible(false)}
            swipeDirection={['down']}
          >
            {/* <View style={styles.modalContent}> */}
            {
              selectedItem.map((item) => (

                <View key={item.id} style={{ backgroundColor: "white", alignItems: 'center', position: 'absolute', bottom: 0, width: "100%", paddingHorizontal: 15, paddingVertical: 10, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}>


                  <Image source={{ uri: item.mediaUrl }} resizeMode='cover' style={{ width: "100%", height: 150, borderRadius: 10, }} />


                  <Text style={[GlobleStyle.CustomFont, { fontSize: RFPercentage(2.3), alignSelf: 'flex-start', color: 'black', fontFamily: "Poppins-SemiBold", marginTop: 10 }]}>{item.name}</Text>
                  <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "black", alignSelf: "flex-start" }]}>$ {item.price}</Text>
                  <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, alignSelf: "flex-start" }]}>{item.shortDescription}</Text>


                  {/* <View style={{ top: 10 }}>
                      <Text style={[GlobleStyle.CustomFont, { color: "red", fontSize: 17 },]}> {cartMessage}</Text>
                    </View> */}


                  <TouchableOpacity style={{
                    backgroundColor: "#33FFC2",
                    alignItems: "center",
                    justifyContent: "center", borderRadius: 10, marginTop: 10, paddingVertical: 7, width: "100%"
                  }} onPress={() => handleAddCartData(item)}>

                    <Text style={[styles.BtnText, GlobleStyle.CustomHeadingColor, GlobleStyle.CustomFont]}>Add To Cart</Text>


                  </TouchableOpacity>



                </View>

              ))
            }
            {/* </View> */}
          </Modal>
        }
        {
          <Modal
            isVisible={isCustomisableVisible}
            style={{ margin: 0 }}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => setCutomisableVisible(false)}
            onSwipeComplete={() => setCutomisableVisible(false)}
            swipeDirection={['down']}
          >
            <View style={styles.customisableModalContainer}>
              <Text style={[GlobleStyle.CustomFont, { fontSize: 20, color: "black" }]}>Customize your order</Text>


              {customisAttibuteData.map((attributeMapping) => {
                const { productAttributeMappingId, attributeValueTypeId, productsAttribute } = attributeMapping;

                return (
                  <View key={productAttributeMappingId}>

                    <Text style={[GlobleStyle.CustomFont, { fontSize: 15, color: "#5F6E7A" }]}> {attributeMapping.groupName}</Text>
 

                    {attributeValueTypeId === 1 && (
                      <Picker
                        style={{ color: "black" }}
                        selectedValue={selectedDropdownValue}
                        onValueChange={(itemValue) => setSelectedDropdownValue(itemValue)}
                      >
                        <Picker.Item label="Select an option" value={null} style={{ color: "black" }} />
                        {productsAttribute.map((attribute) => (
                          <Picker.Item
                            style={{ color: "black" }}
                            key={attribute.attributeValueId}
                            label={`${attribute.name} - $ ${attribute.priceAdjustment}`}
                            value={attribute.attributeValueId}
                          />
                        ))}
                      </Picker>

                    )}

                    {attributeValueTypeId === 2 && (
                      <View>
                        {productsAttribute.map((attribute) => (
                          <TouchableOpacity
                            key={attribute.attributeValueId}
                            onPress={() => handleRadioPress(productAttributeMappingId, attribute.attributeValueId)}
                          >
                            <View style={{ flexDirection: 'row' }}>
                              <RadioButton
                                value={attribute.attributeValueId}
                                status={
                                  selectedBread === `${productAttributeMappingId}-${attribute.attributeValueId}` ? 'checked' : 'unchecked'
                                }
                                onPress={() => handleRadioPress(productAttributeMappingId, attribute.attributeValueId)}
                                color={'#1DC291'}
                              />
                              <View style={styles.detailsContainer}>
                                <Text style={[GlobleStyle.CustomFontText, { color: "#1C2A38", fontSize: 15, alignItems: "flex-start" }]}>{attribute.name}</Text>
                              </View>

                              <View style={styles.priceContainer}>
                                <Text style={[GlobleStyle.CustomFontText, { color: "#50616E", fontSize: 15 }]}> ${attribute.priceAdjustment}</Text>
                              </View>

                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {attributeValueTypeId === 3 && (
                      <View>
                        {productsAttribute.map((attribute) => (
                          <TouchableOpacity
                            key={attribute.attributeValueId}
                            onPress={() => handleCheckboxPress(productAttributeMappingId, attribute.attributeValueId)}
                          >
                            <View style={{ flexDirection: 'row' }}>

                              <Checkbox
                                status={
                                  isVegiesSelected(`${productAttributeMappingId}-${attribute.attributeValueId}`) ? 'checked' : 'unchecked'
                                }
                                onPress={() => handleCheckboxPress(productAttributeMappingId, attribute.attributeValueId)}
                                color={'#1DC291'}
                              />

                              <View style={styles.detailsContainer}>
                                <Text style={[GlobleStyle.CustomFontText, { color: "#1C2A38", fontSize: 15, alignItems: "flex-start" }]}>{attribute.name}</Text>
                              </View>

                              <View style={styles.priceContainer}>
                                <Text style={[GlobleStyle.CustomFont, { marginLeft: 5 }]}>$ {attribute.priceAdjustment}</Text>
                              </View>

                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}

              <TouchableOpacity style={{ backgroundColor: "#33FFC2", paddingVertical: 7, borderRadius: 10, marginTop: 8, alignItems: 'center' }} onPress={() => handleAddCartData(null, true)}>

                <Text style={[GlobleStyle.CustomFont, { fontSize: RFPercentage(2.5), color: "black" }]}>Add</Text>

              </TouchableOpacity>

            </View>

          </Modal>
        }


        {searchResults.length > 0 ? (
          <FlatList
            data={searchResults[0].catlogsItems} // Adjust this based on the actual structure of your data
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        ) : (
          <Text>No results found.</Text>
        )}



</KeyboardAwareScrollView>

      <TouchableOpacity
        onPress={() => navigation.navigate('MyCart')}
        style={styles.cartMainContainer}
      >
        <AntDesign name='shoppingcart' size={25} color={'white'} />


        <View style={{ position: 'absolute', right: -8, top: -6, backgroundColor: "#33FFC2", height: 20, width: 20, borderRadius: 15, justifyContent: 'center', alignItems: 'center', }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", textAlign: "center" }}>{cartItem}</Text>
        </View>
      </TouchableOpacity>
  
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  cartMainContainer: {
    height: 40,
    width: 40,
    justifyContent: "center",
    borderRadius: 25,
    right: 20, bottom: 50,
    position: "absolute",
    backgroundColor: "#091223",
    flexDirection: "row",
    alignItems: "center",
  },
  menuMainContainer: {
    height: responsiveHeight(10),
    width: responsiveWidth(90),
    justifyContent: 'center',
    borderRadius: 10,
    bottom: 100,
    left: 20,
    position: 'absolute',
    backgroundColor: '#33FFC2',
    flexDirection: 'row',
    elevation: 8
  },
  menubtnConatiner: {
    justifyContent: 'center',
    alignItems: 'center',

  },
  menuImage: {
    height: 25,
    width: 25,
    tintColor: 'white',
  },
  menuTextConatiner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBtnText: {
    color: '#1C2A38',
  },
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
    fontSize: RFPercentage(2.3),
    color: 'black',
    fontFamily: "Poppins-SemiBold",


  },
  porductImage: {
    height: 140,
    width: 130,
    borderRadius: 10
  },

  BtnMain: {

    alignItems: "center",
  },
  itemContainer: {


    // paddingBottom:30,
    // padding: 30,

    borderRadius: 5,
    flexDirection: "row",
    // justifyContent: "space-evenly",
    alignItems: "center",
    justifyContent: 'space-around'
  },
  horizontalLine: {
    height: 2,
    backgroundColor: '#F2F4F8',
    marginHorizontal: 10,
    paddingVertical: 1, bottom: 10
  },
  productImage: {
    height: 110,
    width: 110,
    borderRadius: 10
  },

  menuMainContainer: {
    height: 40, width: 100, justifyContent: "center",
    borderRadius: 20,
    bottom: 45,
    left: 20, position: 'absolute',
    backgroundColor: '#091223', flexDirection: "row"

  },
  menubtnConatiner: {
    justifyContent: "center", alignItems: "center",
  },
  menuImage: {
    height: 25, width: 25, tintColor: "white"
  },
  menuTextConatiner: {
    justifyContent: "center", alignItems: "center",
  },
  menuBtnText: {
    color: "black", color: "white"
  },
  bottomSheet: {
    backgroundColor: 'white',
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  customisableModalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    width: "100%",
    bottom: 0
    // height:responsiveHeight(90),
    // width:responsiveWidth(100),
    // top:50
  },

  BtnContainer: {
    height: responsiveHeight(7), width: responsiveWidth(90),
    alignItems: "center",
    justifyContent: "center", borderRadius: 10,
    top: 10,
    marginVertical: 10
  },
  BtnText: {
    fontSize: 18,
  },
  modalContent: {
    position: 'absolute',
    backgroundColor: '#f5f5f5',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // height: 520,  // Adjust the height as needed
  },
  radioBtnConatiner: {
    flex: 1, // Adjust flex property based on your layout requirements
    // Additional styling properties for the name container
  },
  detailsContainer: {
    flex: 6,
    alignContent: "center", justifyContent: "center" // Adjust flex property based on your layout requirements
    // Additional styling properties for the details container
  },
  priceContainer: {
    flex: 1, // Adjust flex property based on your layout requirements
    // Additional styling properties for the price container
  },
});

export default SearchProductInVendor;
