import { Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";

import Button from '../components/Button';
import { usePreferences } from "../context/PreferencesContext";


export default function LanguageSelectionScreen() {
    const {setLanguage} = usePreferences();

    async function selectLanguage(
        language: 'en' | 'nepali'
    ) {
        await setLanguage(language)

        router.replace('/(tabs)/about')
    }

    return(
        <View style = {styles.screen}>            
            <View style ={styles.container}>
                <Text style = {styles.headerText}>Language Selection</Text>
                <Text style = {styles.text}>Select your Preffered Language</Text>

                <Button 
                label = "English" 
                onPress = {() => selectLanguage('en')}
                />

                <Button 
                label = "Nepali (नेपाली)"
                onPress = {() => selectLanguage('nepali')}  
                />

            </View>
        </View>
)}

const styles = StyleSheet.create({
    screen: {
        flex:1,
        justifyContent:'center',
        alignItems: 'center',
    },

    container: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        flex:1
    },

    buttonContainer: {
    },

    text: {
        textAlign: 'center',
        color: "#000",
        fontSize:20,
    },

    headerText: {
        fontSize: 28,
        textAlign:'center',
        color: "#AE214D",
        fontWeight:"bold",
    },

})
