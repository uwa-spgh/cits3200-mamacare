import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import Button from "@/components/Button"; // use button later to create button for home screen return



export default function NotFound() {
    return(
    <View>
        <Text style = {styles.link}>404</Text>
        <Link href = "/(tabs)" style = { styles.link }>
            Page was not found return to Home screen
        </Link>
    </View>

)}

const styles = StyleSheet.create({
    link: {
        color: "red"
    }
})
