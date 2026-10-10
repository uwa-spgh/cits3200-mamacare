import {configureStore} from "@reduxjs/toolkit";
import { dataReducer } from "./reducers/dataReducers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setEdd } from "./reducers/dataReducers";
import { createDueDateStorage } from "../pregnancy/storage";


export const store = configureStore({
    reducer: {
        dataReducer: dataReducer.reducer
    },
});

export type RootState = ReturnType<typeof store.getState>;

const dueDateStorage = createDueDateStorage(AsyncStorage);
let hydrationPromise: Promise<void> | undefined;

export function hydrateDueDate(): Promise<void> {
    if (!hydrationPromise) {
        hydrationPromise = dueDateStorage.load().then((edd) => {
            store.dispatch(setEdd(edd));
        }).catch((error) => {
            hydrationPromise = undefined;
            throw error;
        });
    }
    return hydrationPromise;
}

export async function saveDueDate(value: string): Promise<void> {
    await hydrateDueDate();
    const edd = await dueDateStorage.save(value);
    store.dispatch(setEdd(edd));
}
