// import React, { useEffect, useState } from 'react';
// import { View, Text, StatusBar, StyleSheet, ToastAndroid } from 'react-native';
// import { Provider } from 'react-redux';
// import { NavigationContainer } from '@react-navigation/native';
// import messaging from '@react-native-firebase/messaging';
// import Notifee, { AndroidImportance } from '@notifee/react-native'; // Import Notifee
// import Home from './src/components/Home';
// import { store } from './src/app/store';
// import SplashScreen from 'react-native-splash-screen';
// import { useNetInfo } from '@react-native-community/netinfo';
// import RootNavigator from './src/navigation/RootNavigator';
// import ConnectionError from './src/components/EmptyScreenComponents/ConnectionError';
// import NotificationModal from './../Vonzuu-Customer-App/src/components/Notification/NotificationModal';
// import Toast  from 'react-native-toast-message';
// import { StripeProvider } from '@stripe/stripe-react-native';
// // import { //from 'react-native-toast-message';
 
// const App = () => {
//   const netInfo = useNetInfo();
//   const [deviceToken, setDeviceToken] = useState('');
//   const [notification, setNotification] = useState(null);
 
//   const createNotificationChannel = async () => {
//     const channelId = await Notifee.createChannel({
//       id: 'your_channel_id', // Replace with your desired channel ID
//       name: 'Your Channel Name', // Replace with your desired channel name
//       importance: AndroidImportance.DEFAULT, // Adjust importance as needed
//     });
 
//     return channelId;
//   };
 
//   useEffect(() => {
//     setTimeout(() => {
//       SplashScreen.hide();
//     }, 3000);
 
//     // Create the notification channel and get the channel ID
//     createNotificationChannel().then((channelId) => {
//       console.log('Notification channel ID:', channelId);
//     });
//   }, []);
 
//   useEffect(() => {
//     requestPermission();
 
//     const unsubscribe = messaging().onMessage(async (remoteMessage) => {
//       const { title, body } = remoteMessage.notification;
//       const imageUrl = remoteMessage.notification?.android?.imageUrl; // Adjust for your specific notification payload structure
//       console.log(`This is a ${title} and this is a ${body}`);
      
//       const notificationStyles = {
//         title: {
//           color: 'red', // Example: Apply red color to the title
//           // other styles as needed
//         },
//         body: {
//           fontSize: 18, // Example: Set the font size of the body
//           // other styles as needed
//         },
//       };
 
//       setNotification({ title, body, imageUrl });
 
//       // Display the notification using Notifee
//       Notifee.displayNotification({
//         title,
//         body,
//         android: {
//           imageUrl,
//           channelId: 'your_channel_id', // Replace with your channel ID
//          style: notificationStyles,
//         },
//      });
//     });
 
//     return unsubscribe;
//   }, []);
 
//   const requestPermission = async () => {
//     // Request permission for notifications
//     await Notifee.requestPermission();
 
//     const fcmToken = await messaging().getToken();
//     if (fcmToken) {
//       setDeviceToken(fcmToken);
//       console.log('FCM Device Token:', fcmToken);
//     } else {
//       console.log('Failed to get FCM device token');
//     }
//   };
 
//   const closeModal = () => {
//     setNotification(null);
//   };
 
//   // const stripePromise = loadStripe('pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3');
//   return (
//       <StripeProvider publishableKey='pk_test_ivQgK41oGKvTXLdzii7tVBYq00HXCdLGZy'>
//     <Provider store={store}>
 
//       <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
//       <NavigationContainer>
//         {netInfo.isConnected ? <RootNavigator /> : <ConnectionError />}
//       </NavigationContainer>
//   <Toast/>
//       { <NotificationModal
//         title={notification?.title}
//         body={notification?.body}
//         image={notification?.imageUrl}
//         visible={!!notification}
//         onClose={closeModal}
//       /> }
 
//     </Provider>
//       </StripeProvider>
//   );
// };
 
// export default App;


import React, { useEffect } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from './src/app/store';
import SplashScreen from 'react-native-splash-screen';
import { useNetInfo } from '@react-native-community/netinfo';
import RootNavigator from './src/navigation/RootNavigator';
import ConnectionError from './src/components/EmptyScreenComponents/ConnectionError';
import Toast from 'react-native-toast-message';
import { StripeProvider } from '@stripe/stripe-react-native';
import SplashScreenIos from './src/components/SplashScreenIos';
import { TxtResize } from './src/AllComponents/TxtResize';

const App = () => {
  const netInfo = useNetInfo();
  TxtResize
  return (
    <>
     <StripeProvider publishableKey='pk_test_ivQgK41oGKvTXLdzii7tVBYq00HXCdLGZy'>
       <Provider store={store}>
        <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
        <NavigationContainer>
          {/* <RootNavigator/> */}
          {/* <ConnectionError/> */}
          {netInfo.isConnected ? <RootNavigator /> : <ConnectionError />}
        </NavigationContainer>
        <Toast />
       </Provider> 
     </StripeProvider>
</>
  );
};

export default App;


