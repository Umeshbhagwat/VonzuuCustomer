import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setData, setError } from '../reduxtoolkit/SearchDishesRestaSlice';
import GlobleStyle from '../utils/GlobleStyle';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { responsiveWidth,responsiveHeight } from 'react-native-responsive-dimensions';
import Api from '../services/Api';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Toast from 'react-native-toast-message';
import Modal from "react-native-modal";
 
import { Picker } from '@react-native-picker/picker';
import { RadioButton, Checkbox } from 'react-native-paper';
 
const SearchDishesRestaurant = ({ route }) => {
  const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);
  const { latitude, longitude } = route.params;
  const [searchText, setSearchText] = useState('');
  const [currentCategory, setCurrentCategory] = useState('Dishes'); // Default category
  const [selectedRestaurant, setSelectedRestaurant] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
 
  const fetchDishesApiData = async (endpoint) => {
    try {
   
      const response = await Api.fetchEndpointData(endpoint);
      dispatch(setData([]));
      dispatch(setData(response.data));
      console.log("Aditya Dishes",response.data)
    } catch (error) {
      dispatch(
        setError('Error fetching Dishes data. Please try again.')
      );
      console.error('Error fetching Dishes data:', error);
    }
  };
 
  const fetchRestaurantsApiData = async (endpoint) => {
    try {
    
      const response = await Api.fetchEndpointData(endpoint);
      dispatch(setData([]));
      dispatch(setData(response.data));
      console.log("Aditya resturant",response.data)
    } catch (error) {
      dispatch(
        setError('Error fetching Restaurants data. Please try again.')
      );
      console.error('Error fetching Restaurants data:', error);
    }
  };
 
  const handleSearch = useCallback(async () => {
    if (searchText.trim() === '') {
      // Clear the search data if searchText is empty
      dispatch(setData([]));
    } else {
      let endpoint;
      if (currentCategory === 'Dishes') {
        endpoint = `/api/v1/Catalog/SearchProduct?pageSize=10&pageIndex=1&Keywords=${searchText}&LatLong=${latitude} ${longitude}&storeID=1046&UserID=0`;
       // endpoint=`/api/v1/Catalog/SearchProduct?pageSize=10&pageIndex=1&Keywords=chi&LatLong=18.516726%2073.856255&storeID=0&UserID=0`
        fetchDishesApiData(endpoint);
      } else {
        endpoint = `/api/v1/Catalog/GetVendorByLatLog?latlong=${latitude} ${longitude}&pageSize=10&pageIndex=1&Keywords=${searchText}&storeID=1046&UserID=0`;
        fetchRestaurantsApiData(endpoint);
      }
    }
  }, [latitude, longitude, searchText, currentCategory]);
 
  useEffect(() => {
    handleSearch();
  }, [handleSearch]);
  
  const handleSerchDish=(item)=>{
    //  console.log("$$$$$$$$",data.vendorId);
     navigation.navigate('ProductDetail', {
      productId: item.vendorId, latitude: latitude, longitude: longitude, productName: item.name,
      openTime: item.opentime, ratingAvg: item.ratingAvg,perticularProductId:item.id
 
    })
   
  }
 
  const productData = useSelector(
    (state) => state.SerchDishesRestaurants.products
  );
  console.log('This is searching data', productData);
  
  const handleRestaurantOrder=(item)=>{
    
    navigation.navigate('ProductDetail', {
      productId: item.id, latitude: latitude, longitude: longitude, productName: item.name,
      openTime: item.opentime, ratingAvg: item.ratingAvg,
    })
  }
 
  // <TouchableOpacity onPress={() => {
  //   navigation.navigate('ProductDetail', {
  //     productId: data.id, latitude: latitude, longitude: longitude, productName: data.name,
  //     openTime: data.opentime, ratingAvg: data.ratingAvg,
  //   })
  // }}>
  const toggleCustomisableModal = () => {
    console.log("This is an toggleCustom modal")
    setCutomisableVisible(true);
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
 
 
  const [isCustomisableVisible, setCutomisableVisible] = useState(false);
  const [customisAttibuteData, setCustomisAttibuteData] = useState([]);
  const [selectedDropdownValue, setSelectedDropdownValue] = useState('');
  const [selectedVegies, setselectedVegies] = useState([]);
  const [selectedBread, setSelectedBread] = useState(null);
  const [cartMessage, setCartMessage] = useState(null);
  const [lineItem, setLineItem] = useState(null);
  const [isBottomModalVisible, setBottomIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState([]);
 
 
 
  const toggleBottomModal = (item) => {
    setBottomIsModalVisible(true);
    setSelectedItem([item]);
  };
 
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
 
 
 
  
  const handleAddCartData = async (item, isCustomizedItem) => {
 
 
    console.log(latitude,"213452134521345321---------------------------------------")
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
console.log(longitude,"llllllllllllllllllllllllll")
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
      fetchCartDataa()
      setCartMessage(response.data);
      setBottomIsModalVisible(false); // Clear the message after hiding the modal
      setCutomisableVisible(false);
 
      Toast.show({
        text1:"Item Added In cart",
        type:"success",
 
        visibilityTime:2000
 
      })
 
      // Hide the modal after 3 seconds
     
 
    } catch (error) {
      setBottomIsModalVisible(false); // Clear the message after hiding the modal
      setCutomisableVisible(false);
      console.error('Error fetching data:', error);
      Toast.show({
        text1:"Item Not Added In cart",
        type:"error",
        visibilityTime:2000
 
      })
    }
  }
  
  useFocusEffect(
    React.useCallback(() => {
      setcartitem(0)
      fetchCartDataa()
    }, []))
 
  const [cartItem, setcartitem] = useState(0)
  // console.log(typeof(cartItem),"cartdataaaa")
    const fetchCartDataa = async () => {
      try {
        const endpoint = `api/v1/Catalog/GetFullCart?CustomerID=${cutomerId}`;
        const response = await Api.fetchEndpointData(endpoint);
        const TotalQuantity=response.data.map((data)=>
        {
         setcartitem(data.totalQuantity);
        }
        )
        dispatch(setCartData(response.data));
        dispatch(setCartError(null));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
 
 
  return (

    <SafeAreaView style={{flex:1,backgroundColor:"FFFFFF"}}>
    <View style={styles.container}>
      <View>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('TabStackNavigator')}
          >
            <View
              style={{
                backgroundColor: '#F2F5F8',
                width: 50,
                padding:10,
                borderRadius: 15,
              }}
            >
              <MaterialIcons
                name="arrow-back"
                size={30}
                color={'black'}
              />
            </View>
          </TouchableOpacity>
 
          <View style={{ justifyContent: 'center' }}>
            <Text
              style={[
                GlobleStyle.CustomFontText,
                {color: 'black' },
              ]}
            >
              {' '}
              Search for Dishes, restaurants
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.inputContainer}>
        <AntDesign
          name="search1"
          size={20}
          color="gray"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search for a Dishes, restaurants"
          placeholderTextColor={GlobleStyle.PrimaryColor}
          value={searchText}
          onChangeText={setSearchText}
          onEndEditing={handleSearch}
        />
      </View>
 
      <View style={{ flexDirection: 'row',marginVertical:10,marginHorizontal:5,justifyContent:'space-around' }}>
        <TouchableOpacity
        style={{backgroundColor:"white",alignItems:'center',justifyContent:'center',paddingHorizontal:30,paddingVertical:4,borderRadius:12,borderWidth:currentCategory === "Restaurants" ? 1:null,borderColor:currentCategory === 'Restaurants' ? "grey":null,shadowColor:"black",elevation:10}}
          onPress={() => {
            setCurrentCategory('Restaurants');
            setSelectedRestaurant(true);
          }}
        >
         <Text style={{ fontFamily: currentCategory === 'Restaurants' ? 'Poppins-SemiBold' : 'Poppins-Regular', color:"#00DB99",fontSize:RFPercentage(2)}}>
            Restaurants
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{backgroundColor:"white",alignItems:'center',justifyContent:'center',paddingHorizontal:30,paddingVertical:4,borderRadius:12,borderWidth:currentCategory === 'Dishes' ?1:null,borderColor:currentCategory === 'Dishes' ? "grey":null,shadowColor:"black",elevation:10}}
          onPress={() => {
            setCurrentCategory('Dishes');
            setSelectedRestaurant(false);
          }}
        >
          <Text style={{ fontWeight: currentCategory === 'Dishes' ? 'bold' : 'normal',color:"#00DB99",fontSize:RFPercentage(2)}}>
            Dishes
          </Text>
        </TouchableOpacity>
      </View>
 
      <ScrollView style={styles.locationList}>
        {selectedRestaurant ? (
          Array.isArray(productData) && productData.length > 0 ? (
            productData.map((item) => (
              // <ScrollView horizontal>
              <View>
              <View key={item.id} style={{flexDirection:'row',elevation:4,width:responsiveWidth(90),}}>
            
                    <View style={styles.itemContainerRestorant}>
                    <View style={{ }}>
                      <View style={{ }}>
                      <Text style={[GlobleStyle.CustomFont,{fontSize:19,color:"black"}]}> {item.name}</Text>
                        <Text style={[GlobleStyle.CustomFont,styles.headingText]}>Rating: {item.ratingAvg}</Text>
                        <Text style={[GlobleStyle.CustomFont, styles.headingText]}>Delivery Charge: ${item.deliveryCharge}</Text>
                        <Text style={[GlobleStyle.CustomFont, styles.headingText]}>Minimum Order Value: ${item.minimumOrderValue}</Text>
                      </View>
                    </View>
                    <View style={{ }}>
                      <Image source={{ uri: item.pictureUrl }} style={styles.productImage} />
                     
                      <TouchableOpacity style={{height: 40, width: 80, backgroundColor: "white", alignItems: "center", justifyContent: "center", bottom: 20, left: 10, borderRadius: 10, elevation: 10 }} onPress={()=>handleRestaurantOrder(item)}>
                          <Text style={[GlobleStyle.CustomFont, { color: '#9B56FF' }]}>Order</Text>
                        </TouchableOpacity>
           
                    </View>
 
                  </View>
                   
              </View>
            
          </View>  
            ))
          ) : (
            <Text style={GlobleStyle.defaultTextColor}>{productData ? 'No Restaurants available' : 'Loading...'}</Text>
          )
        ) : (
          productData && productData.data && productData.data.length > 0 ? (
            productData.data.map((category) => (
              <View key={category.categoryId} style={styles.locationItem}>
                <Text style={{ fontSize: 14, fontWeight: 'bold',color:"black"}}>
                  {/* {category.categoryName} */}
                </Text>
                {/* <ScrollView horizontal> */}
                  {category.catlogsItems.map((item) => (
                    <View style={styles.itemContainer}>
                    <View style={{ alignContent: "center",paddingHorizontal:10}}>
                      <View style={{ paddingHorizontal:5}}>
                      <Text style={{ fontSize:18, fontWeight: 'bold',color:"#9B56FF"}}>{item.vendorName}</Text>
                        <Text style={[GlobleStyle.CustomFont,{fontSize:14,color:"black"}]}>{item.name}</Text>
                        <Text style={[GlobleStyle.CustomFont, styles.headingText]}>$ {item.price}</Text>
                      </View>
                      <View style={{width:responsiveWidth(55),}}>
                        <Text style={[GlobleStyle.CustomFontText, { color: "black",fontSize:12,}]}>
                          {/* Adjust the property name based on your data structure */}
                          {item.shortDescription}
                        </Text>
                      </View>
                    </View>
                    <View style={{ paddingHorizontal:10}}>
                      <Image source={{ uri: item.mediaUrl }} style={styles.productImage} />
                      <View style={{ height: 40, width: 80, backgroundColor: "white", alignItems: "center", justifyContent: "center", bottom: 20, left: 10, borderRadius: 10, elevation: 10 }}>
                      <TouchableOpacity onPress={() => {
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
                          <Text style={[GlobleStyle.CustomFont, { color: '#9B56FF' }]}>order</Text>
                        </TouchableOpacity>
                        
                      </View>
                      {item.is_ProductAttribute === 1 && (
            <Text style={[GlobleStyle.CustomFont, { color: '#6D7E8B', fontSize: RFPercentage(1.4), }]}>Customisable</Text>
          )}
                    </View>
                   
 
 
                  </View>
                  
                  ))}
                  
                  <View style={{ borderBottomWidth: 2, borderBottomColor: '#E3E7EF',}}></View>
              </View>
              
            ))
          ) : (
            <Text style={GlobleStyle.defaultTextColor}>{productData ? 'No Dishes available' : 'Loading...'}</Text>
          )
        )}

{
          <Modal
            isVisible={isBottomModalVisible}
            style={{margin:0}}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => setBottomIsModalVisible(false)}
            onSwipeComplete={() => setBottomIsModalVisible(false)}
            swipeDirection={['down']}
          >
            {/* <View style={styles.modalContent}> */}
              {
                selectedItem.map((item) => (
 
                  <View key={item.id}  style={{backgroundColor:"white",alignItems:'center',position:'absolute',bottom:0,width:"100%",paddingHorizontal:15,paddingVertical:10,borderTopLeftRadius:12,borderTopRightRadius:12}}>
 
                    
                      <Image source={{ uri: item.mediaUrl }} resizeMode='cover' style={{ width:"100%" ,height:150, borderRadius: 10, }} />
                   
                   
                      <Text style={[GlobleStyle.CustomFont, {   fontSize: RFPercentage(2.3),alignSelf:'flex-start',color: 'black',fontFamily:"Poppins-SemiBold",marginTop:10}]}>{item.name}</Text>
                      <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "black" ,alignSelf:"flex-start"}]}>$ {item.price}</Text>
                      <Text style={[GlobleStyle.CustomFontText, { fontSize: 18 ,alignSelf:"flex-start"}]}>{item.shortDescription}</Text>
                 
 
                    {/* <View style={{ top: 10 }}>
                      <Text style={[GlobleStyle.CustomFont, { color: "red", fontSize: 17 },]}> {cartMessage}</Text>
                    </View> */}
 
                    
                      <TouchableOpacity style={{backgroundColor:"#33FFC2",  
    alignItems: "center",
    justifyContent: "center", borderRadius: 10,marginTop:10,paddingVertical:7,width:"100%"}} onPress={() => handleAddCartData(item)}>
       
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
            style={{margin:0}}
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
                          style={{color:"black"}}
                            selectedValue={selectedDropdownValue}
                            onValueChange={(itemValue) => setSelectedDropdownValue(itemValue)}
                          >
                            <Picker.Item label="Select an option" value={null}
                          style={{color:"black"}}
                            
                            />
                            {productsAttribute.map((attribute) => (
                              <Picker.Item
                          style={{color:"black"}}

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
              
              
 
              <TouchableOpacity style={{backgroundColor:"#33FFC2",paddingVertical:7,borderRadius:10,marginTop:8,alignItems:'center'}} onPress={() => handleAddCartData(null, true)}>
              
                    <Text style={[GlobleStyle.CustomFont, { fontSize: RFPercentage(2.5), color: "black" }]}>Add</Text>
               
                </TouchableOpacity>
       
            </View>
 
          </Modal>
        }
 

 
      </ScrollView>
      <TouchableOpacity
        onPress={() => navigation.navigate('MyCart')}
        style={styles.cartMainContainer}
      >
          <AntDesign name='shoppingcart' size={25} color={'white'} />
   
 
        <View style={{ position: 'absolute', right:-8,top:-6, backgroundColor: "#33FFC2", height: 20, width: 20, borderRadius: 15, justifyContent: 'center', alignItems: 'center', }}>
          <Text style={{ fontSize: 15, fontWeight: "bold", color: "black", textAlign: "center" }}>{cartItem}</Text>
        </View>
      </TouchableOpacity>
    </View>
    </SafeAreaView>
  );
};
 
const styles = StyleSheet.create({
  cartMainContainer: {
    height: 40,
    width: 40,
    justifyContent: "center",
    borderRadius: 25,
   right:20,bottom:50,
    position: "absolute",
    backgroundColor: "#091223",
    flexDirection: "row",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#FFFFFF', elevation: 7
  },
  searchIcon: {
    padding: 12,
  },
  input: {
    flex: 1,
    color: "black"
  },
  locationList: {
    // marginTop: 8,
    // padding: 10,
    paddingHorizontal:10
  },
  locationItem: {
    // width: "98%", marginVertical: 10,
    // backgroundColor: "#FFFFFF", borderRadius: 10, elevation: 5, padding: 10
  },
  itemContainer: {
    flex: 1,
    // margin: 10,
  //  padding:25,
    height:responsiveHeight(20),
    borderRadius: 5,
    flexDirection: "row",
    // justifyContent: "space-evenly",
    alignItems: "center",
    justifyContent: 'space-around'
  },
  productImage: {
    height: 100,
    width: 100,
    borderRadius: 10
  },
  itemContainerRestorant:{
    flex: 1,
    margin: 5,
    // padding:20,
    height:responsiveHeight(20),
    width:responsiveWidth(250),
    // borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    // justifyContent: 'space-around'
  },
  headingText: {
    fontSize: 15,
    color: '#737B89',
 
  },
  BtnText: {
    fontSize: 18,
  },
  customisableModalContainer: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position:'absolute',
    width:"100%",
    bottom:0
    // height:responsiveHeight(90),
    // width:responsiveWidth(100),
    // top:50
  },
  modalContent: {
    position:'absolute',
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
 
export default SearchDishesRestaurant;
 
 