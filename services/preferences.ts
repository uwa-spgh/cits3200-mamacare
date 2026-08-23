import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFERENCES_KEY = "app_preferences";

export type AppPreferences ={
    language: 'en' | 'nepali' | null;
    theme: 'light' | 'dark' | 'system';
}

const defaultPreferences: AppPreferences ={ 
    language: null,
    theme: 'system',
}

export async function getPreferences(): Promise<AppPreferences> {
    const value = await AsyncStorage.getItem(PREFERENCES_KEY);

    if (!value){
        return defaultPreferences;
    }
    
    return JSON.parse(value);
}

export async function savePreferences(preferences: AppPreferences) {
    await AsyncStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify(preferences)
    );
}