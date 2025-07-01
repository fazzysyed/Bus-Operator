import React, {useState, useEffect} from 'react';

// import all the components we are going to use
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

// import SearchableDropdown component
import SearchableDropdown from 'react-native-searchable-dropdown';

// Item array for the dropdown
const items = [
  // name key is must. It is to show the text in front
  {id: 1, name: 'angellist'},
  {id: 2, name: 'codepen'},
  {id: 3, name: 'envelope'},
  {id: 4, name: 'etsy'},
  {id: 5, name: 'facebook'},
  {id: 6, name: 'foursquare'},
  {id: 7, name: 'github-alt'},
  {id: 8, name: 'github'},
  {id: 9, name: 'gitlab'},
  {id: 10, name: 'instagram'},
];

const App = () => {
  // Data Source for the SearchableDropdown
  const [serverData, setServerData] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (text.length > 3) {
      fetch(`https://api.test.travellertracker.co/clients/getOperators/${text}`)
        .then(response => response.json())
        .then(responseJson => {
          console.log(responseJson);
          //Successful response from the API Call
          setServerData(responseJson);
        })
        .catch(error => {
          console.error(error);
        });
    }
    if (text === '') {
      setServerData([]);
    }
  }, [text]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.headingText}>
          Searchable Dropdown from Dynamic Array from Server
        </Text>
        <SearchableDropdown
          onTextChange={text => {
            setText(text);
          }}
          // Change listner on the searchable input
          onItemSelect={item => alert(JSON.stringify(item))}
          // Called after the selection from the dropdown
          containerStyle={{padding: 5}}
          // Suggestion container style
          textInputStyle={{
            // Inserted text style
            padding: 12,
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#FAF7F6',
          }}
          itemStyle={{
            // Single dropdown item style
            padding: 10,
            marginTop: 2,
            backgroundColor: '#FAF9F8',
            borderColor: '#bbb',
            borderWidth: 1,
          }}
          itemTextStyle={{
            // Text style of a single dropdown item
            color: '#222',
          }}
          itemsContainerStyle={{
            // Items container style you can pass maxHeight
            // To restrict the items dropdown hieght
            maxHeight: '50%',
          }}
          items={serverData}
          // Mapping of item array
          defaultIndex={2}
          // Default selected item index
          placeholder="placeholder"
          // Place holder for the search input
          resetValue={false}
          // Reset textInput Value with true and false state
          underlineColorAndroid="transparent"
          // To remove the underline from the android input
        />
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
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
});
