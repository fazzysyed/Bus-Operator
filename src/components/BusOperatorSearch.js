import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {FC} from 'react';

import strings from '../lang/i18n.js';
import {Search} from 'lucide-react-native';

const BusOperatorSearch = () => {
  const [input, setInput] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <Search style={styles.icon} size={20} color="grey" />
        <TextInput
          value={input}
          onChangeText={text => setInput(text)}
          style={styles.input}
          placeholder={strings.BUS_OPERATOR}
          placeholderTextColor="grey"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 25,
    width: '80%',
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    elevation: 9,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: 'grey',
    paddingVertical: 15,
  },
});

export default BusOperatorSearch;
