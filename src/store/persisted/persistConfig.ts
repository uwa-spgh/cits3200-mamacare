import AsyncStorage from "@react-native-async-storage/async-storage";
import dataReducer from "../reducers/dataReducers";
import { persistReducer } from "redux-persist";

const persistConfig = {
  key: 'root',
  storage: AsyncStorage
};

export const persistedDataReducer = persistReducer(persistConfig, dataReducer);