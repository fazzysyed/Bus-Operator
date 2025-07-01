import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface LanguageState {
  language: string;
}

const initialState: LanguageState = {
  language: 'en', // default language
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguageState: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
  },
});

export const {setLanguageState} = languageSlice.actions;
export default languageSlice.reducer;
