import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
// export { default } from "./app/screens/HomeScreen.tsx";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>

      <Link href = "/HomeScreen" style={styles.link}>
        <Text>Go to the Home Screen</Text>
      </Link>
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
});

