import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
  ActivityIndicator,

} from "react-native";
import {
  productDetailPosterImages,
  pickedForYou,
  breads,
  vegies,
} from "./products";
import {
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from "@react-navigation/native";
import GlobleStyle from "../utils/GlobleStyle";
import Modal from "react-native-modal";
import { RadioButton, Checkbox } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import {
  responsiveHeight,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { useRoute } from "@react-navigation/native";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { setData, setError } from "../reduxtoolkit/ProductDetailsSlice";
import { setCartData, setCartError } from "../reduxtoolkit/CartSlice";
import {
  setVenderSliderError,
  setVenderSliderData,
} from "../reduxtoolkit/VendorSliderSlice";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import Api from "../services/Api";
import Toast from "react-native-toast-message";
import { RFPercentage } from "react-native-responsive-fontsize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { wp } from "../utils/SizeResponcive";

const ProductDetail = () => {
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [showMore, setShowMore] = useState({});
  const [isBottomModalVisible, setBottomIsModalVisible] = useState(false);
  const [isMenuModalVisible, setMenuModalVisible] = useState(false);
  const [isCustomisableVisible, setCutomisableVisible] = useState(false);
  const [selectedBread, setSelectedBread] = useState(null);
  const [selectedVegies, setselectedVegies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [categoryInfo, setCategoryInfo] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [customisAttibuteData, setCustomisAttibuteData] = useState([]);
  const [productAttributes, setProductAttributes] = useState([]);
  const [selectedItemDropdown, setSelectedItemDropdown] = "";
  const [selectedDropdownValue, setSelectedDropdownValue] = useState("");
  const [cartMessage, setCartMessage] = useState(null);
  const [cartBtnText, SetCartBtnText] = useState("");
  const [ItemCount, setItemCount] = useState(null);
  const [lineItem, setLineItem] = useState(null);
// console.log(cartBtnText,";----------------------------->>>>>>>")
  const prevProductIdRef = useRef(productId);
  const dispatch = useDispatch();
  const productData = useSelector((state) => state.prductDetails.products);
  const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);
  const latlong = useSelector((state) => state.LatlongSlices.userLatLong);
  const sliderDetails = useSelector((state) => state.vendorSlider.products);
  const route = useRoute();
  const productId = route.params ? route.params.productId : null;
  const latitude = route.params.latitude;
  const longitude = route.params.longitude;
  const productName = route.params.productName;
  const openTime = route.params.openTime;
  const ratingAvg = route.params.ratingAvg;
  const perticularProductId = route.params.perticularProductId;
  const vendorTypeID = route.params.vendorTypeID;
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const totalImages = sliderDetails.length;
  const logic = route.params.logic;

  // const cartData = useSelector((state) => state.CartData.products);
  // const numberOfItemsInCart = cartData.reduce((total, order) => total + order.totalQuantity, 0);

  const numberOfItemsInCart = useSelector(
    (state) =>
      state.CartData.products && state.CartData.products.length > 0
        ? state.CartData.products[0].totalQuantity
        : 0,
    shallowEqual
  );
  // setItemCount(numberOfItemsInCart)
  // console.log("Total products available in the Cart:", numberOfItemsInCart);

  console.log("perticularProductId??????????+++++", perticularProductId);

  // console.log("perticularProductId??????????+++++", perticularProductId);
// 
  useEffect(() => {
    // dispatch(getLocalBrandData());

    const endpoint = `/api/v1/Catalog/GetFullCart?CustomerID=${cutomerId}`; // Replace with your actual API endpoint
    fetchCartData(endpoint);
  }, []);

  useEffect(() => {
    if (isFocused) {
      setCutomisableVisible(false); // Close the modal when the component is focused
    }
  }, [isFocused]);

  const toggleShowMore = (itemId) => {
    // Toggle the showMore state for the clicked item
    setShowMore((prevShowMore) => ({
      ...prevShowMore,
      [itemId]: !prevShowMore[itemId],
    }));
  };

  const toggleBottomModal = (item) => {
    setBottomIsModalVisible(true);
    setSelectedItem([item]);
  };

  const toggleMenuModal = (item) => {
    setMenuModalVisible(true);
  };

  const toggleCustomisableModal = () => {
    console.log("This is an toggleCustom modal");

    setCutomisableVisible(true);
  };

  const HorizontalLine = () => <View style={styles.horizontalLine} />;

  const scrollToNextImage = useCallback(() => {
    if (currentIndex < totalImages - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }

    scrollViewRef.current.scrollTo({
      x: currentIndex * 400,
      animated: true,
    });
  }, [currentIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isFocused) {
        scrollToNextImage();
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [isFocused, scrollToNextImage]);

  useEffect(() => {
    if (productId) {
      dispatch(setVenderSliderData([])); // Clear vendor slider data
      // dispatch(setData([])); // Clear product data
      const endpoint = `api/v1/Catalog/GetVendorSlider?ids=${productId}`;
      fetchVendorSliderApiData(endpoint);
    }
  }, [productId]);

  // useEffect(() => {
  //   console.log("{{{{{{}}}}}",vendorTypeID);

  //   if (productId) {
  //     dispatch(setData([]));
  //     // const endpoint = `api/v1/Catalog/ItemsByVendor?ids=${productId}&pageSize=10&pageIndex=1&storeID=1046&UserID=0`
  //    // const endpoint = `/api/v1/Catalog/SearchProduct?VendorIds=${productId}&pageSize=10&pageIndex=1&storeID=0&UserID=0`
  //     // const endpoint=`/api/v1/Catalog/SearchProduct?VendorIds=${productId}&pageSize=50&pageIndex=1&storeID=0&UserID=0&VendorTypeID=${vendorTypeID}`
  //     const endpoint=`/api/v1/Catalog/SearchProduct?VendorIds=${productId}&pageSize=10&pageIndex=1&storeID=0&UserID=676789&VendorTypeID=${vendorTypeID}`
  //     fetchApiData(endpoint);
  //   }
  // }, [productId]);

  useEffect(() => {
    // Set vendorTypeID to 1 if it is undefined
    const resolvedVendorTypeID = vendorTypeID || 1;

    
    _api_url(productId,resolvedVendorTypeID)
   
  }, [productId, vendorTypeID,]); 

  const _api_url = (productId,resolvedVendorTypeID) =>{
    if (productId) {
      dispatch(setData([]));

      const endpoint = `/api/v1/Catalog/SearchProduct?VendorIds=${productId}&pageSize=${pageNumber}&pageIndex=1&storeID=0&UserID=${cutomerId}&VendorTypeID=${resolvedVendorTypeID}`;

      fetchApiData(endpoint);
    }
  }

  useEffect(() => {
    const getCategoryInfo = productData.map((category) => ({
      id: category.categoryId,
      name: category.categoryName,
    }));
    setCategoryInfo(getCategoryInfo);
  }, [productData]);

  useEffect(() => {
    console.log("Updated productAttributes:", productAttributes);
  }, [productAttributes]);

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

  const handleDropdownChange = (productAttributeMappingId, id) => {
    var key = `${productAttributeMappingId}-${id}`;
    setSelectedDropdownValue(key);
  };

  const isVegiesSelected = (id) => {
    if (selectedVegies == null) {
      return false;
    } else {
      return selectedVegies.includes(id);
    }
  };

  const fetchCartData = async (endpoint: string) => {
    try {
      const response = await Api.fetchEndpointData(endpoint);

      dispatch(setCartData(response.data));
      dispatch(setCartError(null)); // Clear any previous errors
    } catch (error) {
      // dispatch(setError('Error fetching data. Please try again.'));
      console.error("Error fetching data:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setcartitem(0);
      fetchCartDataa();
    }, [])
  );

  const [cartItem, setcartitem] = useState(null);
  const fetchCartDataa = async () => {
    try {
      const endpoint = `api/v1/Catalog/GetFullCart?CustomerID=${cutomerId}`;
      const response = await Api.fetchEndpointData(endpoint);
      const TotalQuantity = response.data.map((data) => {
        setcartitem(data.totalQuantity);
      });
      dispatch(setCartData(response.data));
      dispatch(setCartError(null));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchVendorSliderApiData = async (endpoint: string) => {
    try {
      const response = await Api.fetchEndpointData(endpoint);
      dispatch(setVenderSliderData(response.data));
      // console.log("This is an product responce data ",response.data)
      dispatch(setVenderSliderError(null)); // Clear any previous errors
    } catch (error) {
      // dispatch(setError('Error fetching data. Please try again.'));
      console.error("Error fetching data:", error);
    }
  };

  const fetchApiData = async (endpoint: string) => {
    try {
      const response = await Api.fetchEndpointData(endpoint);
      dispatch(setData(response.data));
      console.log("This is an product responce data ", response.data);
      dispatch(setError(null)); // Clear any previous errors
    } catch (error) {
      Alert.alert("No Orders")
      // dispatch(setError('Error fetching data. Please try again.'));
      console.error("Error fetching data:", error);
    }
  };

  const handleAddCartDataas = async (item, isCustomizedItem) => {
    // Reset the productAttributes array at the beginning
    setProductAttributes([]);

    if (item == null && isCustomizedItem) {
      item = lineItem;

      if (selectedBread) {
        const attributes = selectedBread.split("-");
        productAttributes.push({
          productAttributeMappingId: parseInt(attributes[0]),
          productAttributeValueId: parseInt(attributes[1]),
        });
      }

      selectedVegies.map((subItem) => {
        if (subItem) {
          const attributes = subItem.split("-");
          productAttributes.push({
            productAttributeMappingId: parseInt(attributes[0]),
            productAttributeValueId: parseInt(attributes[1]),
          });
        }
      });

      if (selectedDropdownValue) {
        const attributes = selectedDropdownValue.split("-");
        productAttributes.push({
          productAttributeMappingId: parseInt(attributes[0]),
          productAttributeValueId: parseInt(attributes[1]),
        });
      }
    }

    try {
      const endpoint = "/api/v1/Catalog/AddToCart";
      const data = {
        storeId: 1046,
        apiKey: "BDD6B8BC-6C51-49C6-8E17-9E09B86E4DBB",
        uniqueSeoCode: "1",
        cartItemID: 0,
        customerId: `${cutomerId}`,
        productId: `${item.id}`,
        quantity: 1,
        productAttributes: productAttributes,
        languageId: 0,
        shoppingCartTypeId: 1,
        customerEnteredPrice: 0,
        productPrice: `${item.price}`,
        attributesxml: "string",
        searchedLatlong: `${latlong}`,
        enteredDeliveryAddress: "pune",
      };

      console.log("TEST:::::", JSON.stringify(data));

      const response = await Api.postEndpointData(endpoint, data);

      // setCartMessage(response.data);

      SetCartBtnText(response);
      console.log(response,"llllllllllllllll")

      if (response.data === "Product added in the cart") {
        fetchCartData();
        Toast.show({
          visibilityTime: 2000,
          text1: "Vonzuu",
          text2: response.data,
          type: "success",
        });
        console.log(
          response,
          "123456789765432345678987654345678987654345678909876"
        );
        console.log("asdasdasdasasd");
      } else {
        console.log("}}}}}}}}}}}}}==================");
        Toast.show({
          visibilityTime: 2000,
          text1: "Vonzuu",
          text2: "card data not set",
          type: "error",
        });
      }
      fetchCartDataa();

      setTimeout(() => {
        Toast.show({
          visibilityTime: 2000,
          text1: "Vonzuu",
          text2: response.data,
          type: "success",
        });
        setCartMessage(null); // Clear the message after hiding the modal
      }, 1000);
      setTimeout(() => {
        setBottomIsModalVisible(false); // Clear the message after hiding the modal
        setCutomisableVisible(false);
      }, 500);
    } catch (error) {
      console.error("Error fetching data:", error);
      setTimeout(() => {
        Toast.show({
          visibilityTime: 4000,
          text1: "Vonzuu",
          text2: "Don't do Order from different Vendors at a same Time",
          text2Style: { color: "black" },
          type: "error",
        });
        setBottomIsModalVisible(false); // Clear the message after hiding the modal
        setCutomisableVisible(false); // Clear the message after hiding the modal
      }, 1000);
    }
  };


const [ll, setll] = useState(false)


const clearCart = async()=> {

setll(true)
  try {
    const endPoint = `/api/v1/Basket/DeleteCartItem?customerId=${cutomerId}&shoppingCartItemId=-1`;
    const response = await Api.deleteEndpointData(endPoint);
    if (response.status === 200) {
      setwantToCleearCart(false)
      setll(false)
    } 
    console.log(response.status,";;;;;;;")
    if (response.success) {
      console.log(response)
      await fetchCartData();
      setll(false)

    }
  } catch (error) {
    console.log(response)
    setwantToCleearCart(false)
    setll(false)


    Toast.show({
      text1:"Internal Error",
      type:"error",
      visibilityTime:3000
    })
    logger.error("Error in clearing the cart items", error);
    // Handle errors as needed
    // dispatch(setCartError("Error clearing the cart"));
  }
}

// const [ErrorMessage, setErrorMessage] = useState("")

const [wantToCleearCart, setwantToCleearCart] = useState(false)
const [Errmsg, setErrmsg] = useState("")
const handleAddCartData =  async (item, isCustomizedItem)=>{
  setProductAttributes([]);


    if (item == null && isCustomizedItem) {
      item = lineItem;

      if (selectedBread) {
        const attributes = selectedBread.split('-');
        productAttributes.push({
          productAttributeMappingId: parseInt(attributes[0]),
          productAttributeValueId: parseInt(attributes[1])
        });
      }

      selectedVegies.map((subItem) => {
        if (subItem) {
          const attributes = subItem.split('-');
          productAttributes.push({
            productAttributeMappingId: parseInt(attributes[0]),
            productAttributeValueId: parseInt(attributes[1])
          });
        }
      });

      if (selectedDropdownValue) {
        const attributes = selectedDropdownValue.split('-');
        productAttributes.push({
          productAttributeMappingId: parseInt(attributes[0]),
          productAttributeValueId: parseInt(attributes[1])
        });
      }
    }
  const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
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
        "searchedLatlong": `${latlong}`,
        "enteredDeliveryAddress": "pune"
});

console.log(raw,"sadsadsadsa")
const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

fetch("https://vonzuu.catalogapi.prelive.co.in/api/v1/Catalog/AddToCart", requestOptions)
  .then((response) => response.json())
  .then((result) => {

    if (result.statusCode === 200) {
      fetchCartData();
      Toast.show({
        visibilityTime: 2000,
        // text1: "Vonzuu",
        text1: result.message,
        type: "success"
      })
      fetchCartDataa()
      setCartMessage(null)
      setBottomIsModalVisible(false);
      setCutomisableVisible(false);
    } else {
console.log(result.message,":;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;")
setwantToCleearCart(true)
setErrmsg(result.message)
      // fetchCartDataa() // Clear the message after hiding the modal
    setBottomIsModalVisible(false); // Clear the message after hiding the modal
    setCutomisableVisible(false);
    

    }
   
  })
  .catch((error) => {
    Toast.show({
      text1:"Internal error",
      type:"error",
      visibilityTime:3000
    })
  });
}





  const fetchMoreData = async () => {
    if (isLoadingMore || !hasMoreData) {
      console.log(
        "Not fetching more data - isLoadingMore:",
        isLoadingMore,
        "hasMoreData:",
        hasMoreData
      );
      return;
    }

    console.log("Fetching more data...");

    setIsLoadingMore(true);

    try {
      const nextPage = currentPage + 1;
      const endpoint = `api/v1/Catalog/SearchProduct?VendorIds=${productId}&pageSize=${
        nextPage * 10
      }&pageIndex=${nextPage}&storeID=0&UserID=0`;

      const response = await Api.fetchEndpointData(endpoint);

      if (response.data.length > 0) {
        console.log("Fetched more data successfully.");
        dispatch(setData([...productData, ...response.data]));
        setCurrentPage(nextPage);
      } else {
        console.log("No more data to fetch.");
        setHasMoreData(false);
      }

      dispatch(setError(null));
    } catch (error) {
      console.error("Error fetching more data:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };
  const getProductsAttribute = async (id) => {
    console.log("This is an GetProductsAttribute function", id);
    setSelectedBread(null);
    setselectedVegies([]);
    try {
      const endpoint = `/api/v1/Catalog/GetProductsAttribute?ProductID=${id}`;
      const response = await Api.fetchEndpointData(endpoint);
      console.log(
        "This is an responce from getProductsAttribute data",
        response.data
      );
      setCustomisAttibuteData(response.data);
    } catch (error) {
      // dispatch(setError('Error fetching data. Please try again.'));
      console.error("Error fetching data:", error);
    }
  };

  const [pageNumber, setPageNumber] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
const handleLoadMore = () => {
  // Alert.alert("---")
      setLoadMore(true);
      setTimeout(() => {
        setPageNumber(prev => prev + 10);
        setLoadMore(false);
    const resolvedVendorTypeID = vendorTypeID || 1;

        // _onRefresh()s
        // fetchCartData()
        _api_url(productId,resolvedVendorTypeID)
        // Alert.alert("000")
      }, 2000);
    };
  
    const _onRefresh = () => {
      setRefreshing(true);
      setTimeout(() => {
        // GET_API();
        setRefreshing(false)
        Alert.alert("jatiin")
      }, 2000);
    };
    console.log(pageNumber,"numbere")
  const renderCategory = ({ item, index }) =>
    // console.log(item,"asd")
    {
      // Log the categoryId for each category

      return (
        <ScrollView scrollEnabled={false}>
          <Text
            style={[
              GlobleStyle.CustomFont,
              styles.headingText,
              { marginLeft: 20 },
            ]}
          >
            {item.categoryName}{" "}
          </Text>

          {logic === 2 ? (
            <FlatList
              data={item.catlogsItems?.slice(0,pageNumber)}
              renderItem={GrocerData}
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              style={{ marginHorizontal: 8 ,marginBottom:20}}
              // keyExtractor={(item) => (item.categoryId ? item.categoryId.toString() : '0')}
              keyExtractor={(item) => (item.id ? item.id.toString() : "0")}
              // ItemSeparatorComponent={HorizontalLine}
              // onEndReached={fetchMoreData}
              // onEndReachedThreshold={0.1}


              // onRefresh={() => _onRefresh()}
              refreshing={refreshing}
              // onEndReached={handleLoadMore}
              onScrollEndDrag={handleLoadMore}
    onEndReachedThreshold={0.1}
    // style={{ marginTop: 20 }}
    ListFooterComponent={() => {
                  return (
                    <View>
                      {loadMore ? (
                        <ActivityIndicator
                          color={'red'}
                          size={'small'}
                          style={{marginBottom: 10, marginTop: 15}}
                        />
                      ) : null}
                    </View>
                  );
                }}
            />
          ) : (
            <>
            <FlatList 
            scrollEnabled={false}
              data={item.catlogsItems.slice(0,pageNumber)}
              renderItem={resurant}
              // keyExtractor={(item) => (item.categoryId ? item.categoryId.toString() : '0')}
              keyExtractor={(item) => (item.id ? item.id.toString() : "0")}
              ItemSeparatorComponent={HorizontalLine}
              
              onRefresh={() => _onRefresh()}
              refreshing={refreshing}
              onEndReached={handleLoadMore}
                onEndReachedThreshold={0.1}
                // style={{ marginTop: 20 }}
                ListFooterComponent={() => {
                  return (
                    <View>
                      {loadMore ? (
                        <ActivityIndicator
                          color={'red'}
                          size={'small'}
                          style={{marginBottom: 10, marginTop: 15}}
                        />
                      ) : null}
                    </View>
                  );
                }}
            />
          
            </>


          )}
        </ScrollView>
      );
    };
  const resurant = ({ item, index }) => (
    <View
      style={{ flexDirection: "row", flex: 1, marginHorizontal: 20 }}
      key={index}
    >
      <View style={{ marginVertical: 30, flex: 5 }}>
        <View style={{}}>
          {/* <Text style={[GlobleStyle.CustomFont, styles.headingText]}>{item.id}</Text> */}
          <Text style={[GlobleStyle.CustomFont, styles.headingText]}>
            {item.name}
          </Text>
          <Text style={[GlobleStyle.CustomFontText, styles.priceText]}>
            {" "}
            ${item.price}
          </Text>
        </View>
        <View style={{}}>
          {Array.isArray(item.shortDescription) &&
          item.shortDescription.length > 8 ? (
            <Text style={[GlobleStyle.CustomFontText]}>
              {showMore[item.id]
                ? item.shortDescription.join(" ")
                : item.shortDescription.slice(0, 5).join(" ")}
            </Text>
          ) : (
            <Text style={[GlobleStyle.CustomFontText]}>
              {item.shortDescription}
            </Text>
          )}
          {Array.isArray(item.shortDescription) &&
            item.shortDescription.length > 8 && (
              <TouchableOpacity onPress={() => toggleShowMore(item.id)}>
                <Text
                  style={[
                    GlobleStyle.CustomFont,
                    { color: "black", fontSize: 17 },
                  ]}
                >
                  {showMore[item.id] ? "Less" : "More"}
                </Text>
              </TouchableOpacity>
            )}
        </View>
      </View>
      <View style={{ paddingHorizontal: 30, flex: 2 }}>
        <Image source={{ uri: item.mediaUrl }} style={styles.porductImage} />
        <View
          style={{
            height: 40,
            width: 80,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
            bottom: 20,
            left: 30,
            borderRadius: 10,
            elevation: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              // Check the value of item.is_ProductAttribute
              if (item.is_ProductAttribute === 1) {
                toggleCustomisableModal();
                getProductsAttribute(item.id);
                setLineItem(item);
              } else {
                // setLineItem(null);
                toggleBottomModal(item);
              }
            }}
          >
            <Text style={[GlobleStyle.CustomFont, { color: "#9B56FF" }]}>
              ADD
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ left: 30, bottom: 10 }}>
          {item.is_ProductAttribute === 1 && (
            <Text
              style={[
                GlobleStyle.CustomFont,
                { color: "#9B56FF", fontSize: 10 },
              ]}
            >
              Customisable
            </Text>
          )}
        </View>
      </View>
    </View>
  );
  const GrocerData = ({ item, index }) => (
    <View style={{ flex: 1, marginHorizontal: 12, marginTop: 19 }}>
      <Image
        source={{ uri: item.mediaUrl }}
        style={{ width: wp(30), height: wp(25), alignSelf: "center" }}
        resizeMode="contain"
      />
      <Text
        style={{
          color: "#091223",
          fontSize: RFPercentage(1.7),
          width: wp(30),
          // height:,
          marginTop: 18,
          fontFamily: "Poppins-Medium",
          // textAlign:"center"
        }}
      >
        {item.name}
      </Text>
      <Text
        style={{
          color: "#737B89",
          fontFamily: "Poppins-Regular",
          fontSize: RFPercentage(1.4),
          marginTop: 2,
        }}
      >
        {item.shortDescription}
      </Text>
      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:7}}>

      <Text
        style={{
          color: "#091223",
          fontSize: RFPercentage(1),
          fontFamily: "Poppins-Medium",
          // marginTop: 2,
        }}
        >
        ${item.price}
      </Text>
      <TouchableOpacity 
      onPress={() => {
                // Check the value of item.is_ProductAttribute
                if (item.is_ProductAttribute === 1) {
                  toggleCustomisableModal();
                  getProductsAttribute(item.id);
                  setLineItem(item);
                } else {
                  // setLineItem(null);
                  toggleBottomModal(item);
                }
              }}
      style={{borderWidth:2,borderColor:"#E3E7EF",borderRadius:8,paddingVertical:3,paddingHorizontal:15,flexDirection:"row",alignItems:"center"}}>
        <Text style={{color:"#091223",fontSize:RFPercentage(1.6),fontFamily:"Poppins-Medium",}}>ADD</Text>
        <Image source={require("../assets/images/plus.png")} style={{width: 10,height:10 ,marginLeft:4}}/>
      </TouchableOpacity>

        </View>
        {item.is_ProductAttribute === 1 && (
          <Text style={ { color: '#6D7E8B', fontSize: RFPercentage(1),alignSelf:"flex-end" ,fontFamily:"Poppins-Medium",marginRight:5}}>Customisable</Text>
        )}
    </View>
  );

  // <View style={{ flexDirection: "row", flex: 1, marginHorizontal: 20 }} key={index}>
  //   <View style={{ marginVertical: 30, flex: 5 }}>
  //     <View style={{}}>
  //       {/* <Text style={[GlobleStyle.CustomFont, styles.headingText]}>{item.id}</Text> */}
  //       <Text style={[GlobleStyle.CustomFont, styles.headingText]}>{item.name}jaitn</Text>
  //       <Text style={[GlobleStyle.CustomFontText, styles.priceText]}> ${item.price}</Text>
  //     </View>
  //     <View style={{}}>
  //       {Array.isArray(item.shortDescription) && item.shortDescription.length > 8 ? (
  //         <Text style={[GlobleStyle.CustomFontText,]}>
  //           {showMore[item.id]
  //             ? item.shortDescription.join(' ')
  //             : item.shortDescription.slice(0, 5).join(' ')}
  //         </Text>
  //       ) : (
  //         <Text style={[GlobleStyle.CustomFontText]}>
  //           {item.shortDescription}
  //         </Text>
  //       )}
  //       {Array.isArray(item.shortDescription) && item.shortDescription.length > 8 && (
  //         <TouchableOpacity onPress={() => toggleShowMore(item.id)}>
  //           <Text style={[GlobleStyle.CustomFont, { color: "black", fontSize: 17 }]}>
  //             {showMore[item.id] ? 'Less' : 'More'}
  //           </Text>
  //         </TouchableOpacity>
  //       )}
  //     </View>
  //   </View>
  //   <View style={{ paddingHorizontal: 30, flex: 2 }}>
  //     <Image source={{ uri: item.mediaUrl }} style={styles.porductImage} />
  //     <View style={{ height: 40, width: 80, backgroundColor: "white", alignItems: "center", justifyContent: "center", bottom: 20, left: 30, borderRadius: 10, elevation: 10 }}>
  //       <TouchableOpacity onPress={() => {
  //         // Check the value of item.is_ProductAttribute
  //         if (item.is_ProductAttribute === 1) {
  //           toggleCustomisableModal();
  //           getProductsAttribute(item.id);
  //           setLineItem(item);
  //         } else {
  //           // setLineItem(null);
  //           toggleBottomModal(item);
  //         }
  //       }}>
  //         <Text style={[GlobleStyle.CustomFont, { color: '#9B56FF' }]}>ADD</Text>
  //       </TouchableOpacity>
  //     </View>
  //     <View style={{ left: 30, bottom: 10, }}>
  //       {item.is_ProductAttribute === 1 && (
  //         <Text style={[GlobleStyle.CustomFont, { color: '#9B56FF', fontSize: 10, }]}>Customisable</Text>
  //       )}
  //     </View>
  //   </View>
  // </View>

  // const renderCategoryMenu = ({ category, index }) => (
  //   <View>
  //     <Text>{category.categoryName}</Text>
  //   </View>
  // );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView >
        <View>
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}
              ref={scrollViewRef}
              pagingEnabled
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.floor(
                  event.nativeEvent.contentOffset.x / 200 // Assuming each image has a width of 400 (adjust as needed)
                );
                setCurrentIndex(newIndex);
              }}
            >
              {sliderDetails.map((data, id) => (
                <View key={data.id} style={styles.imageContainer}>
                  <Image source={{ uri: data.url }} style={styles.image} />
                </View>
              ))}
            </ScrollView>

            <View style={styles.imageInfoContainer}>
              <Text style={styles.imageInfoText}>
                {currentIndex + 1}/{totalImages}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "#FFFFFF",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
                left: 20,
                padding: 10,
                position: "absolute",
                marginTop: 30,
              }}
              onPress={() => navigation.goBack()}
            >
              <View style={{}}>
                <MaterialIcons name="arrow-back" size={25} color={"black"} />
              </View>
            </TouchableOpacity>

            <View style={styles.searchIconContainer}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("SearchProductInVendor", {
                    venderid: productId,
                    latitude: latitude,
                    longitude: longitude,
                  })
                }
              >
                <Image
                  source={require("../assets/images/serchIcon.png")}
                  style={styles.searchIcon}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.dotsContainer}>
            {sliderDetails.map((_, id) => (
              <View
                key={id}
                style={[
                  styles.dot,
                  currentIndex === id ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        </View>

        <View
          style={{
            marginHorizontal: 15,
            marginTop: 20,
            borderBottomColor: "#F2F4F8",
            borderBottomWidth: 2,
            paddingBottom: 20,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <FontAwesome name="star" size={17} color={"#1DC291"} />
            <Text
              style={{
                marginHorizontal: 5,
                fontSize: RFPercentage(1.6),
                color: "#141B2D",
                fontFamily: "Poppins-SemiBold",
              }}
            >
              {ratingAvg}
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: "#141B2D",
                marginVertical: 4,
                fontSize: RFPercentage(2.4),
                fontFamily: "Poppins-SemiBold",
              }}
            >
              {productName}
            </Text>

            <View style={{ flexDirection: "row" }}>
              <Feather name="clock" size={20} color={"#4D5569"} />
              <Text
                style={[
                  GlobleStyle.CustomFontText,
                  { color: "#4D5569", left: 10 },
                ]}
              >
                {openTime}
              </Text>
            </View>

            {/* <View style={{ borderBottomWidth: 2, borderBottomColor: '#F2F4F8', marginVertical: 20 }}>

            </View> */}
          </View>
        </View>

        {/* <View style={{ margin: 5 }}>
          {/* <Text style={[GlobleStyle.CustomFont, { left: 10, fontSize: 20, color: 'black', }]}>Picked For You </Text> */}
        {/* </View> */}

        {/* <View> */}

        <FlatList
          data={productData.flatMap((category, categoryId) => category)}
          renderItem={renderCategory}
          keyExtractor={(item) =>
            item.categoryId ? item.categoryId.toString() : "0"
          }
          ItemSeparatorComponent={HorizontalLine}
          onRefresh={() => _onRefresh()}
          refreshing={refreshing}
          onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            // style={{ marginTop: 20 }}
            ListFooterComponent={() => {
              return (
                <View>
                  {loadMore ? (
                    <ActivityIndicator
                      color={'red'}
                      size={'small'}
                      style={{marginBottom: 10, marginTop: 15}}
                    />
                  ) : null}
                </View>
              );
            }}
         
        />

        {/* </View> */}
        {
          <Modal
            isVisible={isBottomModalVisible}
            style={{
              justifyContent: "flex-end",
              // height:30,
              alignSelf: "auto",
              margin: 0,
            }}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => setBottomIsModalVisible(false)}
            onSwipeComplete={() => setBottomIsModalVisible(false)}
            swipeDirection={["down"]}
          >
            {/* <View style={styles.modalContent}> */}

            {selectedItem.map((item) => (
              <View
                style={{
                  backgroundColor: "white",
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  bottom: 0,
                  borderTopLeftRadius: 12,
                  borderTopRightRadius: 12,
                }}
              >
                <Image
                  source={{ uri: item.mediaUrl }}
                  resizeMode="cover"
                  style={{ width: "100%", height: "46%", borderRadius: 10 }}
                />

                <Text style={[GlobleStyle.headerText]}>{item.name}</Text>
                <Text style={[GlobleStyle.NameOfRes]}>$ {item.price}</Text>
                <Text style={[GlobleStyle.Description]}>
                  {item.shortDescription}
                </Text>
                {/* <Text style={[GlobleStyle.Description]}>{item.fullDescription}</Text> */}

                <TouchableOpacity
                  style={{
                    backgroundColor: "#33FFC2",
                    alignItems: "center",
                    paddingVertical: 15,
                    borderRadius: 12,
                    marginVertical: 10,
                  }}
                  onPress={() => handleAddCartData(item)}
                >
                  <Text
                    style={[
                      styles.BtnText,
                      GlobleStyle.CustomHeadingColor,
                      GlobleStyle.CustomFont,
                    ]}
                  >
                    Add To Cart
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
            {/* </View> */}
          </Modal>
        }
        {
          <Modal
            isVisible={isCustomisableVisible}
            style={styles.bottomModal}
            backdropTransitionOutTiming={0}
            onBackdropPress={() => setCutomisableVisible(false)}
            onSwipeComplete={() => setCutomisableVisible(false)}
            swipeDirection={["down"]}
          >
            <View style={styles.customisableModalContainer}>
              <Text
                style={[
                  GlobleStyle.CustomFont,
                  { fontSize: 20, color: "black" },
                ]}
              >
                Customize your order
              </Text>
              <View>
                <View>
                  {customisAttibuteData.map((attributeMapping) => {
                    const {
                      productAttributeMappingId,
                      attributeValueTypeId,
                      productsAttribute,
                    } = attributeMapping;

                    return (
                      <View key={productAttributeMappingId}>
                        <View style={{ marginVertical: 10, top: 5, left: 10 }}>
                          <Text
                            style={[
                              GlobleStyle.CustomFont,
                              { fontSize: 15, color: "#5F6E7A" },
                            ]}
                          >
                            {attributeMapping.groupName}
                          </Text>
                        </View>

                        {attributeValueTypeId === 1 && (
                          <Picker
                            style={{ color: "black" }}
                            selectedValue={selectedDropdownValue}
                            onValueChange={(itemValue, itemIndex) => {
                              const selectedAttr = productsAttribute[itemIndex];
                              setSelectedDropdownValue(itemValue);
                              // setSelectedDropdownValue(selectedAttr);
                              // handleDropdownChange(productAttributeMappingId,itemValue);
                            }}
                          >
                            <Picker.Item
                              label="Select an option"
                              value={null}
                              style={{ color: "black" }}
                            />
                            {productsAttribute.map((attribute) => (
                              <Picker.Item
                                style={{ color: "black" }}
                                key={attribute.attributeValueId}
                                label={`${attribute.name} - $ ${attribute.priceAdjustment}`}
                                value={`${productAttributeMappingId}-${attribute.attributeValueId}`}
                              />
                            ))}
                          </Picker>
                        )}

                        {attributeValueTypeId === 2 && (
                          <View>
                            {productsAttribute.map((attribute) => (
                              <TouchableOpacity
                                key={attribute.attributeValueId}
                                onPress={() =>
                                  handleRadioPress(
                                    productAttributeMappingId,
                                    attribute.attributeValueId
                                  )
                                }
                              >
                                <View style={{ flexDirection: "row" }}>
                                  <RadioButton
                                    value={attribute.attributeValueId}
                                    status={
                                      selectedBread ===
                                      `${productAttributeMappingId}-${attribute.attributeValueId}`
                                        ? "checked"
                                        : "unchecked"
                                    }
                                    onPress={() =>
                                      handleRadioPress(
                                        productAttributeMappingId,
                                        attribute.attributeValueId
                                      )
                                    }
                                    color={"#1DC291"}
                                  />
                                  <View style={styles.detailsContainer}>
                                    <Text
                                      style={[
                                        GlobleStyle.CustomFontText,
                                        {
                                          color: "#1C2A38",
                                          fontSize: 15,
                                          alignItems: "flex-start",
                                        },
                                      ]}
                                    >
                                      {attribute.name}
                                    </Text>
                                  </View>

                                  <View style={styles.priceContainer}>
                                    <Text
                                      style={[
                                        GlobleStyle.CustomFontText,
                                        { color: "#50616E", fontSize: 15 },
                                      ]}
                                    >
                                      {" "}
                                      ${attribute.priceAdjustment}
                                    </Text>
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
                                onPress={() =>
                                  handleCheckboxPress(
                                    productAttributeMappingId,
                                    attribute.attributeValueId
                                  )
                                }
                              >
                                <View style={{ flexDirection: "row" }}>
                                  <Checkbox
                                    status={
                                      isVegiesSelected(
                                        `${productAttributeMappingId}-${attribute.attributeValueId}`
                                      )
                                        ? "checked"
                                        : "unchecked"
                                    }
                                    onPress={() =>
                                      handleCheckboxPress(
                                        productAttributeMappingId,
                                        attribute.attributeValueId
                                      )
                                    }
                                    color={"#1DC291"}
                                  />

                                  <View style={styles.detailsContainer}>
                                    <Text
                                      style={[
                                        GlobleStyle.CustomFontText,
                                        {
                                          color: "#1C2A38",
                                          fontSize: 15,
                                          alignItems: "flex-start",
                                        },
                                      ]}
                                    >
                                      {attribute.name}
                                    </Text>
                                  </View>

                                  <View style={styles.priceContainer}>
                                    <Text
                                      style={[
                                        GlobleStyle.CustomFont,
                                        { marginLeft: 5 },
                                      ]}
                                    >
                                      $ {attribute.priceAdjustment}
                                    </Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            ))}
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleAddCartData(null, true)}
                style={{
                  alignItems: "center",
                  paddingVertical: 10,
                  marginTop: 15,
                  backgroundColor: "#33FFC2",
                  borderRadius: 20,
                }}
              >
                <View>
                  {/* <Text style={[GlobleStyle.CustomFont, { fontSize: 20, color: "black" }]}>Total Price</Text>
                  <Text style={[GlobleStyle.CustomFontText, { color: "#1C2A38", fontSize: 15, }]}>Extra chargers may apply </Text> */}
                </View>

                <View>
                  <Text
                    style={[
                      GlobleStyle.CustomFont,
                      { fontSize: RFPercentage(1.9), color: "black" },
                    ]}
                  >
                    Add
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        }
        <Modal
          isVisible={isMenuModalVisible}
          style={{ margin: 0 }}
          backdropTransitionOutTiming={0}
          onBackdropPress={() => setMenuModalVisible(false)}
          onSwipeComplete={() => setMenuModalVisible(false)}
          // swipeDirection={['right']}  // Change swipeDirection to 'right'
          animationIn={"slideInRight"}
          // animationIn={'slideInLeft'}
          animationOut={"slideOutRight"}
        >
          <View style={styles.menuModalContainer}>
            {productData.map((category, categoryId) => (
              <TouchableOpacity
                onPress={() => {
                  setMenuModalVisible(false);
                  console.log("This is an iondex", categoryId);
                }}
              >
                <Text
                  style={[
                    GlobleStyle.CustomFont,
                    { fontSize: 20, color: "black" },
                  ]}
                >
                  {category.categoryName} ({category.catlogsItems.length})
                </Text>
              </TouchableOpacity>
            ))}
            {/* <TouchableOpacity style={[GlobleStyle.PrimaryColor, { alignSelf: 'center', paddingHorizontal: 10 }]} onPress={() => setMenuModalVisible(false)}>
              <Text style={{ color: "black", fontSize: RFPercentage(1.8) }}>Cancel</Text>
            </TouchableOpacity> */}
          </View>
        </Modal>










        <Modal
        animationType="slide"
        transparent={true}
        visible={wantToCleearCart}
        // style={{backgroundColor:"red",flex:1}}
        // onRequestClose={closeModal}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
          <View style={{backgroundColor:"white",paddingHorizontal:30,paddingVertical:20,borderRadius:12,borderWidth:1,borderColor:"black"}}>

       <Text style={{color:"black",fontSize:RFPercentage(2),fontFamily:"Poppins-Medium",textAlign:"center"}}>{Errmsg}</Text>


<View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",marginTop:20}}>
  {
    ll ?(
      <View>
        <ActivityIndicator animating={ll} color={"#00DB99"} size={20}/>
      </View>
    ):(
      <TouchableOpacity onPress={()=>clearCart()} style={styles.buttonConatiner}>
      <Text style={{color:"black",fontSize:RFPercentage(2),fontFamily:"Poppins-Medium",textAlign:"center"}}>{"Yes"}</Text>
        
      </TouchableOpacity>
    )
  }
 
  <TouchableOpacity onPress={()=>setwantToCleearCart(false)} style={styles.buttonConatiner}>
  <Text style={{color:"black",fontSize:RFPercentage(2),fontFamily:"Poppins-Medium",textAlign:"center"}}>{"No"}</Text>
    
  </TouchableOpacity>

</View>


          </View>
        </View>
      </Modal>

      </ScrollView>







      












      <TouchableOpacity
        onPress={() => {
          toggleMenuModal();
        }}
        style={styles.menuMainContainer}
      >
        <View style={styles.menubtnConatiner}>
          <Image
            source={require("../assets/images/menu.png")}
            style={styles.menuImage}
          />
        </View>
        <View style={styles.menuTextConatiner}>
          <Text style={[GlobleStyle.CustomFontText, styles.menuBtnText]}>
            {" "}
            Menu
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("MyCart")}
        style={styles.cartMainContainer}
      >
        <AntDesign name="shoppingcart" size={25} color={"white"} />

        <View
          style={{
            position: "absolute",
            right: -8,
            top: -6,
            backgroundColor: "#33FFC2",
            height: 20,
            width: 20,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "black",
              textAlign: "center",
            }}
          >
            {cartItem}
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    position: "relative",
  },
  scrollViewContent: {
    flexDirection: "row", // Horizontal scrolling
  },
  image: {
    height: 400,
    width: 400, // Assuming each image has a width of 400 (adjust as needed)
    resizeMode:"cover"
  },
  imageInfoContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    paddingHorizontal: 5,
  },
  imageInfoText: {
    color: "white",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    position: "absolute",
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
    backgroundColor: "white",
  },
  dotInactive: {
    backgroundColor: "gray",
  },
  searchIconContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    // alignContent:"flex-start",justifyContent:"flex-start",
    elevation: 7,
  },
  searchIcon: {
    width: 110,
    height: 110,
  },
  headingText: {
    fontSize: 20,
    color: "black",
  },

  priceText: {
    fontSize: 17,
    color: "black",
  },
  porductImage: {
    height: 120,
    width: 120,
    borderRadius: 10,
  },
  itemContainer: {
    // flex: 1,
    margin: 2,
    // paddingBottom:30,
    //  padding: 30,
    //  paddingHorizontal:15,
    borderRadius: 5,
    // flexDirection: "row",
  },
  horizontalLine: {
    height: 2,
    backgroundColor: "#F2F4F8",
    marginHorizontal: 5,
    paddingVertical: 1,
    bottom: 10,
  },
  backbtnContainer: {
    position: "absolute",
    top: 25,
    // right: 340,
    // elevation: 7,
  },
  bottomModal: {
    justifyContent: "flex-end",
    // height:30,
    alignSelf: "stretch",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "red",
    // padding: 22,
    // paddingHorizontal:15,
    position: "absolute",
    // paddingVertical:15,
    width: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // height: "40%",
  },
  modalText: {
    fontSize: 20,
    marginBottom: 20,
  },
  bottomSheet: {
    backgroundColor: "white",
    padding: 16,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  menuMainContainer: {
    height: 40,
    width: 100,
    justifyContent: "center",
    borderRadius: 20,
    bottom: 45,
    left: 20,
    position: "absolute",
    backgroundColor: "#091223",
    flexDirection: "row",
    alignItems: "center",
  },
  cartMainContainer: {
    height: 40,
    width: 40,
    justifyContent: "center",
    borderRadius: 25,
    right: 20,
    bottom: 50,
    position: "absolute",
    backgroundColor: "#091223",
    flexDirection: "row",
    alignItems: "center",
  },
  menubtnConatiner: {
    justifyContent: "center",
    alignItems: "center",
  },
  cartbtnConatiner: {
    justifyContent: "center",
    alignItems: "center",
  },
  menuImage: {
    height: 25,
    width: 25,
    tintColor: "white",
  },
  menuTextConatiner: {
    justifyContent: "center",
    alignItems: "center",
  },
  menuBtnText: {
    color: "black",
    color: "white",
  },
  menuModalContainer: {
    backgroundColor: "#f5f5f5",
    padding: 22,
    borderRadius: 20,
    height: 200,
    marginLeft: 90,
    marginRight: 10,
  },

  customisableModalContainer: {
    backgroundColor: "#FFFFFF",
    // padding: 22,,
    paddingVertical: 10,
    paddingHorizontal: 22,
    // alignItems:'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // height: 700,
  },
  radioBtnConatiner: {
    flex: 1, // Adjust flex property based on your layout requirements
    // Additional styling properties for the name container
  },
  detailsContainer: {
    flex: 6,
    alignContent: "center",
    justifyContent: "center", // Adjust flex property based on your layout requirements
    // Additional styling properties for the details container
  },
  priceContainer: {
    flex: 1, // Adjust flex property based on your layout requirements
    // Additional styling properties for the price container
  },

  BtnContainer: {
    height: responsiveHeight(7),
    width: responsiveWidth(90),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    top: 10,
    marginVertical: 10,
  },
  BtnText: {
    fontSize: 18,
  },
  buttonConatiner:{
    backgroundColor:"#00DB99",
    paddingVertical:8,
    borderRadius:8,
    // paddingHorizontal:50
    width:wp(35)
  }
});

export default ProductDetail;