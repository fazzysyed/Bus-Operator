import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
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
} from 'react-native';
import {FC} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Dropdown} from 'react-native-element-dropdown';

import _, {set} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '../lang/i18n.js';
import Button from './Button';
import SearchableDropdown from 'react-native-searchable-dropdown';

// import Maps from './Maps';
import axios from 'axios';

import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {getDistance, getPreciseDistance} from 'geolib';

import {getRegionForCoordinates} from '../helper/ChangeLang';

import {useAppDispatch, useAppSelector} from '../Hooks/reduxHooks';
import {
  ArrowRightLeft,
  BusFront,
  Clock,
  Search,
  User,
  X,
} from 'lucide-react-native';
import {
  clearLocation,
  setSearching,
  updateLocation,
} from '../store/slices/locationSlice';
import {useNavigation} from '@react-navigation/native';
import LanguageSelect from './LanguageSelect';
const window = Dimensions.get('window');
const {width, height} = window;

const centroid = {
  latitude: '24.2472',
  longitude: '89.920914',
};
const boundingBox = {
  southWest: {
    latitude: '24.234631',
    longitude: '89.907127',
  },
  northEast: {
    latitude: '24.259769',
    longitude: '89.934692',
  },
};

const BusOperator = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const userCurrent = useAppSelector(state => state.location.location);
  const appToken = useAppSelector(state => state.location.apptoken);
  const search = useAppSelector(state => state.location.search);
  const data2 = useAppSelector(state => state.location.updatedLocation);
  const [serverData, setServerData] = useState([]);
  const [text, setText] = useState('');

  const [input, setInput] = useState('');
  const [opo, setOpo] = useState(null);
  const [traverls, setSTravelers] = useState([
    {label: 'Munich', value: 'munich'},
    {label: 'Linz', value: 'linz'},
    {label: 'Wina', value: 'wina'},
  ]);
  const [banners, setBanners] = useState([]);
  const [open1, setOpen2] = useState(false);
  const [alaram, setAlaram] = useState('');
  const [value2, setValue2] = useState(null);
  const [route, setRoute] = useState([]);
  const [open, setOpen] = useState(false);
  const [value1, setValue] = useState('');
  const [items, setItems] = useState([
    {label: 'Travelers', value: '1'},
    {label: 'Passengers', value: '2'},
  ]);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [visible, setVisible] = React.useState(false);

  // dispatch(updateAppToken());

  const getDeltaLat = () => {
    const {width, height} = Dimensions.get('window');
    const ASPECT_RATIO = width / height;

    const northeastLat = parseFloat(boundingBox.northEast.latitude);
    const southwestLat = parseFloat(boundingBox.southWest.latitude);
    const latDelta = northeastLat - southwestLat;

    return latDelta;
  };

  const storeData = async value => {
    try {
      await AsyncStorage.setItem('AlarmDistance', value);
    } catch (e) {
      // saving error
    }
  };

  const CheckRecent = async () => {
    const operatorName = await AsyncStorage.getItem('RecentSearchedOperator');
    const routes = await AsyncStorage.getItem('RecentSearchedRoute');
    const pessenger = await AsyncStorage.getItem('RecentSearhedPessenger');
    const operatorId = await AsyncStorage.getItem('RecentSearhedOperatorId');
    console.log(operatorName, routes, pessenger, operatorId, 'Recent');

    if (
      operatorName != null &&
      routes != null &&
      pessenger != null &&
      operatorId != null
    ) {
      console.log(operatorName, routes, pessenger, operatorId, 'Recent');
      getOperatorById(Number(operatorId));
      setValue2(Number(routes));
      setText(operatorName);
      setInput(pessenger);
      var data = {
        passengerName: pessenger,
        operatorId: operatorId,
        routeItemId: routes,
        appToken: appToken,
      };
      console.log(data);
      dispatch(updateLocation(data));
    }
  };

  useEffect(() => {
    CheckRecent();
  }, []);

  // useEffect(() => {
  //   if (text.length >= 3) {
  //     fetch(
  //       `http://bojanalic-001-site1.ntempurl.com/clients/getOperators/${text}`,
  //       {
  //         method: 'GET',
  //       },
  //     )
  //       .then(response => response.json())
  //       .then(responseJson => {
  //         console.log(responseJson);
  //         if (responseJson.length > 1) {
  //           setServerData(responseJson);
  //         }
  //       })
  //       .catch(error => {
  //         console.error(error);
  //       });
  //   }
  //   if (text === '') {
  //     setServerData([]);
  //   }
  // }, [text]);

  const getOperatorById = id => {
    var config = {
      method: 'get',
      url: `http://bojanalic-001-site1.ntempurl.com/clients/getOperator/${id}`,
      headers: {},
    };

    axios(config)
      .then(response => {
        let arrayNew = [];
        console.log(response.data, 'falfksjaslkfjalksfjalskfjalksjf');
        setBanners(response.data.banners);
        let newData = {
          data: response.data,
          id: id,
        };
        console.log(newData);
        setOpo(newData);

        for (let item of response.data.routes) {
          arrayNew.push({
            label: item.name,
            value: item.id,
          });
        }
        setRoute(arrayNew);
      })
      .catch(function (error) {
        console.log(error.response);
      });
  };

  const getPassengerToken = () => {
    AsyncStorage.setItem('RecentSearhedPessenger', input);
    AsyncStorage.setItem('RecentSearhedOperatorId', opo.id.toString());
    AsyncStorage.setItem('RecentSearchedRoute', value2.toString());

    console.log('getPassengerToken');

    // if (value1.length && value2.length && input.length) {
    var data = {
      passengerName: input,
      operatorId: opo.id,
      routeItemId: value2,
      appToken: appToken,
    };
    console.log(JSON.stringify(data));
    dispatch(updateLocation(data));
    dispatch(setSearching(true));
    // setSearch(true);
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
    if (item) {
      let srg = item.split('T');
      console.log('Date', srg);

      return item;
    } else return item;
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
            {strings.LOGIN_BTN}
          </Text>
        </TouchableOpacity>

        <LanguageSelect
          onPress={async () => {
            console.log('Pressed');
            let data = await AsyncStorage.getItem('LocationStuff');

            console.log(data);

            if (data != null) {
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
                      dispatch(clearLocation());

                      removeItemValue('RecentSearchedOperator');
                      removeItemValue('RecentSearchedRoute');
                      removeItemValue('RecentSearhedPessenger');
                      removeItemValue('RecentSearhedOperatorId');
                      removeItemValue('AlarmDistance');

                      setText('');
                      setOpo(null);
                      setBanners([]);
                      setServerData([]);
                      setInput([]);
                      setRoute([]);
                    },
                  },
                ],
                {cancelable: false},
              );
            }
          }}
        />
      </View>

      <ScrollView style={{flex: 1}} keyboardShouldPersistTaps={true}>
        <View
          style={{
            paddingTop: '3%',
          }}>
          {banners[0] ? (
            <TouchableOpacity
              style={styles.BannerShadow}
              onPress={() => {
                Linking.openURL(`https://${banners[0].actionUrl}`);
              }}>
              <Image
                source={{uri: banners[0] ? banners[0].imageLink : null}}
                style={{height: '100%', width: '100%', borderRadius: 5}}
              />
              {/* <Text style={{ color: 'black', fontWeight: 'bold' }}>
              {strings.BANNER_DN}
            </Text> */}
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.body}>
          <View style={[styles.icon, {marginTop: 5}]}>
            <BusFront color={'white'} />
          </View>

          <SearchableDropdown
            onTextChange={text => {
              if (data2 != null || banners.length || !text.length) {
                console.log('Yes');
                dispatch(clearLocation());
                removeItemValue('RecentSearchedOperator');
                removeItemValue('RecentSearchedRoute');
                removeItemValue('RecentSearhedPessenger');
                removeItemValue('RecentSearhedOperatorId');
                removeItemValue('AlarmDistance');
                setText('');
                setOpo(null);
                setBanners([]);
                setServerData([]);
                setInput([]);
                setRoute([]);
              } else {
                setText(text);
              }
            }}
            // Change listner on the searchable input
            onItemSelect={item => {
              console.log(item);
              setText(item.name);
              AsyncStorage.setItem('RecentSearchedOperator', item.name);
              // alert(JSON.stringify(item));
              getOperatorById(item.id);
            }}
            placeholder={text}
            placeholderTextColor="#000"
            // Called after the selection from the dropdown
            containerStyle={{padding: 5, width: '80%', right: 5}}
            // Suggestion container style
            textInputStyle={{
              // Inserted text style
              color: '#000',
              backgroundColor: 'white',
              width: '100%',
              height: 50,
              borderRadius: 10,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              paddingLeft: 10,
              borderWidth: 0.5,
            }}
            itemStyle={{
              // Single dropdown item style
              padding: 10,
              marginTop: 2,
              backgroundColor: '#FAF9F8',
              borderColor: '#bbb',
              color: '#000',

              borderWidth: 1,
            }}
            itemTextStyle={{
              // Text style of a single dropdown item
              color: '#222',
            }}
            itemsContainerStyle={{
              // Items container style you can pass maxHeight
              // To restrict the items dropdown hieght
              // maxHeight: '50%',
              borderRadius: 10,
            }}
            items={serverData}
            // Mapping of item array
            defaultIndex={2}
            // Default selected item index

            // Place holder for the search input
            // resetValue={false}
            // Reset textInput Value with true and false state
            underlineColorAndroid="transparent"
            // To remove the underline from the android input
          />

          <TouchableOpacity
            onPress={() => {
              fetch(
                `http://bojanalic-001-site1.ntempurl.com/clients/getOperators/${text}`,
                {
                  method: 'GET',
                },
              )
                .then(response => response.json())
                .then(responseJson => {
                  console.log(responseJson, 'falksjfalskfjakslfalsfjalksfj');
                  if (responseJson.length >= 1) {
                    setServerData(responseJson);
                  }
                })
                .catch(error => {
                  console.error(error);
                });
            }}
            style={{
              backgroundColor: 'grey',
              height: 50,
              width: 40,
              alignItems: 'center',
              marginTop: 5,
              justifyContent: 'center',
              right: 10,
              // borderTopLeftRadius: 10,
              // borderBottomLeftRadius: 10,
              borderWidth: 0.5,
            }}>
            <Search color={'#FFFFFF'} />
          </TouchableOpacity>
        </View>
        {opo && (
          <View style={{marginBottom: 30}}>
            <View style={{}}>
              <View
                style={{
                  flexDirection: 'row',
                  paddingHorizontal: 10,
                  marginTop: 30,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.32,
                  shadowRadius: 5.46,
                  elevation: 9,
                  zIndex: 1,
                }}>
                <View
                  style={{
                    backgroundColor: 'grey',
                    height: 50,
                    width: 40,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    borderWidth: 0.5,
                  }}>
                  <ArrowRightLeft color={'white'} />
                </View>
                <Dropdown
                  style={{
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    width: '89%',
                    height: 49,
                    borderWidth: 0.5,
                    borderColor: '#ccc', // react-native-element-dropdown needs borderColor explicitly
                    backgroundColor: '#eee',
                  }}
                  containerStyle={{width: '89%', maxHeight: 150}}
                  data={route}
                  labelField="label" // assuming route array has {label, value} items
                  valueField="value"
                  value={value2}
                  onChange={item => setValue2(item.value)}
                  placeholder="Route"
                  showsVerticalScrollIndicator={false}
                  dropdownPosition="auto"
                  // Open/close handled internally, no need for setOpen/setItems here
                />
              </View>

              {opo.data.showPassengerName ? (
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
                    <User color={'#FFFFFF'} />
                  </View>
                  <TextInput
                    style={styles.InputStyle}
                    value={input}
                    onChangeText={text => setInput(text)}
                    placeholder={strings.PPLT_PSNGR_NAM}
                    placeholderTextColor="grey"
                  />
                </View>
              ) : null}
            </View>

            {!search ? (
              <TouchableOpacity
                onPress={getPassengerToken}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#4A90E2',
                  width: 100,
                  height: 50,
                  borderRadius: 5,
                  marginHorizontal: 10,
                  marginVertical: 10,
                }}>
                <Text style={{fontSize: 20, color: 'white', fontWeight: '600'}}>
                  {strings.SEARCH_BTN}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}

        {!search ? (
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
                    {strings.SEARCH_BTN}
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
                    {strings.ALARM_BTN}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}></View>
              <Text style={{marginTop: 5, fontSize: 12, color: '#FFF'}}>
                Last data recieved at {fixTime(data2?.locationTime)}
              </Text>
            </View>
            {banners[1] ? (
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
                  }}
                />
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
                        placeholder={'Please set Alarm'}
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
                      The alarm will raise when bus is under{' '}
                      {alaram.length ? alaram : 0} km from phone your location.
                    </Text>
                  </View>
                </View>
              </Modal>
            </View>
          </>
        ) : null}
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
  titleText: {
    padding: 8,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  headingText: {
    padding: 8,
    color: '#000',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 5,
    margin: 10,
    height: 400,
  },
});

export default BusOperator;
