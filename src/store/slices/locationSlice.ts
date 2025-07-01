import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import axios from 'axios';

type LocationType = {
  latitude: number;
  longitude: number;
};

interface LocationState {
  location: LocationType | null;
  apptoken: string;
  updatedLocation: LocationType | null;
  search: boolean;
}

const initialState: LocationState = {
  location: null,
  apptoken: '',
  updatedLocation: null,
  search: false,
};

export const getOneTimeLocation = createAsyncThunk(
  'location/getOneTimeLocation',
  async (_, thunkAPI) => {
    return new Promise<LocationType>((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          AsyncStorage.setItem('UsersLocation', JSON.stringify(coords));
          resolve(coords);
        },
        error => reject(error),
        {timeout: 30000},
      );
    });
  },
);

export const getAppToken = createAsyncThunk(
  'location/getAppToken',
  async () => {
    const token = await messaging().getToken();

    console.log(token, 'tokenenen');
    return token;
  },
);

export const updateAppToken = createAsyncThunk(
  'location/updateAppToken',
  async () => {
    const token = await messaging().onTokenRefresh();
    return token;
  },
);

export const updateLocation = createAsyncThunk(
  'location/updateLocation',
  async (
    payload: {
      passengerName: string;
      operatorId: string;
      routeItemId: string;
      appToken: string;
    },
    thunkAPI,
  ) => {
    const data = {
      passengerName: payload.passengerName,
      operatorId: payload.operatorId,
      routeItemId: payload.routeItemId,
      appToken: payload.appToken,
    };

    try {
      const response = await axios.post(
        'http://bojanalic-001-site1.ntempurl.com/clients/getPassangerToken',
        data,
      );

      console.log(response, 'responseresponse');
      await AsyncStorage.setItem(
        'LocationStuff',
        JSON.stringify(response.data.token),
      );

      const locationRes = await axios.get(
        `http://bojanalic-001-site1.ntempurl.com/clients/getLocation/${response.data.token}`,
      );

      console.log(locationRes);
      return locationRes.data[0];
    } catch (err) {
      console.log(err.response, 'fakjfajlks');
      return thunkAPI.rejectWithValue({});
    }
  },
);

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setSearching(state, action: PayloadAction<boolean>) {
      state.search = action.payload;
    },
    updateLocationByNotification(state, action: PayloadAction<LocationType>) {
      state.updatedLocation = action.payload;
      state.search = true;
    },
    clearLocation(state) {
      state.updatedLocation = null;
      state.search = false;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getOneTimeLocation.fulfilled, (state, action) => {
        state.location = action.payload;
      })
      .addCase(getAppToken.fulfilled, (state, action) => {
        state.apptoken = action.payload;
      })
      .addCase(updateAppToken.fulfilled, (state, action) => {
        state.apptoken = action.payload;
      })
      .addCase(updateLocation.fulfilled, (state, action) => {
        state.updatedLocation = action.payload;
        state.search = true;
      })
      .addCase(updateLocation.rejected, state => {
        state.updatedLocation = null;
        state.search = false;
      });
  },
});

export const {setSearching, updateLocationByNotification, clearLocation} =
  locationSlice.actions;
export default locationSlice.reducer;
