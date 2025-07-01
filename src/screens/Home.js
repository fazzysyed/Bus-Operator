import 'react-native-gesture-handler';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {FC} from 'react';
import BusOperatorSearch from '../components/BusOperatorSearch';
import Passangers from '../components/Passangers';
import Route from '../components/Route';

import strings from '../lang/i18n.js';

const Home = props => {
  return (
    <>
      <ImageBackground
        style={{flex: 1, paddingTop: '20%'}}
        source={require('../../assets/3.jpg')}>
        <SafeAreaView style={{flex: 1}}>
          <View>
            <TouchableOpacity style={styles.BannerShadowUp}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                {strings.BANNER_UP}
              </Text>
            </TouchableOpacity>

            <View style={{justifyContent: 'center', marginVertical: 30}}>
              <BusOperatorSearch />
              <Route />
              <Passangers />
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'blue',
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
                  <Text style={{color: '#FFF'}}>{strings.SEARCH_BTN}</Text>
                </TouchableOpacity>
                <Text style={{marginTop: 5, fontSize: 12, color: '#FFF'}}>
                  Last data recieved at 15:23
                </Text>
              </View>
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <TouchableOpacity
                  style={{
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
                  <Text style={{color: '#FFF'}}>{strings.ALARM_BTN}</Text>
                </TouchableOpacity>
                <Text style={{marginTop: 5, fontSize: 12, color: '#FFF'}}>
                  Automatic Refresh at 15:27
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.BannerShadow}>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                {strings.BANNER_DN}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>{/* <Maps /> */}</View>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
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
  BannerShadow: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 10,
    marginTop: 5,
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
});

export default Home;
