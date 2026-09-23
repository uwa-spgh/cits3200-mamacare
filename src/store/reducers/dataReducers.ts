import {createSlice, PayloadAction} from '@reduxjs/toolkit'


const initialState = {
    language: 'en',
    userName: 'Asha Sharma',
    edd: '',
    lmp: '',
    gestationSource: 'auto',
    birthDate: '',
    dismissedBirthPromptAt: '',
}

export const dataReducer = createSlice({
    name: 'dataReducer',
    initialState: initialState,
    reducers: {
        setLanguage: (state, action: PayloadAction<string>) => {
            state.language = action.payload
        },
        setUserName: (state, action: PayloadAction<string>) => {
            state.userName = action.payload
        },
        setEdd: (state, action: PayloadAction<string>) => {
            state.edd = action.payload
        },
        setLmp: (state, action: PayloadAction<string>) => {
      state.lmp = action.payload;
    },
    setGestationSource: (state, action: PayloadAction<GestationSource>) => {
      state.gestationSource = action.payload;
    },
    setBirthDate: (state, action: PayloadAction<string>) => {
      state.birthDate = action.payload;
      state.dismissedBirthPromptAt = ''; // reset so future prompts can fire
    },
    clearBirthDate: (state) => {
      state.birthDate = '';
    },
    setDismissedBirthPromptAt: (state, action: PayloadAction<string>) => {
      state.dismissedBirthPromptAt = action.payload;
    },
    }
})

export const {setLanguage, setUserName, setEdd} = dataReducer.actions