import 'react-native-gesture-handler';
import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Platform,
  ScrollView,
  Image,
  Linking,
  Dimensions,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import {FC} from 'react';

import BackgroundService from 'react-native-background-actions';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Geolocation from '@react-native-community/geolocation';

// import Maps from './Maps';
import axios from 'axios';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';

import {getRegionForCoordinates} from '../helper/ChangeLang';

import {useAppDispatch, useAppSelector} from '../Hooks/reduxHooks';
import {
  ArrowRightLeft,
  Bus,
  BusFront,
  Clock,
  Search,
  User,
  X,
} from 'lucide-react-native';

import {useNavigation} from '@react-navigation/native';
import LanguageSelect from './LanguageSelect';
import {getUniqueId} from 'react-native-device-info';
import {showMessage} from 'react-native-flash-message';

import {getPreciseDistance} from 'geolib';
import notifee from '@notifee/react-native';
import {useTranslation} from 'react-i18next';
const window = Dimensions.get('window');
const {width, height} = window;

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));

const BusOperator = () => {
  const {t, i18n} = useTranslation();

  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [intervalSeconds, setIntervalSeconds] = useState(15);
  const [userLocation, setUserLocation] = useState(null);
  const userCurrent = useAppSelector(state => state.location.location);
  const appToken = useAppSelector(state => state.location.apptoken);
  const search = useAppSelector(state => state.location.search);
  const [data2, setData2] = useState(null);
  const [serverData, setServerData] = useState([]);
  const [text, setText] = useState('');
const alarmStarted = useRef(false);


  const [input, setInput] = useState('');
  const [opo, setOpo] = useState(null);

  const [banners, setBanners] = useState([]);

  const [alaram, setAlaram] = useState('');

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [visible, setVisible] = React.useState(false);

  const getOfflineData = async () => {
    const getData = await AsyncStorage.getItem('Offline');

    if (getData) {
      let refinedData = JSON.parse(getData);
      setInput(refinedData.input);
      setBanners(refinedData.banners);
      setData2(refinedData);

      fetchIntervalAndStartService();
    }
  };

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('AlarmDistance', value);
    } catch (e) {
      // saving error
    }
  };

  useEffect(() => {
    getUserLocation();
    // getOfflineData();
    return () => {
      BackgroundService.stop();
    
    };
  }, []);

  const getUserLocation = () => {
    Geolocation.getCurrentPosition(
      async pos => {
        const {latitude, longitude} = pos.coords;

        setUserLocation(pos.coords);
      },
      error => {
        console.log('Location error:', error.message);
      },
      {enableHighAccuracy: false,    timeout: 5000,
            maximumAge: 15000,},
    );
  };

  const checkDistance = (userLocation, busLocation, alarmDistance) => {
    console.log('Testting', alarmDistance,alarmStarted);
    if (alarmStarted.current) {
      return;
    }
    if (!alarmDistance || !busLocation || !userLocation) {
      showMessage({
        message: 'Missing data',
        description:
          'User location, bus location, or alarm distance is not available.',
        type: 'danger',
      });
      return;
    }
    try {
      const preciseDistance = getPreciseDistance(busLocation, userLocation);
      const distanceInKm = preciseDistance / 1000;

      console.log(distanceInKm,"distanceInKmdistanceInKmdistanceInKm")

      if (distanceInKm <= parseFloat(alarmDistance)) {
        console.log(distanceInKm, 'Distance in KM', alarmDistance);

            alarmStarted.current = true;
        notifee.displayNotification({
          title: 'Bus Tracking',
          body: `The Bus Operator is ${distanceInKm.toFixed(2)} km away`,
          android: {
            channelId: 'busalarm',
            sound: 'alarmsound',
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

  const getUpdatedLocation = async () => {
    try {
      const appToken = await getUniqueId();

      // First request: start tracking
      const response = await axios.post(
        'http://bojanalic-001-site1.ntempurl.com/clients/startTracking',
        {
          routeToken: input,
          appToken: appToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      if (response?.data?.token) {
        const token = response.data.token;

        // Second request: get location
        const locationResponse = await axios.get(
          `http://bojanalic-001-site1.ntempurl.com/clients/getLocationUsingCode/${token}/${appToken}`,
          {
            headers: {
              Accept: 'application/json',
            },
          },
        );

        console.log('Updated Location', locationResponse);

        if (locationResponse?.data?.length > 0) {
          setData2(locationResponse.data[0]);
          let busloc = {
            latitude: parseFloat(locationResponse.data[0]?.latitude),
            longitude: parseFloat(locationResponse.data[0]?.longitude),
          };

          const alarmValue = await AsyncStorage.getItem('AlarmDistance');

          if (alarmValue?.length) {
            checkDistance(userLocation, busloc, alarmValue);
          }
          setBanners(locationResponse.data[0]?.banners || []);

          AsyncStorage.setItem(
            'Offline',
            JSON.stringify({
              ...locationResponse.data[0],
              input: input,
            }),
          );
        } else {
        }
      } else {
        showMessage({
          message: 'Invalid token received',
          description: 'Please try again with a valid route token.',
          type: 'danger',
        });
      }
    } catch (error) {
      console.error('Error in aa:', error);

   

      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'An unexpected error occurred';

      showMessage({
        message: 'Error',
        description: errorMsg,
        type: 'danger',
      });
    }
  };

  const fetchIntervalAndStartService = async () => {
    try {
      const seconds = 15;
      setIntervalSeconds(seconds);
      startLocationService(seconds);
    } catch (err) {}
  };

  const startLocationService = async interval => {
    const options = {
      taskName: 'LocationUpdateClient',
      taskTitle: 'Bus tracking active',
      taskDesc: 'getting current bus location',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#3b82f6',
      parameters: {
        delay: 15000,
      },
    };

    const veryPreciseTask = async taskData => {
      const {delay} = taskData;
      while (BackgroundService.isRunning()) {
        await getUpdatedLocation();
        await sleep(delay);
      }
    };

    await BackgroundService.start(veryPreciseTask, options);
    const running = await BackgroundService.isRunning();
  };

  const getPassengerToken = async () => {
    // Input validation
    if (input.trim() === '') {
      showMessage({
        message: 'Invalid route token',
        description: 'Please enter a valid route token.',
        type: 'danger',
      });
      return;
    }

    Keyboard.dismiss();

    try {


      const appToken = await getUniqueId();

      // First request: start tracking
      const response = await axios.post(
        'http://bojanalic-001-site1.ntempurl.com/clients/startTracking',
        {
          routeToken: input,
          appToken: appToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      if (response?.data?.token) {

          alarmStarted.current= false
        AsyncStorage.removeItem('Offline');
        const token = response.data.token;

        // Second request: get location
        const locationResponse = await axios.get(
          `http://bojanalic-001-site1.ntempurl.com/clients/getLocationUsingCode/${token}/${appToken}`,
          {
            headers: {
              Accept: 'application/json',
            },
          },
        );

        console.log(
          locationResponse?.data,
          'locationResponse?.data?locationResponse?.data?',
        );
        if (locationResponse?.data?.length > 0) {
          setData2(locationResponse.data[0]);
          setBanners(locationResponse.data[0]?.banners || []);

          AsyncStorage.setItem(
            'Offline',
            JSON.stringify({
              ...locationResponse.data[0],
              input: input,
            }),
          );
          showMessage({
            message: 'Success',
            description: 'Tracking started successfully.',
            type: 'success',
          });
          setTimeout(() => {
            fetchIntervalAndStartService();
          }, 5000);
        } else {
          showMessage({
            message: 'No location data found',
            type: 'warning',
          });
        }
      } else {
        showMessage({
          message: 'Invalid token received',
          description: 'Please try again with a valid route token.',
          type: 'danger',
        });
      }
    } catch (error) {
      // console.error('Error in getPassengerToken:', error);
  alarmStarted.current= false
         setData2(null)
BackgroundService.stop();
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'An unexpected error occurred';

      showMessage({
        message: 'Error',
        description: errorMsg,
        type: 'danger',
      });
    }
  };
  //for Alarm
  const getAlarm = async () => {
    const alarmValue = await AsyncStorage.getItem('AlarmDistance');

    if (alarmValue) {
      setAlaram(alarmValue);
    }
  };

  useEffect(() => {
    getAlarm();
  }, []);
  const removeItemValue = async key => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (exception) {
      return false;
    }
  };
  const setAlarmTime = () => {
    if (alaram.length === 0) {
      Alert.alert('Please insert some value');
    } else {
      storeData(alaram).then(() => {
        setVisible(false);
      });
    }
  };
  const fixTime = item => {
    const date = new Date(item);
    const formatted = date.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });

    return formatted;
  };

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <View
        style={{
          // marginHorizontal: 10,
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          marginTop: 10,
          padding: 10,
          borderBottomWidth: 1,
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            backgroundColor: '#4A90E2',

            borderRadius: 5,
            shadowColor: '#000',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 3,
          }}>
          <Text style={{fontSize: 16, color: '#fff', fontWeight: '600'}}>
            {t('LOGIN_BTN')}
          </Text>
        </TouchableOpacity>

        <LanguageSelect
          onPress={() => {
            Alert.alert(
              'Bus Tracking App',
              'Warning all the data related to the operator will be lost',
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: () => {
                    BackgroundService.stop()
                    setAlaram(0);
                    alarmStarted.current= false
                    AsyncStorage.removeItem('AlarmDistance');
                    setData2(null);
                    setInput('');
                    setBanners('');
                  },
                },
              ],
              {cancelable: false},
            );
          }}
        />
      </View>

      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps={true}>
        <View
          style={{
            paddingTop: '3%',
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginTop: 20,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.32,
              shadowRadius: 5.46,

              paddingHorizontal: 10,
              elevation: 9,
            }}>
            <View style={styles.icon}>
              <BusFront color={'#FFFFFF'} />
            </View>
            <TextInput
              style={styles.InputStyle}
              value={input}
              onChangeText={text => setInput(text)}
              placeholder={t('ENTER_CODE')}
              placeholderTextColor="grey"
            />
          </View>
        </View>

        <>
          <View
            style={{
              marginHorizontal: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',

                marginHorizontal: 10,
                marginTop: 20,
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={getPassengerToken}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#4A90E2',
                  padding: 15,
                  borderRadius: 5,
                  alignSelf: 'flex-start',
                  width: 100,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.32,
                  shadowRadius: 5.46,

                  elevation: 9,
                }}>
                <Text style={{color: '#FFF', fontWeight: '600'}}>
                  {t('SEARCH_BTN')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setVisible(true);
                }}
                style={{
                  // right: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'red',
                  padding: 15,
                  borderRadius: 5,
                  width: 100,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.32,
                  shadowRadius: 5.46,

                  elevation: 9,
                }}>
                <Text style={{color: '#FFF', fontWeight: '600'}}>
                  {t('ALARM_BTN')}
                </Text>
              </TouchableOpacity>
            </View>
            {data2 ? (
              <Text style={{marginTop: 5, fontSize: 12, color: '#000'}}>
                {t('LAST_DATA_RECEIVED')} {fixTime(data2?.locationTime)}
              </Text>
            ) : null}
          </View>
          {banners[10] ? (
            <TouchableOpacity
              style={styles.BannerShadow}
              onPress={() => {
                Linking.openURL(`https://${banners[1].actionUrl}`);
              }}>
              <Image
                source={{uri: banners[1] ? banners[1].imageLink : null}}
                style={{height: '100%', width: '100%', borderRadius: 5}}
              />
              {/* <Text style={{ color: 'black', fontWeight: 'bold' }}>
              {strings.BANNER_DN}
            </Text> */}
            </TouchableOpacity>
          ) : null}
          <View style={styles.container}>
            {data2 ? (
              <MapView
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={{
                  latitude: parseFloat(data2.latitude),
                  longitude: parseFloat(data2.longitude),
                  // latitudeDelta: parseFloat(data2.latitude),
                  // longitudeDelta: parseFloat(data2.longitude),
                  // latitude: 37.78825,
                  // longitude: -122.4324,
                  latitudeDelta: Math.abs(0.1),
                  longitudeDelta: Math.abs(0.1),
                }}>
                <Marker
                  coordinate={{
                    latitude: parseFloat(data2.latitude),
                    longitude: parseFloat(data2.longitude),
                  }}
                />
              </MapView>
            ) : null}

            <Modal
              animationType="fade"
              transparent={true}
              backdropColor={'black'}
              backdropOpacity={1}
              style={{
                width: '100%',
                marginHorizontal: 10,
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',

                // flex: 1,
              }}
              visible={visible}>
              <View style={styles.modal}>
                <View
                  style={{
                    backgroundColor: '#FFFFFF',
                    // width: 400,
                    height: 300,
                    borderRadius: 5,
                    borderWidth: 5,
                    borderColor: 'grey',
                    // justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginHorizontal: 10,
                      marginVertical: 10,
                    }}>
                    <View />
                    <View style={styles.icon2}>
                      <X
                        color={'white'}
                        onPress={() => {
                          setVisible(false);
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginTop: 20,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 4,
                      },
                      shadowOpacity: 0.32,
                      shadowRadius: 5.46,
                      marginHorizontal: 10,

                      // paddingHorizontal: 10,
                      elevation: 9,
                    }}>
                    <View style={styles.icon}>
                      <Clock color={'white'} />
                    </View>
                    <TextInput
                      style={styles.InputStyle}
                      value={alaram}
                      keyboardType="numeric"
                      onChangeText={text =>
                        setAlaram(text.replace(/[^0-9]/g, ''))
                      }
                      placeholder={t('Please set Alarm')}
                      placeholderTextColor="grey"
                    />
                  </View>
                  <TouchableOpacity
                    onPress={setAlarmTime}
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'blue',
                      width: 100,

                      alignSelf: 'center',
                      height: 50,
                      borderRadius: 5,
                      marginHorizontal: 10,
                      marginVertical: 20,
                    }}>
                    <Text style={{fontSize: 16, color: 'white'}}>Set</Text>
                  </TouchableOpacity>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontWeight: 'bold',
                      fontSize: 18,
                      color: '#000',
                      marginHorizontal: 10,
                    }}>
                    {t('The alarm will raise when bus is under')}{' '}
                    {alaram.length ? alaram : 0} km from phone your location.
                  </Text>
                </View>
              </View>
            </Modal>
          </View>
        </>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    // paddingTop: '30%',
    paddingHorizontal: 10,
    // marginHorizontal: 60,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 10,
    zIndex: 1,
  },
  modal: {
    width: '90%',
    height: 300,
    // marginHorizontal: 15,
    // backgroundColor: 'yellow',
    alignSelf: 'center',
    justifyContent: 'center',
    flex: 1,
    // flex: 1,
  },
  BannerShadow: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    marginVertical: 10,
    height: 50,
    // marginTop: 5,
    // padding: 15,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    zIndex: 1,
    elevation: 9,
  },
  BannerShadowUp: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  InputStyle: {
    color: '#000',
    backgroundColor: 'white',
    width: '90%',
    height: 49,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingLeft: 10,
    borderWidth: 0.5,
  },
  icon: {
    backgroundColor: 'grey',
    height: 50,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    borderWidth: 0.5,
  },
  icon2: {
    backgroundColor: 'grey',
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    borderWidth: 0.5,
  },
  container: {
    // ...StyleSheet.absoluteFillObject,

    height: 300,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },

  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 5,
    margin: 10,
    height: 400,
  },
});

export default BusOperator;
