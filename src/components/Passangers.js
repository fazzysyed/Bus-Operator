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
  Picker,
} from 'react-native';
import {FC} from 'react';
import strings from '../lang/i18n.js';

const BusOperatorSearch = () => {
  const [input, setInput] = useState('');

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <TextInput
        value={input}
        onChangeText={text => setInput(text)}
        style={styles.body}
        placeholder={strings.PASSENGER}
        placeholderTextColor="grey"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    width: '70%',
    borderRadius: 5,
    backgroundColor: '#FFF',
    padding: 15,
    fontSize: 15,
    color: 'grey',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
});

export default BusOperatorSearch;
