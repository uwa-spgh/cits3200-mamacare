import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";

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

      <Link href="/screens/screens/Health-and-Edu-screen" style={styles.link}>
        <Text>Go to the Health & Education screen</Text>
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

