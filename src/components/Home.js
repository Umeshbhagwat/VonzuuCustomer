import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { decrement, increment } from '../reduxtoolkit/counterSlice';

const Home = () => {

    const count=useSelector((c)=>c.count.value)
    const dispatch=useDispatch();
  
  return (
    <View style={{flex:1}}>
        <TouchableOpacity onPress={()=>dispatch(increment())}>
            <View style={{top:50,alignItems:"center"}}>
                <Text>Increment</Text>
            </View>
        </TouchableOpacity>
     
        <TouchableOpacity onPress={()=>dispatch(decrement())}>
            <View style={{top:100,alignItems:"center"}}>
                <Text>Decrement</Text>
            </View>
        </TouchableOpacity>

        <View>
            <Text>{count}</Text>
        </View>
    </View>
  );
}

export default Home;
