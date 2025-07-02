// @ts-nocheck

import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
  Platform,
  Alert,
  View,
  Text,
  Button,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import Navigation from './src/navigation/Navigation';
import './src/lang/i18n';
import {getLang} from './src/helper/ChangeLang';
import strings from './src/lang/i18n.js';
import {getPreciseDistance} from 'geolib';
import notifee, {AndroidImportance, AuthorizationStatus} from '@notifee/react-native';
import {useAppSelector} from './src/Hooks/reduxHooks';
import {
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import {
  getAppToken,
  getOneTimeLocation,
} from './src/store/slices/locationSlice';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const [permissionsGranted, setPermissionsGranted] = useState(false);



  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'busalarm',
      name: 'Bus Alerts',
      sound: 'alarmsound',
      importance: AndroidImportance.HIGH,
      vibration: true,
    });
  };


  const requestNotificationPermission = async () => {
    try {
      const settings = await notifee.requestPermission();

      if (settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED) {
        console.log('Notification permission granted');
      } else {
        Alert.alert(
          'Permission Required',
          'Please enable notifications from settings.',
        );
      }
    } catch (err) {
      console.warn('Notification permission error:', err);
    }
  };

  const selectedLang = async () => {
    const langData = await getLang();
    if (langData) {
      strings.setLanguage(langData);
    }
  };

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      if (result === RESULTS.GRANTED) {
        setPermissionsGranted(true);
        dispatch(getOneTimeLocation());
      } else {
        setPermissionsGranted(false);
        Alert.alert('Location permission is required.');
      }
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionsGranted(true);
        dispatch(getOneTimeLocation());
      } else {
        setPermissionsGranted(false);
      }
    }
  };

  useEffect(() => {
    setTimeout(() => {
      requestLocationPermission();
    }, 1000);
  }, []);

  useEffect(() => {
    requestNotificationPermission();
    selectedLang();
    createNotificationChannel()
 
  }, []);

  if (!permissionsGranted) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#ffffff',
        }}>
        <Text style={{color: '#000', marginBottom: 10}}>
          Permission is required to use this app.
        </Text>
        <Button
          title="Open Settings"
          onPress={() => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          }}
        />
      </View>
    );
  }

  return <Navigation />;
};

export default App;
