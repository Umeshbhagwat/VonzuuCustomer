import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import TabStackNavigator from './TabStackNavigator';
import AppStackNavigator from './AppStackNavigator';
import { useSelector } from "react-redux";
import SplashScreenIos from '../components/SplashScreenIos';
import AuthStack from './AuthStack';

const RootStack = createStackNavigator();

const RootNavigator = () => {
  const customerId = useSelector((state) => state.CustomerIdSlice.customerId);
  const [showSplash, setShowSplash] = useState(false); // Initialize to false

  useEffect(() => {
    setShowSplash(true); // Set to true when the timer is active

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash ? (
        <SplashScreenIos />
      ) : (
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {customerId ? (
            <RootStack.Screen name="AppStackNavigator" component={AppStackNavigator} />
          ) : (
            <RootStack.Screen name="AuthStack" component={AuthStack} />
          )}
        </RootStack.Navigator>
      )}
    </>
  );
}

export default RootNavigator;
