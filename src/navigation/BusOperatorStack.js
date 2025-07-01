// BusOperatorStack.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CurrentRoutesScreen from '../screens/BusOperator/CurrentRoutesScreen';
import SetRouteScreen from '../screens/BusOperator/SetRouteScreen';

const Stack = createStackNavigator();

const BusOperatorStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
      }}>
      <Stack.Screen name="Home" component={CurrentRoutesScreen} />
      <Stack.Screen name="SetRoute" component={SetRouteScreen} />
      {/* No screens for now. You can add them later. */}
    </Stack.Navigator>
  );
};

export default BusOperatorStack;
