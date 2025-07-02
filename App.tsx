import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform, Alert, View, Text, Button, Linking} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import Navigation from './src/navigation/Navigation';
import {useTranslation} from './src/context/LanguageContext';
import Geolocation from '@react-native-community/geolocation';
import './src/lang/i18n';

import {getLang} from './src/helper/ChangeLang';
import strings from './src/lang/i18n.js';
import {getPreciseDistance} from 'geolib';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {RootState} from './src/store/reducers'; // Adjust according to your store structure
import {useAppSelector} from './src/Hooks/reduxHooks';
import {
  getAppToken,
  getOneTimeLocation,
  setSearching,
  updateLocationByNotification,
} from './src/store/slices/locationSlice';
import {LanguageContext} from './src/Context/LanguageContext';

const App: React.FC = () => {
  const dispatch = useDispatch();
    const [permissionsGranted, setPermissionsGranted] = useState(false);

  const userCurrent = useAppSelector(state => state.location.location);
  const language = useAppSelector(state => state.language.language);
  const createNotificationChannel = async () => {
    await notifee.createChannel({
      id: 'bus',
      name: 'Traveler App',
      sound: 'alarm',
      importance: AndroidImportance.HIGH,
    });
  };

  createNotificationChannel();

  const checkDistance = async (langitude: string, longitude: string) => {
    try {
      const userLocationStr = await AsyncStorage.getItem('UsersLocation');
      if (!userLocationStr) return;

      const userLocation = JSON.parse(userLocationStr);
      const targetLocation = {
        latitude: parseFloat(langitude),
        longitude: parseFloat(longitude),
      };

      const preciseDistance = getPreciseDistance(targetLocation, userLocation);
      const alarmValue = await AsyncStorage.getItem('AlarmDistance');
      const threshold = Number(alarmValue);
      const distanceInKm = preciseDistance / 1000;

      console.log(distanceInKm, 'Distance in KM');

      if (distanceInKm <= threshold) {
        await createNotificationChannel();
        await notifee.displayNotification({
          title: 'Bus Tracking',
          body: `The Bus Operator is ${distanceInKm.toFixed(2)} km away`,
          android: {
            channelId: 'bus',
            sound: 'alarm',
            pressAction: {
              id: 'default',
            },
          },
        });
      }
    } catch (error) {
      console.error('Error checking distance:', error);
    }
  };

  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message:
              'This app needs notification permission to show background service notifications',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Notification permission granted');
        } else {
          Alert.alert(
            'Notification permission denied',
            'Background tracking notification will not show.',
          );
        }
      } catch (err) {
        console.warn('Notification permission error', err);
      }
    } else {
      // For iOS or Android < 33, permission not required or handled differently
      console.log(
        'Notification permission not required for this platform/version',
      );
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
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
        dispatch(getOneTimeLocation());
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to access your location',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );

          console.log(granted)
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {


                      setPermissionsGranted(true);

            dispatch(getOneTimeLocation());
            
          } else {
                      setPermissionsGranted(false);

            
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };


  useEffect(()=>{

  setTimeout(()=>{
      requestLocationPermission();
  },1000)
  },[])
  useEffect(() => {
    requestNotificationPermission();
    selectedLang();
    requestUserPermission();

 
    dispatch(getAppToken());

    const unsubscribe = messaging().onMessage(async message => {
      console.log(message, 'Firebase Message Received');
      dispatch(setSearching(false));
      dispatch(
        updateLocationByNotification({
          latitude: message.data.langitude,
          longitude: message.data.longitude,
          locationTime: message.data.updatedTime,
        }),
      );
      await checkDistance(message.data.langitude, message.data.longitude);
    });

    return unsubscribe;
  }, []);


    if (!permissionsGranted) {
    // Prevent app usage here by showing a message or blank screen
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor:"#ffffff",
        }}
      >
        <Text style={{color:"#000",marginBottom:10}}>Permission is required to use this app.</Text>
     <Button
  title="Settings"
  onPress={() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings(); // For Android
    }
  }}
/>
      </View>
    );
  }


  return <Navigation />;
};

export default App;
