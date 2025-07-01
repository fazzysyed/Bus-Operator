// src/redux/slices/userSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface UserState {
  userName: string;
  firstName: string;
  lastName: string;
  token: string;
  userRole: number;
}

const initialState: UserState | null = null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      return action.payload;
    },
    clearUser: () => {
      return null;
    },
  },
});

export const {setUser, clearUser} = userSlice.actions;
export default userSlice.reducer;
