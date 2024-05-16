import React, { useEffect,useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image ,Button,SafeAreaView} from 'react-native';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect, useNavigation,useRoute} from '@react-navigation/native';
import GlobleStyle from '../utils/GlobleStyle';
import { responsiveWidth, responsiveHeight } from 'react-native-responsive-dimensions';
import { ScrollView } from 'react-native-gesture-handler';
import { setCartData, setCartError,clearCartData} from '../reduxtoolkit/CartSlice';
import Api from '../services/Api';
import * as logger from "../utils/logger";
import { RFPercentage } from 'react-native-responsive-fontsize';
 
// Define the MyCart component
const MyCart = (props) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [itemQuantity, setItemQuantity] = useState(1);
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
  const [TipAmount,setTipAmount]=useState(['3','5','10','Other'])
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [otherAmount, setOtherAmount] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [isTipInputVisible, setIsTipInputVisible] = useState(false);
  const [orderDetailID, setOrderDetailID] = useState(null);
  const [deliveryAdress,setDeliveryAdress]=useState('');
  const [deliveryAdressId,setDeliveryAdressId]=useState('');
  const [VenderId,setVenderId]=useState(null)
  const [TotalAmmount,setTotalAmmount]=useState()
  const route = useRoute();
  const [Subtotal, setSubtotal] = useState(null)
const applycopundata = props.route.params;
console.log(applycopundata,"==============================///")
  const { formData, selectedAddressId} = route.params || {};
  console.log("???????????????????",selectedAddressId);
  const cutomerId = useSelector((state) => state.CustomerIdSlice.customerId);


  useFocusEffect(
    React.useCallback(() => {
      fetchCartData();
      getOrderdetails();
    }, []))

  useFocusEffect(
    React.useCallback(() => {
      if (formData && selectedAddressId){
        setDeliveryAdress('');
   
        // Do something with formData
        setDeliveryAdress(formData.addressLine2);
      }
    }, [formData,selectedAddressId]))
  // useEffect(() => {
  //   if (formData && selectedAddressId){
  //     setDeliveryAdress('');
 
  //     // Do something with formData
  //     setDeliveryAdress(formData.addressLine2);
  //   }
  // }, [formData,selectedAddressId]);
 
 
 
  // Retrieve cart data from the Redux store
  const cartData = useSelector((state) => state.CartData.products, shallowEqual);
 
  console.log("This an cart data",cartData[0]);
  const getOrderdetails = () => {
    // Check if cartData exists and has at least one item
   
    if (cartData.length > 0) {
      
      const currentVenderId = cartData[0].venorID;
      const myOrderId = cartData[0].orderdetailID;
      const CurrentSubtota = cartData[0].subTotal;
      setOrderDetailID(myOrderId);
      setVenderId(currentVenderId);
      setSubtotal(CurrentSubtota);
      console.log("cunrett sub total",CurrentSubtota)
      // console.log(currentVenderId)÷
    } else {
      // Handle the case where cartData is undefined or empty
      console.error("Cart data is undefined or empty");
    }
  }
 
  // Create a new array to store unique products
  const uniqueCartData = [];
 
  console.log(uniqueCartData,"--------------;;;;")
 
  // Iterate through the original cartData and add unique products to the new array
  cartData.forEach((item) => {
    const existingProductIndex = uniqueCartData.findIndex(
      (uniqueItem) => uniqueItem.productId === item.productId
    );
   
    if (existingProductIndex === -1) {
      // Product not found in uniqueCartData, add it
      uniqueCartData.push(item);
    } else {
      // Product found in uniqueCartData, update the quantity
      uniqueCartData[existingProductIndex].quantity += item.quantity;
    }
  });
 
  const grandTotal=uniqueCartData.map((item)=>item.grandTotal);
  const newGrandTotal=grandTotal[0];
  console.log(">>>>>>>>> This is an new grand Total",newGrandTotal)
 
  // Fetch cart data from the API and update the Redux store
  const fetchCartData = async () => {
    try {
      const endpoint = `api/v1/Basket/GetFullCart?CustomerID=${cutomerId}`;
      const response = await Api.fetchEndpointData(endpoint);
      console.log("fetchData...responce....",response.data);
      dispatch(setCartData(response.data));
      dispatch(setCartError(null));
      getOrderdetails();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleIncreaseQuantity = async (cartItem, qty) => {
   
    const cartItemId = cartItem.cartItemID;
    console.log("******",cartItemId)
    try {
      // // Increment the item quantity
      // const updatedQuantity = itemQuantity + 1;
      // setItemQuantity(updatedQuantity);
  
      const currentQty = cartData && cartData.length > 0 ? cartData[0].cartItems.find(item => item.cartItemID = cartItemId)?.quantity: 0;
      
      // const updatedQuantity = currentQty ? currentQty + 1 : 1;
      const updatedQuantity = qty + 1;
      // Make a PUT request to update the quantity
      const endpoint = `/api/v1/Catalog/UpdateCartItemQty?customerId=${cutomerId}&shoppingCartItemId=${cartItemId}&Quantity=${updatedQuantity}`;
      const response = await Api.putEndpointData(endpoint);
  
      // If the quantity is successfully updated, fetch the latest data from the API
      await fetchCartData();
    } catch (error) {
      console.error('Error in handleIncreaseQuantity:', error);
      // Handle the error or show an error message to the user
    }
  };
  
  const handleDecreaseQuantity = async (cartItem, qty) => {
    const cartItemId = cartItem.cartItemID;
  
    try {
      // // Decrease the item quantity, but not below 1
      // const updatedQuantity = Math.max(itemQuantity - 1, 1);
      // setItemQuantity(updatedQuantity);
      const currentQty = cartData && cartData.length > 0 ? cartData[0].cartItems.find(item => item.cartItemID = cartItemId)?.quantity: 1;
      
      // const updatedQuantity = currentQty ? currentQty - 1 : 1;
      const updatedQuantity = qty - 1;
 
      // Make a PUT request to update the quantity
      const endpoint = `/api/v1/Catalog/UpdateCartItemQty?customerId=${cutomerId}&shoppingCartItemId=${cartItemId}&Quantity=${updatedQuantity}`;
      const response = await Api.putEndpointData(endpoint);
  
      // If the quantity is successfully updated, fetch the latest data from the API
      await fetchCartData();
    } catch (error) {
      console.error('Error in handleDecreaseQuantity:', error);
      // Handle the error or show an error message to the user
    }
  };
  
  const handleDeleteCartItem = async (cartItem)=>{
    const cartItemId = cartItem.cartItemID;
     try {
      const endPoint=`/api/v1/Catalog/DeleteCartItem?customerId=${cutomerId}&shoppingCartItemId=${cartItemId}`
      const responce=await Api.deleteEndpointData(endPoint);
      await fetchCartData()
 
     } catch (error) {
      console.log('Error in handle deleteCartItem',error);
     }
  }
  
  const handleSuggestionPress = () => {
    setIsInputVisible(true);
  };
 
  const handleAddSuggestion =async() => {
    // Handle the logic to add the suggestion (e.g., send it to an API)   
    try {
      const endPoint=`/api/v1/Catalog/UpdateOrderNoteForCart?customerId=${cutomerId}&Message=${suggestionText}&storeid=1046`
      const responce=await Api.putEndpointData(endPoint);
      await fetchCartData();
      
    } catch (error) {
      console.log('Error in handle sussation message',error);
    }
   
    setIsInputVisible(false);
    setSuggestionText('');
  };
  
  const handleAmountClick = (amount) => {
    if (amount === 'Other') {
      setIsTipInputVisible(true);
    } else {
      setIsTipInputVisible(false);
    }
    setSelectedAmount(amount);
    yourFunction(amount);
  };
 
  const yourFunction = async(amount) => {
   
    try {
      const endpoint=`/api/v1/Catalog/UpdateTipForAgentforCart?customerId=${cutomerId}&TipAmount=${amount}&storeid=0`
      const responce=await Api.putEndpointData(endpoint);
      await fetchCartData();
      TipAmount([]);
    } catch (error) {
      console.log('tip is not updated in ',error);
    }
 
  };
 
  const handleTipTextAmount = () => {
 
    yourFunction(otherAmount);
    setIsTipInputVisible(false); // Close the input field after submitting
  };
 
  const handleClearcart = async () => {
    try {
      // Update local cartData variable with an empty array immediately
      const updatedCartData = [];
      dispatch(clearCartData()); // Update the state
  
      const endPoint = `/api/v1/Basket/DeleteCartItem?customerId=${cutomerId}&shoppingCartItemId=-1`;
      const response = await Api.deleteEndpointData(endPoint);
      // If the API call is successful, fetch the updated cart data
      if (response.success) {
        await fetchCartData();
      }
    } catch (error) {
      logger.error("Error in clearing the cart items", error);
      // Handle errors as needed
      dispatch(setCartError("Error clearing the cart"));
    }
  };
 
  const handleApplyCoupon=()=>{
    getOrderdetails();
    navigation.navigate('Coupon',{orderDetailID:orderDetailID,CurrentVender:VenderId,subTotalcurrentuser:Subtotal})
  }
 
  // Render the MyCart component
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={{ padding: 8, backgroundColor: '#F2F5F8', width: 50, borderRadius: 15, left: 5, margin: 10 }}>
            <MaterialIcons name="arrow-back" size={30} color={"black"} />
          </View>
        </TouchableOpacity>
 
        {/* Title */}
        <View style={{ justifyContent: "center", right: 60 }}>
          <Text style={{ fontSize: 20, color: "black" }}>My Cart</Text>
        </View>
 
       
        <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", right: 20 }}
         onPress={()=>handleClearcart()}>
          <Text style={{ fontSize: 15, color: "#9B56FF" }}>Clear Cart</Text>
        </TouchableOpacity>
      </View>
 
      {/* Cart Items */}
      <ScrollView>
 
      <View>
  {uniqueCartData.length > 0 ? (
    uniqueCartData.map((item, index) => (
      <View key={index}>
        <View style={{ width: responsiveWidth(100), height: 50, backgroundColor: '#F2F5F8', padding: 5, paddingLeft: 20 }}>
          <Text style={{ fontSize: 19, color: 'black' }}>{item.vendorName}</Text>
        </View>
 
        {item.cartItems.map((cartItem, cartIndex) => (
          <View key={cartIndex} style={{ padding: 20, flexDirection: 'row', flex: 1 }}>
            <View style={{ flex: 1 }}>
              <Image source={{ uri: cartItem.productImgURL }} style={{ height: 50, width: 50, borderRadius: 4 }} />
              <Text style={[GlobleStyle.CustomFont,{fontSize:15,color:"black"}]}>Total</Text>
              <Text style={[GlobleStyle.CustomFont,{fontSize:13,color:"black"}]}>${cartItem.amountWithAttribute}</Text>
            </View>
            <View style={{ flex: 3 }}>
              <Text style={{ fontSize: 16, color: 'black' }}>{cartItem.productName}</Text>
              <Text style={{ fontSize:10, color: '#737B89' }}>{cartItem.quantity} X {cartItem.price}$</Text>
 
              {/* Display attributes if available */}
              {cartItem.attributes && cartItem.attributes.length > 0 && (
                <View>
                  {cartItem.attributes.map((attribute, attributeIndex) => (
                    <View key={attributeIndex}>
                      <Text style={{color:'black'}}>{attribute.name} - ${attribute.priceAdjustment}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <View style={{ flexDirection: 'row', flex: 2, justifyContent: "center", alignItems: "center" }}>
              {cartItem.quantity <= 1 ? (
                <TouchableOpacity onPress={() => handleDeleteCartItem(cartItem)}>
                  <View style={{ height: 30, width: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'gray' }}>
                    <MaterialIcons name="delete-outline" size={25} color={"#737B89"} />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleDecreaseQuantity(cartItem, cartItem.quantity)}>
                  <View style={{ height: 30, width: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'gray' }}>
                    <Text style={{ fontSize: 20, color: '#9B56FF', fontWeight: '500' }}>-</Text>
                  </View>
                </TouchableOpacity>
              )}
              <View style={{ alignItems: 'center', margin: 5 }}>
                <Text style={{ fontSize: 22, color: '#9B56FF' }}>{cartItem.quantity}</Text>
              </View>
              <TouchableOpacity onPress={() => handleIncreaseQuantity(cartItem, cartItem.quantity)}>
                <View style={{ height: 30, width: 35, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'gray' }}>
                  <Text style={{ fontSize: 19, color: '#9B56FF', fontWeight: "500" }}>+</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    ))
  ) : (
    
    <View style={{paddingVertical:30}}>
      <Text style={[GlobleStyle.CustomFont,{color:"black",alignSelf:"center",}]}>No Product Available in The Cart</Text>
  </View>
  )}
</View>
        {/* <TouchableOpacity onPress={() => navigation.navigate('Coupon',{orderDetailID:orderDetailID,CurrentVender:VenderId,subTotalcurrentuser:Subtotal})}> */}
        {
            applycopundata ? (
     
                <TouchableOpacity onPress={() => handleApplyCoupon()}  style={{backgroundColor:"#9B56FF60",marginHorizontal:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:10,paddingVertical:10,borderRadius:10,borderWidth:1,borderStyle:'dashed',borderColor:"#9B56FF"}}>
 
          
<Text style={{color:"#0D1D28",fontSize:RFPercentage(2),fontFamily:"Poppins-Medium"}}>Applied Coupon</Text>
<View style={{flexDirection:'row',alignItems:'center'}}>
 
<Image source={require('../../src/assets/done.png')} style={{width:25,height:25,marginRight:5}} resizeMode='contain'/>
<Text style={{color:"#091223",fontSize:RFPercentage(2),fontFamily:"Poppins-SemiBold"}}>{applycopundata.data}</Text>
</View>
             
                </TouchableOpacity>
              ):(
                <TouchableOpacity onPress={() => handleApplyCoupon()}  style={{backgroundColor:"#9B56FF60",marginHorizontal:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:10,paddingVertical:10,borderRadius:10,borderWidth:1,borderStyle:'dashed',borderColor:"#9B56FF"}}>
 
          
                <Text style={{color:"#0D1D28",fontSize:RFPercentage(2),fontFamily:"Poppins-Medium"}}>Apply Coupon</Text>
              <Image source={require("../../src/assets/arrow.png")} resizeMode='center' style={{width:14,height:14}}/>
              
                </TouchableOpacity>
           
                )
        }
        <View style={{ padding: 20, }}>
          <View style={{ borderWidth: 1, borderBlockColor: "#E3E7EF" }}></View>
        </View>
    <View style={{ width: responsiveWidth(90), backgroundColor: '#F2F5F8', padding: 10, paddingHorizontal: 12, marginHorizontal: 20, borderRadius: 10, justifyContent: "center", flexDirection: "row" }}>
      <Image source={require('../assets/images/DoubleQuotes.png')} style={{ width: 15, height: 15, resizeMode: 'contain' }} />
      {
        uniqueCartData.map((item, index) => (
          <View key={index}>
            {item.orderNote ? (
              <Text style={[GlobleStyle.CustomFontText, { color: "black", textAlign: "left", fontSize: 17, left: 5 }]}>
                {item.orderNote}
              </Text>
            ) : (
              <TouchableOpacity onPress={handleSuggestionPress}>
                <Text style={[GlobleStyle.CustomFontText, { color: "black", textAlign: "left", fontSize: 17, left: 5 }]}>
                  {isInputVisible ? '' : 'Any Suggestion? for Rider or Merchant. We will pass it on.'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      }
      {isInputVisible && (
        <View>
          <TextInput
            placeholder="Type your suggestion..."
            placeholderTextColor={'grey'}
            value={suggestionText}
            onChangeText={text => setSuggestionText(text)}
           style={{color:"black",fontSize:RFPercentage(1.4),paddingHorizontal:5,fontFamily:"Poppins-SemiBoldß"}}
          />
          <Button title="Add" onPress={handleAddSuggestion} color={"#00DB99"}/>
        </View>
      )}
    </View>
 
        <View style={{ padding: 20, }}>
          <View style={{ borderWidth: 1, borderBlockColor: "#E3E7EF" }}></View>
        </View>
        
        <View style={{width:responsiveWidth(90),padding:10,left:10}}>
           <Text style={[GlobleStyle.CustomFont,{color:"black",fontSize:17}]}>Add a Tip for your rider </Text>
           <Text style={[GlobleStyle.CustomFontText,{fontSize:13,color:"#737B89"}]}>The entire amount will be transferred to the rider.</Text>
           <Text style={[GlobleStyle.CustomFontText,,{fontSize:13,color:'#737B89'}]}>Valid only if you pay online.</Text>
 
         <View  style={{flexDirection:"row",top:5}}>
           {TipAmount.map((amount, index) => (
            <TouchableOpacity
            key={index}
            onPress={() => handleAmountClick(amount)}
            style={{padding:10,borderRadius:10,borderColor:"gray",borderWidth:1,marginHorizontal:8, backgroundColor: selectedAmount === amount ? '#E0D7FF' : 'transparent',borderColor:'#9B56FF'}}>
              <Text style={{color:'#212939'}}>+${amount}</Text>
            </TouchableOpacity>
          ))}
          
         </View>
         {isTipInputVisible && (
          <View>
            {/* TextInput for entering 'Other' amount */}
            <TextInput
              placeholder="Enter other amount"
              value={otherAmount}
              onChangeText={(text) => setOtherAmount(text)}
              placeholderTextColor={'grey'}
              style={{color:"black",fontSize:RFPercentage(1.8)}}
            />
            <Button title="Submit" onPress={handleTipTextAmount} />
          </View>
        )}
         {uniqueCartData.map((tip,index)=>(
          <View style={{top:15}}>
            <Text style={[GlobleStyle.CustomFont,{color:"black",fontSize:12}]}> Tip For Agent   ${tip.tipForAgent}</Text>
          </View>
         ))
 
         }
      </View>
 
        <View style={{ padding: 20, }}>
          <View style={{ borderWidth: 1, borderBlockColor: "#E3E7EF" }}></View>
        </View>
 
        {/* <TouchableOpacity onPress={() => navigation.navigate('SelectDataAndTime')}>
          <View style={{ marginHorizontal: 15, top: 20 }}>
            <View style={[styles.BillDetailsContentConteiner, { padding: 12, backgroundColor: '#F2F5F8', borderRadius: 10 }]}>
              <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "#50616E" }]}>Select Date and Time </Text>
              <Text style={{ fontSize: 22, fontWeight: "500", color: "black" }}>{'>'}</Text>
            </View>
          </View>
        </TouchableOpacity>
 
        <View style={{ padding: 20, top: 30 }}>
          <View style={{ borderWidth: 1, borderBlockColor: "#E3E7EF" }}></View>
        </View> */}
 
      
          {uniqueCartData.map((item,index)=>
           <View style={{ padding: 20 }}>
              <View>
              <Text style={[GlobleStyle.CustomFont, { fontSize: 17, color: "black" }]}>Bill Details</Text>
            </View>
  
            <View style={{ paddingVertical: 20 }}>
              <View style={styles.BillDetailsContentConteiner}>
                <Text style={[GlobleStyle.CustomFontText, { fontSize: 16, color: "#50616E" }]}>Subtotal</Text>
                <Text style={[GlobleStyle.CustomFontText, { fontSize: 16, color: "#50616E" }]}>${item.subTotal}</Text>
              </View>
  
              <View style={styles.BillDetailsContentConteiner}>
                <Text style={[GlobleStyle.CustomFontText, { fontSize: 16, color: "#50616E" }]}>Delivery fee </Text>
                <Text style={[GlobleStyle.CustomFontText, { fontSize: 16, color: "#50616E" }]}>${item.dileveryCharge}</Text>
              </View>
 
              <View style={styles.BillDetailsContentConteiner}>
                <Text style={[GlobleStyle.CustomFontText, { fontSize: 16, color: "#50616E" }]}>Servicecharge</Text>
                <Text style={[GlobleStyle.CustomFontText, { fontSize: 16, color: "#50616E" }]}>${item.servicecharge}</Text>
              </View>
 
              <View style={styles.BillDetailsContentConteiner}>
                <Text style={[GlobleStyle.CustomFontText, { fontSize: 16, color: "#50616E" }]}>TipForAgent</Text>
                <Text style={[GlobleStyle.CustomFontText, { fontSize: 16, color: "#50616E" }]}>${item.tipForAgent}</Text>
              </View>
              
              <View style={styles.BillDetailsContentConteiner}>
                <Text style={[GlobleStyle.CustomFontText, { fontSize: 16, color: "#50616E" }]}>Discount</Text>
                <Text style={[GlobleStyle.CustomFontText, { fontSize: 16, color: "#50616E" }]}>${item.discount}</Text>
              </View>
 
              <View style={styles.BillDetailsContentConteiner}>
                <Text style={[GlobleStyle.CustomFontText, { fontSize: 16, color: "#50616E" }]}>Taxes & Other Fees</Text>
                <Text style={[GlobleStyle.CustomFontText, { fontSize: 16, color: "#50616E" }]}>$0</Text>
              </View>
            </View>
  
            <View style={{ borderWidth: 1, borderBlockColor: "#E3E7EF" }}></View>
  
            <View style={styles.BillDetailsContentConteiner}>
              {
                
              }
              <Text style={[GlobleStyle.CustomFontText, { fontSize: 18, color: "#50616E" }]}>Total Amount </Text>
              <Text style={[GlobleStyle.CustomFont, { fontSize: 18, color: "black" }]}>${item.grandTotal}</Text>
            </View>
          </View>
          )}
        
 
        <View style={{ margin: 20, flexDirection: "row", alignItems: "center", }}>
          <View style={{ justifyContent: "center", alignItems: "center", height: 20, width: 20, flex: 1 }}>
            <Image source={require('../assets/images/mapLogo.png')} style={{ height: 40, width: 40, resizeMode: "contain" }} />
          </View>
 
          <View style={{ flex: 4 }}>
            {deliveryAdress ? (
              <Text style={[GlobleStyle.CustomFont, { fontSize: 15, color: "black" }]}>
                {deliveryAdress}{}
              </Text>
            ) : (
              <Text style={[GlobleStyle.CustomFont, { fontSize:15, color: "red" }]}>
                Select Delivery Address
              </Text>
            )}
          </View>
 
          <TouchableOpacity onPress={() => navigation.navigate('AddNewAdress')}>
            <View style={{ flexDirection: "row", flex: 3, alignItems: "center", justifyContent: "center" }}>
              <Text style={[GlobleStyle.CustomFont, { fontSize: 15, color: "#9B56FF" }]}>Change</Text>
            </View>
          </TouchableOpacity>
        </View>
 
       { deliveryAdress?(
          <TouchableOpacity style={{ marginBottom: 10, justifyContent: "center", alignItems: "center" }} onPress={() => navigation.navigate('Payment', { selectedAddressId ,newGrandTotal})}>
          <View style={{ width: '90%', height: 50, justifyContent: "center", alignItems: "center", backgroundColor: "#33FFC2", borderRadius: 10 }}>
            <Text style={[GlobleStyle.CustomFont, { fontSize: 20, color: 'black', left: 10 }]}>Proceed to pay</Text>
          </View>
      </TouchableOpacity>
       ):(
        <View></View>
       )
       
        }
      </ScrollView>
 
  </SafeAreaView>
  );
}
 
export default MyCart;
 
const styles = StyleSheet.create({
  BillDetailsContentConteiner: {
    justifyContent: 'space-between', flexDirection: "row", padding: 5
  },
  dottedBorder: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: '#E0D7FF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#9B56FF', // Border color
    borderStyle: 'dashed', // Dotted border style
  },
})