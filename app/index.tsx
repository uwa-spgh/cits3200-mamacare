import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={ styles.container }>

    <Link href="/about" style={ styles.button }>Press here to see About Screen</Link>
    <Link href="/languageSelection" style={ styles.button }>Press here to see Language Screen</Link>
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#000"
  }
});

