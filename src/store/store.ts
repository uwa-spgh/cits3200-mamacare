import { configureStore } from "@reduxjs/toolkit";
import { dataReducer } from "./reducers/dataReducers";
import { persistedDataReducer } from "./persisted/persistConfig";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setEdd,
  setEmergencyContacts,
  type EmergencyContact,
} from "./reducers/dataReducers";
import { createDueDateStorage } from "../pregnancy/storage";


export const store = configureStore({
  reducer: {
    dataReducer: persistedDataReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

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

const legacyEmergencyContactsStorageKey = "@mamacare/emergency-contacts";
let emergencyContactsMigration: Promise<void> | undefined;

function isEmergencyContact(value: unknown): value is EmergencyContact {
    if (typeof value !== "object" || value === null) return false;
    const contact = value as Record<string, unknown>;
    return (
        typeof contact.id === "string" &&
        typeof contact.name === "string" &&
        typeof contact.relationship === "string" &&
        typeof contact.phone === "string" &&
        typeof contact.address === "string" &&
        typeof contact.isNextOfKin === "boolean" &&
        typeof contact.contactInEmergency === "boolean"
    );
}

export function migrateLegacyEmergencyContacts(): Promise<void> {
    if (!emergencyContactsMigration) {
        emergencyContactsMigration = (async () => {
            const savedContacts = await AsyncStorage.getItem(
                legacyEmergencyContactsStorageKey,
            );
            if (savedContacts === null) return;

            if (store.getState().dataReducer.emergencyContacts.length === 0) {
                const parsedContacts: unknown = JSON.parse(savedContacts);
                if (
                    !Array.isArray(parsedContacts) ||
                    !parsedContacts.every(isEmergencyContact)
                ) {
                    throw new Error("Saved emergency contacts have an invalid format.");
                }

                store.dispatch(setEmergencyContacts(parsedContacts));
                await persistor.flush();
            }

            await AsyncStorage.removeItem(legacyEmergencyContactsStorageKey);
        })().catch((error: unknown) => {
            emergencyContactsMigration = undefined;
            throw error;
        });
    }

    return emergencyContactsMigration;
}
