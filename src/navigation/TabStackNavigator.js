import React from 'react';
import { View, Image, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../components/HomeScreen';
import Favorites from '../components/Favorites';
import MyOrders from '../components/MyOrders';
import Account from '../components/Account';
import AppStackNavigator from './AppStackNavigator';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { TxtResize } from '../AllComponents/TxtResize';
 
 
const Tab = createBottomTabNavigator();
 
const TabIcon = ({ focused, iconSource, label, isHomeScreen }) => {
  const imageTintColor = isHomeScreen ? null : (focused ? '#00DB99' : 'black');
  const textTintColor = isHomeScreen ? '#00DB99' : (focused ? '#00DB99' : '#00DB99');
  const backgroundColor = focused ? '#DFFFF5' : null; // Set background color when focused
  TxtResize
  return (
    // <View style={{  }}>
 
      <View
        style={{marginVertical:5,
          flexDirection: 'row',
          width:100,
          alignItems: 'center',justifyContent:'center',
          paddingHorizontal:10,paddingVertical:5,
         // Apply background color conditionally
         backgroundColor: backgroundColor,
          borderRadius: 15,
        }}
        >
        <Image
          source={iconSource}
          resizeMode='contain'
          style={{ height: 25, width: 25, tintColor: imageTintColor,  }}
          />
        
        {focused && (
          <Text
          style={{
            color: textTintColor,
            fontSize: RFPercentage(1.4),
            marginHorizontal:4,
            fontFamily: 'Poppins-SemiBold',
          }}
          >
            {label}
          </Text>
        )}
      </View>
   
        // </View>
  );
};
 
const TabStackNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { paddingHorizontal:10,height:70,backgroundColor:"white",borderTopLeftRadius:15,borderTopRightRadius:15} }}
    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconSource={require('../assets/images/VonzuuLogo.png')}
              label="Explore"
              isHomeScreen={true} // Pass isHomeScreen prop to indicate it's the HomeScreen tab
            />
          ),
          tabBarLabel: () => null, // Hide the default component name
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={Favorites}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconSource={require('../assets/images/Favorites.png')}
              label="Favorites"
            />
          ),
          tabBarLabel: () => null, // Hide the default component name
        }}
      />
      <Tab.Screen
        name="MyOrders"
        component={MyOrders}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconSource={require('../assets/images/MyOrder.png')}
              label="My Orders"
            />
          ),
          tabBarLabel: () => null, // Hide the default component name
        }}
      />
      <Tab.Screen
        name="Account"
        component={Account}
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              iconSource={require('../assets/images/Account.png')}
              label="Account"
            />
          ),
          tabBarLabel: () => null, // Hide the default component name
        }}
      />
      {/* <Tab.Screen name='AppStackNavigator' component={AppStackNavigator}/> */}
    </Tab.Navigator>
  );
};
 
export default TabStackNavigator;
 