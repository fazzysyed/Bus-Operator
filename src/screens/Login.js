import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import FlashMessage, {showMessage} from 'react-native-flash-message';
import strings from '../lang/i18n.js';
import {useAppDispatch} from '../Hooks/reduxHooks';
import {setUser} from '../store/slices/userSlice';
import {ArrowLeft} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import {getUniqueId} from 'react-native-device-info';
import messaging from '@react-native-firebase/messaging';
import {useTranslation} from 'react-i18next';

const Login = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const {t} = useTranslation();

  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const loginHandler = async () => {
    if (!username || !pass) {
      showMessage({
        message: 'Validation Error',
        description: 'Username and password are required.',
        type: 'warning',
      });
      return;
    }

    setLoading(true);

    let getAppToken = await getUniqueId();

    try {
      const response = await axios.post(
        'http://bojanalic-001-site1.ntempurl.com/users/login',
        {
          userName: username,
          password: pass,
          appToken: getAppToken,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      const user = response.data;
      dispatch(setUser(user));

      await messaging().subscribeToTopic('all');

      showMessage({
        message: `Welcome, ${user.firstName}!`,
        type: 'success',
      });

      // Navigate to next screen if needed
      // navigation.navigate('Home');
    } catch (error) {
      console.error('Login error:', error);
      showMessage({
        message: 'Login failed',
        description: 'Invalid username or password.',
        type: 'danger',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <ArrowLeft size={24} color="#3b82f6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('LOGIN_BTN')}</Text>
        <View style={{width: 24}} />
      </View>
      <View style={styles.formWrapper}>
        {/* Header */}

        {/* Inputs */}
        <TextInput
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholder={t('USERNAME')}
          placeholderTextColor="#888"
          editable={!loading}
        />
        <TextInput
          value={pass}
          onChangeText={setPass}
          style={styles.input}
          placeholder={t('PASSWORD')}
          placeholderTextColor="#888"
          secureTextEntry
          editable={!loading}
        />

        {/* Button */}
        <TouchableOpacity
          onPress={loginHandler}
          style={[styles.button, loading && styles.disabledButton]}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>{t('LOGIN_BTN')}</Text>
          )}
        </TouchableOpacity>

        {/* Link */}
        <TouchableOpacity disabled={loading}>
          <Text style={styles.linkText}>{strings.DNT_HV_ACCNT}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  formWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'stretch', // or 'center' if you want inputs centered horizontally too
  },

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    // paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    textAlign: 'center',
    marginRight: 24, // balance for arrow icon
  },
  title: {
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  linkText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#007AFF',
  },
});

export default Login;
