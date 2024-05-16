import React from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../components/WelcomeScreen';
import Signup from '../components/Signup';
import VerifyPhone from '../components/VerifyPhone';
import TabStackNavigator from './TabStackNavigator';
import ForgotPassword from '../components/ForgotPassword';
import AppStackNavigator from './AppStackNavigator';

const Auth= createStackNavigator();

const AuthStack = () => {
  return (
<Auth.Navigator  screenOptions={{ headerShown: false,}}>
      <Auth.Screen name="WelcomeScreen" component={WelcomeScreen} />
       <Auth.Screen name="Signup" component={Signup} />
       <Auth.Screen name='ForgotPassword' component={ForgotPassword} />
       <Auth.Screen name="VerifyPhone" component={VerifyPhone} />
       <Auth.Screen name="AppStackNavigator" component={AppStackNavigator} />
       {/* <Auth.Screen name="TabStackNavigator" component={TabStackNavigator} /> */}

  </Auth.Navigator>
  );
}

export default AuthStack;
