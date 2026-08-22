import { Text, View, StyleSheet } from "react-native";



export default function AboutScreen() {
    return(
        <View style = {styles.container}>
            <Text style={ styles.text }>This is about screen</Text>
            
        </View>
        
    )
} 

const styles = StyleSheet.create({
    text: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },

    container: { 
        flex: 1,
        backgroundColor: "#DFBEC3"
    }
})