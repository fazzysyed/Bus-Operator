/**
 * @format
 */
import {AppRegistry, Alert} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {Provider} from 'react-redux';

import React from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {getPreciseDistance} from 'geolib';
import Geolocation from '@react-native-community/geolocation';
import notifee, {AndroidImportance} from '@notifee/react-native';
import store from './src/store';
import {LanguageContext} from './src/Context/LanguageContext';

const createNotificationChannel = async () => {
  await notifee.createChannel({
    id: 'bus',
    name: 'Traveler App',
    sound: 'alarm',
    importance: AndroidImportance.HIGH,
  });
};

messaging().onNotificationOpenedApp(remoteMessage => {
  console.log('FIREBASE IOS Background', remoteMessage);
});

messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    console.log(remoteMessage, 'Initial');
  });

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await createNotificationChannel();
  checkDistance(remoteMessage.data.langitude, remoteMessage.data.longitude);
});

const checkDistance = async (langitude, longitude) => {
  const UsersLocation = await AsyncStorage.getItem('UsersLocation');
  const userL = JSON.parse(UsersLocation);

  const opL = {
    latitude: parseFloat(langitude),
    longitude: parseFloat(longitude),
  };

  const pdis = getPreciseDistance(opL, userL);
  const alaram = await AsyncStorage.getItem('AlarmDistance');

  const opDistance = pdis / 1000;
  const newAlarm = Number(alaram);

  if (opDistance <= newAlarm) {
    await notifee.displayNotification({
      title: 'Bus Tracking',
      body: `The Bus Operator is ${opDistance.toFixed(2)} km away`,
      android: {
        channelId: 'bus',
        sound: 'alarm',
        pressAction: {
          id: 'default',
        },
      },
    });
  }
};

function HeadlessCheck({isHeadless}) {
  if (isHeadless) {
    return <Root />;
  }

  return <Root />;
}

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => HeadlessCheck);
