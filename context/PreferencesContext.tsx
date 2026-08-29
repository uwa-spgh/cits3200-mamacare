import { createContext, useEffect, useContext, useState, ReactNode } from "react";
import { getPreferences, savePreferences, AppPreferences } from "@/services/preferences";

type PreferencesContextType = {
    preferences: AppPreferences,
    loading: boolean,
    setLanguage: (language: 'en' | 'nepali') => Promise<void>;
    setTheme: (theme: 'light' | 'dark' | 'system') => Promise<void>;
}

const PreferencesConstext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children } : { children:ReactNode }) {
    const [preferences, setPreferences] = useState<AppPreferences>({
        language: null,
        theme: 'system',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadPreferences() {
            const storedPreferences = await getPreferences();

            setPreferences(storedPreferences);
            setLoading(false);
        }
        loadPreferences();
    }, []);


    async function setLanguage(language: 'en' | 'nepali') { //Lang setter function 
        const updated = {
            ...preferences,
            language,
        };

        setPreferences(updated);
        await savePreferences(updated);
    }
    
    async function setTheme(theme : 'light' | 'dark' | 'system') { //Theme setter function
        const updated = {
            ...preferences,
            theme,
        }
        setPreferences(updated);
        await savePreferences(updated);
    }

    return (
        <PreferencesConstext.Provider 
        value={{
            preferences,
            loading,
            setLanguage,
            setTheme,
        }}>
            {children}
        </PreferencesConstext.Provider>
    );
}

export function usePreferences(){
    const context = useContext(PreferencesConstext);

    if(!context) {
        throw new Error(
            "usePreferences must be used inside PreferencesProvider"
        );
    }

    return context;
}