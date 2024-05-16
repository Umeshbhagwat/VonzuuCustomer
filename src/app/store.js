import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "../reduxtoolkit/counterSlice";
import localBrandsSlice from "../reduxtoolkit/localBrandsSlice";
import ProductDetailsSlice from '../reduxtoolkit/ProductDetailsSlice'
import VendorSliderSlice from "../reduxtoolkit/VendorSliderSlice";
import SearchDishesRestaSlice from '../reduxtoolkit/SearchDishesRestaSlice'
import CartSlice from "../reduxtoolkit/CartSlice";
import LatLongSlice from "../reduxtoolkit/LatLongSlice";
import CustomerIdSlice from "../reduxtoolkit/CustomerIdSlice";
import PandDlatLongSlice from "../reduxtoolkit/PandDlatLongSlice";
export const store = configureStore({
  reducer: {
    count:counterSlice,
    allLocal:localBrandsSlice,
    prductDetails:ProductDetailsSlice,
    vendorSlider:VendorSliderSlice,
    SerchDishesRestaurants:SearchDishesRestaSlice,
    CartData:CartSlice,
    LatlongSlices:LatLongSlice,
    CustomerIdSlice:CustomerIdSlice,
    PandDlatLongSlice:PandDlatLongSlice,
  },
});

export default store;