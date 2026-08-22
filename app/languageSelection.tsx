import { Text, View, StyleSheet } from "react-native";
import { Host, Button, Column } from "@expo/ui"; 
import { useState } from "react";
import { buttonStyles } from "@/styles/buttonStyles";

export default function LanguageSelectionScreen() {
    const [clicked, setClicked] = useState(false);

    return( 
    <Host matchContents>
        <Column spacing={16} alignment="center">
            <Text style={ styles.headerText }>Select Your Language</Text>

            <Button 
            label="English" 
            onPress={() => setClicked(!clicked)}
            style = { buttonStyles.notClicked }
            />

            <Button 
            label="Nepali (नेपाली)" 
            onPress={() => setClicked(!clicked)}
            style={ buttonStyles.notClicked }
            />
        </Column>
    </Host>
)}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // padding: 20,
        // marginTop: 30,
        // marginHorizontal: 20,
        rowGap: 10
    },

    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    text: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        color: "#000"
    },

    headerText: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        
        color: "#AE214D",
    },

})