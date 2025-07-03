// PublicStack.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import { Login} from '../screens';
import BusOperator from '../components/BusOperator';

const Stack = createStackNavigator();

const PublicStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Travel"
      screenOptions={{
        headerShown: false,
        headerTransparent: true,
      }}>
      <Stack.Screen
        name="Travel"
        component={BusOperator}
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerStyle: {backgroundColor: 'lightblue'},
        }}
      />
      <Stack.Screen name="Login" component={Login} />

      {/* <Stack.Screen
        name="Alarm"
        component={AlarmScreen}
        options={{
          headerTransparent: false,
        }}
      /> */}
    </Stack.Navigator>
  );
};

export default PublicStack;
