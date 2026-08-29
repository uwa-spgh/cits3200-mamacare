import { StyleSheet, Text, View } from "react-native";

// Placeholder — profile screen content is still WIP (per commit history).
// A route file must have a default export or expo-router warns/crashes on
// navigation to it, so this stub fills that in until the real screen lands.
export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>Profile screen coming soon.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
