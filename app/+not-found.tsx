import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";



export default function NotFound() {
    return(
    <View>
        <Text style = {styles.link}>404</Text>
        <Link href = "/" style = { styles.link }>
            Page was not found return to Home screen
        </Link>
    </View>

)}

const styles = StyleSheet.create({
    link: {
        color: "red"
    }
})
