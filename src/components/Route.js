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
import DropDownPicker from 'react-native-dropdown-picker';
import strings from '../lang/i18n.js';

const Route = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    {label: 'A', value: 'a'},
    {label: 'B', value: 'b'},
    {label: 'C', value: 'c'},
    {label: 'D', value: 'd'},
    {label: 'E', value: 'e'},
    {label: 'F', value: 'f'},
  ]);

  return (
    <View style={styles.body}>
      <DropDownPicker
        style={{borderWidth: 0}}
        maxHeight={150}
        listMode="SCROLLVIEW"
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder={strings.ROUTE}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    margin: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
    zIndex: 1,
  },
});

export default Route;
