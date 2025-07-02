import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';


import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';



import {SafeAreaProvider} from 'react-native-safe-area-context';
import FlashMessage from 'react-native-flash-message';
import {useAppSelector} from '../Hooks/reduxHooks';
import BusOperatorStack from './BusOperatorStack';
import PublicStack from './PublicStack';
const Stack = createStackNavigator();

const Navigation = () => {
  const user = useAppSelector(state => state.user);
  return (
    <SafeAreaProvider>
      {/* {Platform.OS === 'android' && (
        <View style={{height: 50, backgroundColor: 'blue'}} />
      )} */}
      <SafeAreaView
        style={{
          flex: 1,
              paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,


          backgroundColor: '#fff',
        }}>
        <NavigationContainer>
          {user ? <BusOperatorStack /> : <PublicStack />}
        </NavigationContainer>
        <FlashMessage position="top" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Navigation;
