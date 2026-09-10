import { StyleSheet, Text, View } from "react-native";
import { Link, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function NotFound() {
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "MamaCare",
          headerStyle: {
            backgroundColor: "#DFBEC3",
          },
          headerTintColor: "#AE214D",
          headerShadowVisible: true,
        }}
      />

      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="heart-dislike-outline"
            size={52}
            color="#AE214D"
          />
        </View>

        <Text style={styles.code}>404</Text>

        <Text style={styles.title}>Page Not Found</Text>

        <Text style={styles.message}>
          Sorry, we couldn't find the page you're looking for.
        </Text>

        <Link href="/(tabs)" style={styles.homeButton}>
          <Text style={styles.homeButtonText}>
            Return to Home
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9F8",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },

  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F9E3E5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  code: {
    fontSize: 54,
    fontWeight: "800",
    color: "#AE214D",
  },

  title: {
    marginTop: 6,
    fontSize: 24,
    fontWeight: "700",
    color: "#2B2224",
  },

  message: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    color: "#66585B",
  },

  homeButton: {
    marginTop: 28,
    width: 220,
    paddingVertical: 15,
    borderRadius: 10,
    backgroundColor: "#AE214D",
    textAlign: "center",
  },

  homeButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
});