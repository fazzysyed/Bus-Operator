import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import axios from 'axios';
import {Dropdown} from 'react-native-element-dropdown';
import {useAppSelector} from '../../Hooks/reduxHooks';
import {showMessage} from 'react-native-flash-message';
import {useNavigation} from '@react-navigation/native';
import {ArrowLeft} from 'lucide-react-native'; // <-- import lucide icon
import {getUniqueId} from 'react-native-device-info';
import {useTranslation} from 'react-i18next';

const SetRouteScreen = () => {
  const [buses, setBuses] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [loading, setLoading] = useState(true);

  const {t} = useTranslation();
  const user = useAppSelector(state => state.user);
  const navigation = useNavigation();

  const headers = {
    // Authorization: `Bearer ${user.token}`,
    Token: user.token,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [busRes, routeRes] = await Promise.all([
          axios.get(
            'http://bojanalic-001-site1.ntempurl.com/bus-operator/get-busses',
            {headers},
          ),
          axios.get(
            'http://bojanalic-001-site1.ntempurl.com/bus-operator/get-routes',
            {headers},
          ),
        ]);

        setBuses(busRes.data.map(b => ({label: b.name, value: b.id})));

        console.log(routeRes.data, 'routeRes.data');
        setRoutes(
          routeRes.data.map(r => ({label: r.shortDescription, value: r.id})),
        );
      } catch (error) {
        console.log(error);
        showMessage({
          message: 'Error loading buses or routes',
          type: 'danger',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const assignRoute = async () => {
    if (!selectedRoute) {
      showMessage({
        message: 'Please select a route.',
        type: 'warning',
      });
      return;
    }

    let getAppToken = await getUniqueId();

    try {
      await axios.post(
        'http://bojanalic-001-site1.ntempurl.com/bus-operator/set-tracking-details',
        {
          vehicleId: selectedBus,
          routeItemId: selectedRoute,
          appToken: getAppToken,
        },
        {headers},
      );

      showMessage({
        message: 'Route assigned successfully!',
        type: 'success',
      });

      navigation.goBack();
    } catch (error) {
      console.log(error.response);

      if (
        error.response?.status === 400 &&
        error.response.data.message === 'RouteAlreadyConnected'
      ) {
        // Show a user-friendly message and confirm before overriding
        Alert.alert(
          'Route Already Assigned',
          'This bus is already assigned to a route. Do you want to override the current route assignment?',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Yes, Override',
              style: 'destructive',
              onPress: async () => {
                try {
                  const response = await axios.post(
                    'http://bojanalic-001-site1.ntempurl.com/bus-operator/force-set-tracking-details',
                    {
                      vehicleId: selectedBus,
                      routeItemId: selectedRoute,
                      appToken: getAppToken,
                    },
                    {headers},
                  );

                  console.log('FarazFaraz:', response); // Log the full response

                  showMessage({
                    message:
                      'Previous route assignment overridden successfully!',
                    type: 'success',
                  });

                  navigation.goBack();
                } catch (forceErr) {
                  console.error('Error overriding route assignment:', forceErr); // Log the full error

                  // Optional: log more specific error details if available
                  if (forceErr.response) {
                    console.error('Error data:', forceErr.response.data);
                    console.error('Status:', forceErr.response.status);
                    console.error('Headers:', forceErr.response.headers);
                  }

                  showMessage({
                    message: 'Failed to override route assignment.',
                    type: 'danger',
                  });
                }
              },
            },
          ],
        );
      } else {
        showMessage({
          message: 'Failed to assign route. Please try again.',
          type: 'danger',
        });
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeft size={24} color="#3b82f6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('SET_ROUTE')}</Text>
        <View style={{width: 24}} />
      </View>

      <Text style={styles.label}>{t('SELECT_BUS')}</Text>
      <Dropdown
        style={styles.dropdown}
        data={buses}
        labelField="label"
        valueField="value"
        placeholder={t('SELECT_BUS')}
        value={selectedBus}
        onChange={item => setSelectedBus(item.value)}
      />

      <Text style={[styles.label, {marginTop: 20}]}>Select Route</Text>
      <Dropdown
        style={styles.dropdown}
        data={routes}
        labelField="label"
        valueField="value"
        placeholder={t('SELECT_ROUTE')}
        value={selectedRoute}
        onChange={item => setSelectedRoute(item.value)}
      />

      <View style={{marginTop: 40}}>
        <Button title="Assign Route" onPress={assignRoute} color="#3b82f6" />
      </View>
    </View>
  );
};

export default SetRouteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  dropdown: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
