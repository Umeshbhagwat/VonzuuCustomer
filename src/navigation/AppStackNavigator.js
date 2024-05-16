import { createStackNavigator } from '@react-navigation/stack';
import ProductDetail from '../components/ProductDetail';
import SearchProductInVendor from '../components/SearchProductInVendor';
import EditProfile from '../components/EditProfile';
import TabStackNavigator from './TabStackNavigator';
import HomeScreen from '../components/HomeScreen';
import Payment from '../components/Payment';
import MyCart from '../components/MyCart';
import ManageAddress from '../components/ManageAddress';
import SearchAddress from '../components/SearchAddress';
import AddNewAdress from '../components/AddNewAdress';
import SelectDataAndTime from '../components/SelectDataAndTime';
import VonzuuWallet from '../components/VonzuuWallet'
import Coupon from '../components/Coupon';
import TrackOrder from '../components/TrackOrder';
import OrderDetail from '../components/OrderDetail';
import SearchLocation from '../components/SearchLocation';
import SearchDishesRestaurant from '../components/SearchDishesRestaurant';
import WelcomeScreen from '../components/WelcomeScreen';
import Signup from '../components/Signup';
import VerifyPhone from '../components/VerifyPhone';
import Groceries from '../components/Category/Groceries';
import Pharmacy from '../components/Category/Pharmacy';
import Pets from '../components/Category/Pets';
import Jewelry from '../components/Category/Jewelry';
import Restaurants from '../components/Category/Restaurants';
import OrderPlacedSuccessfully from '../components/OrderPlacedSuccessfully';
import HelpAndSupport from '../components/HelpAndSupport';
import Courier from '../components/Category/Courier';
import PickAndDrop from '../components/Category/PickAndDrop';
import SearchLocationPandD from '../components/PickAndDropScreen/SearchLocationPandD';
import RepetatOrder from '../components/RepetatOrder';
import Pickup from '../components/PickAndDropScreen/Pickup';
import ConfirmPickUp from '../components/PickAndDropScreen/ConfirmPickUp';
const Stack = createStackNavigator();

function AppStackNavigator() {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, }}>
      {/* <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name='Signup' component={Signup} />
      <Stack.Screen name='VerifyPhone' component={VerifyPhone} />
      <Stack.Screen name="TabStackNavigator" component={TabStackNavigator} /> */}
      <Stack.Screen name="TabStackNavigator" component={TabStackNavigator} />
      <Stack.Screen name='HomeScreen' component={HomeScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="SearchProductInVendor" component={SearchProductInVendor} />
      <Stack.Screen name='EditProfile' component={EditProfile} />
      <Stack.Screen name='Payment' component={Payment} />
      <Stack.Screen name='MyCart' component={MyCart} />
      <Stack.Screen name='ManageAddress' component={ManageAddress} />
      <Stack.Screen name='SearchAddress' component={SearchAddress} />
      <Stack.Screen name='AddNewAdress' component={AddNewAdress} />
      <Stack.Screen name='SelectDataAndTime' component={SelectDataAndTime} />
      <Stack.Screen name='VonzuuWallet' component={VonzuuWallet} />
      <Stack.Screen name='Coupon' component={Coupon} />
      <Stack.Screen name='TrackOrder' component={TrackOrder} />
      <Stack.Screen name='OrderDetail' component={OrderDetail} />
      <Stack.Screen name='SearchLocation' component={SearchLocation} />
      <Stack.Screen name='SearchDishesRestaurant' component={SearchDishesRestaurant} />
      <Stack.Screen name='Restaurants' component={Restaurants} />
      <Stack.Screen name='Groceries' component={Groceries} />
      <Stack.Screen name='Pharmacy' component={Pharmacy} />
      <Stack.Screen name='Pets' component={Pets} />
      <Stack.Screen name='Jewelry' component={Jewelry} />
      <Stack.Screen name='PickAndDrop' component={PickAndDrop} />
      <Stack.Screen name='OrderPlacedSuccessfully' component={OrderPlacedSuccessfully} />
      <Stack.Screen name='HelpAndSupport' component={HelpAndSupport} />
      <Stack.Screen name='Courier' component={Courier} />
      <Stack.Screen name='SearchLocationPandD' component={SearchLocationPandD} />
      <Stack.Screen name='RepetatOrder' component={RepetatOrder} />
      <Stack.Screen name='Pickup' component={Pickup} />
      <Stack.Screen name='ConfirmPickUp' component={ConfirmPickUp} />
    </Stack.Navigator>
  );
}

export default AppStackNavigator;