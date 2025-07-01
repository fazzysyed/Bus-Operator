import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import ModalPicker from 'rn-modal-picker';
import {RotateCcw} from 'lucide-react-native';
import strings from '../lang/i18n.js';
import {getLang, setLang} from '../helper/ChangeLang';
import {useAppDispatch} from '../Hooks/reduxHooks';
import {setLanguageState} from '../store/slices/languageSlice';
import {useTranslation} from 'react-i18next';

interface LanguageSelectProps {
  onPress?: () => void;
}

const LanguageSelect: React.FC<LanguageSelectProps> = ({onPress}) => {
  const [value, setValue] = useState('');
  const [selectedLabel, setSelectedLabel] = useState(strings.LANGUAGE); // Placeholder text
  const {t, i18n} = useTranslation();
  const dispatch = useAppDispatch();
  const items = [
    {id: 'en', name: 'English'},
    {id: 'sr', name: 'Serbian'},
    {id: 'gr', name: 'German'},
    {id: 'bs', name: 'Bosnian'},
  ];

  useEffect(() => {
    const initLang = async () => {
      const lang = await getLang();
      if (lang) {
        setValue(lang);
        const label = items.find(i => i.id === lang);

        console.log(label);
        setSelectedLabel(label?.name);
        i18n.changeLanguage(label?.id);
      }
    };
    initLang();
  }, []);

  const onLanguageChange = (selectedItem: any) => {
    console.log(selectedItem);
    dispatch(setLanguageState(selectedItem.id));

    i18n.changeLanguage(selectedItem.id);

    setValue(selectedItem.id);
    setSelectedLabel(selectedItem.name);

    setLang(selectedItem.id);
  };

  return (
    <View style={styles.container}>
      <ModalPicker
        data={items}
        hideSearchBar={true}
        keyExtractor={item => item.id}
        labelExtractor={item => item.name}
        animationType="slide"
        pickerContainerStyle={styles.pickerStyle}
        dropDownIcon={null}
        // dropDownIcon={require('../assets/dropdown-icon.png')} // replace with your actual icon
        selectedText={selectedLabel}
        selectedTextStyle={styles.selectedTextStyle}
        listTextStyle={styles.listTextStyle}
        placeHolderText={t('LANGUAGE')}
        placeHolderTextColor={'black'}
        onChange={onLanguageChange}
      />
      <RotateCcw color="black" style={styles.icon} onPress={onPress} />
    </View>
  );
};

export default LanguageSelect;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: '#F5FCFF',
  },
  icon: {
    marginRight: 20,
  },
  titleText: {
    color: '#000',
    fontSize: 25,
    marginBottom: 25,
    fontWeight: 'bold',
  },
  pickerStyle: {
    // backgroundColor: '#4A90E2',
    height: 40,
    width: '80%',
    marginVertical: 10,
    borderColor: '#303030',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 1.5,
    fontSize: 16,
    color: '#000',
  },
  selectedTextStyle: {
    paddingLeft: 5,
    color: '#000',
    textAlign: 'right',
  },
  listTextStyle: {
    color: '#000',
    textAlign: 'right',
  },

  searchBarStyle: {
    margin: 10,
    padding: 10,
    flexDirection: 'row',
    height: 45,
    shadowOpacity: 1.0,
    shadowRadius: 2,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    backgroundColor: 'rgba(255,255,255,1)',
    shadowColor: Platform.OS === 'ios' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,1)',
    borderRadius: 10,
    elevation: 5,
  },
});
