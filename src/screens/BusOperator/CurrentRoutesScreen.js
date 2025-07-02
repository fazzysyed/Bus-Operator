import React, {useEffect, useState, useCallback,useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  
  Platform,
} from 'react-native';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

import {
  Bus,
  CalendarDays,
  CoinsIcon,
  MapPinned,
  Trash2,
  LogOut,
} from 'lucide-react-native';
import {useAppSelector} from '../../Hooks/reduxHooks';
import {useNavigation} from '@react-navigation/native';
import {Swipeable} from 'react-native-gesture-handler';
import {showMessage} from 'react-native-flash-message';
import Geolocation from '@react-native-community/geolocation';
import BackgroundService from 'react-native-background-actions';

import {getUniqueId} from 'react-native-device-info';
import {setUser} from '../../store/slices/userSlice';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const CurrentRoutesScreen = () => {
  
  const {t} = useTranslation();
  const [routes, setRoutes] = useState([]);
  const routesRef = useRef([]); // <-- Ref to hold latest routes
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [intervalSeconds, setIntervalSeconds] = useState(15);
  const user = useAppSelector(state => state.user);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Keep routesRef updated with the latest routes
  useEffect(() => {
    routesRef.current = routes;
  }, [routes]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );


  const fetchData = async (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true);
    else setRefreshing(true);

    try {
      const response = await axios.get(
        'http://bojanalic-001-site1.ntempurl.com/bus-operator/current-state',
        {headers: {Token: user.token}},
      );

      console.log(response.data, 'Fetched Routes');
      setRoutes(response.data);

      if (response.data.length) {
        fetchIntervalAndStartService();
      } else {
        // Stop service if no routes
        BackgroundService.stop();
      }
    } catch (err) {
      console.log(err, 'Error fetching routes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchIntervalAndStartService = async () => {
    try {
      const res = await axios.get(
        'http://bojanalic-001-site1.ntempurl.com/application/read-location',
        {headers: {Token: user.token}},
      );

      console.log(res.data, 'Fetched interval');
      const seconds = res.data.interval || 15;
      setIntervalSeconds(seconds);
      startLocationService(seconds);
    } catch (err) {
      console.log('Error fetching interval:', err);
    }
  };

  function getFormattedDateTime() {
    const date = new Date();

    const pad = n => (n < 10 ? '0' + n : n);

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  const startLocationService = async interval => {
    const options = {
      taskName: 'LocationUpdate',
      taskTitle: 'Bus tracking active',
      taskDesc: 'Updating current bus location',
      taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
      },
      color: '#3b82f6',
      parameters: {
        delay: interval * 1000, // Use the interval dynamically
      },
    };

    const veryPreciseTask = async taskData => {
      const {delay} = taskData;
      while (BackgroundService.isRunning()) {
        await updateLocation();
        await sleep(delay);
      }
    };

    try {
      if (!(await BackgroundService.isRunning())) {
        await BackgroundService.start(veryPreciseTask, options);
        console.log('Background service started');
      } else {
        console.log('Background service already running');
      }
    } catch (error) {
      console.log('Error starting background service:', error);
    }
  };

  const updateLocation = async () => {
    if (!routesRef.current.length) {
      console.log('No routes available; skipping location update');
      return;
    }

    Geolocation.getCurrentPosition(
      async pos => {
        const {latitude, longitude} = pos.coords;

        let getAppToken = await getUniqueId();
        try {
          const promises = routesRef.current.map(route => {
            const payload = {
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              locationTime: getFormattedDateTime(),
              vehicleId: route.vehicleId,
              appToken: getAppToken,
            };

            const headers = {
              'Content-Type': 'application/json',
              Token: user.token,
            };

            console.log('Sending POST request with payload:', payload);

            return axios.post(
              'http://bojanalic-001-site1.ntempurl.com/bus-operator/set-current-location',
              payload,
              {headers},
            );
          });

          const responses = await Promise.all(promises);

    responses.forEach((response, index) => {

  //  showMessage({message: `${response.data}`, type: 'success'});
  console.log(`Response ${index}:`, response.data);
});

          // Optionally handle each response here
        } catch (err) {
          // showMessage({
          //   type:"danger",
          //   message:"'Location send failed"

          // })
          console.log('Location send failed:', err.response || err.message);
        }
      },
      error => {
          //   showMessage({
          //   type:"danger",
          //   message:error.message

          // })
        console.log('Location error:', error.message);
      },
      {enableHighAccuracy: false,
            maximumAge: 15000,},
    );
  };

  const handleDelete = async item => {
              const getAppToken = await getUniqueId();

    console.log(  {
                headers: {Token: user.token},
                data: {
                  vehicleId: item.vehicleId,
                  routeItemId: item.routeItemId,
                  appToken: getAppToken,
                },
              },)
    Alert.alert('Delete Route', 'Are you sure?', [
      {text: 'Cancel'},
      {
        text: 'Delete',
        onPress: async () => {
          const getAppToken = await getUniqueId();
          try {
            await axios.delete(
              'http://bojanalic-001-site1.ntempurl.com/bus-operator/delete-tracking',
              {
                headers: {Token: user.token},
                data: {
                  vehicleId: item.vehicleId,
                  routeItemId: item.routeItemId,
                  appToken: getAppToken,
                },
              },
            );

        setRoutes(prev => {
  const updatedRoutes = prev.filter(r => r.routeItemId !== item.routeItemId);
  routesRef.current = updatedRoutes;  // Update the ref with new routes
  return updatedRoutes;               // Update the state
});

            showMessage({message: 'Deleted', type: 'success'});
          } catch (err) {
            console.log(err, 'Delete error');
            showMessage({message: 'Delete failed', type: 'danger'});
          }
        },
      },
    ]);
  };

  const renderRightActions = item => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(item)}>
      <Trash2 color="#fff" size={20} />
      <Text style={styles.deleteText}>{t('DELETE')}</Text>
    </TouchableOpacity>
  );

  const renderItem = ({item}) => (
    <Swipeable renderRightActions={() => renderRightActions(item)}>
      <View style={styles.card}>
        <View style={styles.row}>
          <Bus color="#3b82f6" size={20} />
          <Text style={styles.textBold}> {item.routeItemToken}</Text>
        </View>
        <View style={styles.row}>
          <MapPinned color="#10b981" size={20} />
          <Text style={styles.textNormal}> {item.route}</Text>
        </View>
        <View style={styles.row}>
          <CalendarDays color="#f59e0b" size={20} />
          <Text style={styles.textNormal}>
            {new Date(item.startingDateTime).toLocaleString()}
          </Text>
        </View>
      </View>
    </Swipeable>
  );

  if (loading && !refreshing)
    return (
      <ActivityIndicator style={styles.center} size="large" color="#3b82f6" />
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>{t('CURRENT_ROUTES')}</Text>
        <TouchableOpacity
          onPress={() => {
            BackgroundService.stop();
            dispatch(setUser(null));
            console.log('Logging out...');
          }}>
          <LogOut color="black" size={24} />
        </TouchableOpacity>
      </View>
      <View style={{padding: 16}}>
        <TouchableOpacity
          style={styles.addRouteButton}
          onPress={() => navigation.navigate('SetRoute')}>
          <Text style={styles.addRouteText}>+ {t('ADD_ROUTE')}</Text>
        </TouchableOpacity>
        <FlatList
          data={routes}
          keyExtractor={item => item.routeItemId.toString()}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={() => fetchData(true)}
        />
      </View>
    </SafeAreaView>
  );
};

export default CurrentRoutesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    // padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: '#f2f2f2', // Optional
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    textAlign: 'center',
  },
  addRouteButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  addRouteText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  textBold: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  textNormal: {
    fontSize: 15,
    color: '#374151',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginVertical: 8,
    borderRadius: 10,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
    marginTop: 4,
  },
});
