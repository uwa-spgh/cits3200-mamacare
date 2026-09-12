import {createSlice} from '@reduxjs/toolkit'


const initialState = {
    language: 'en',
    userName: '',
    edd: '',
}

export const dataReducer = createSlice({
    name: 'dataReducer',
    initialState: initialState,
    reducers: {
        setLanguage: (state, action) => {
            state.language = action.payload
        },
        setUserName: (state, action) => {
            state.userName = action.payload
        },
        setEdd: (state, action) => {
            state.edd = action.payload
        }
    }
})

export const {setLanguage, setUserName, setEdd} = dataReducer.actions