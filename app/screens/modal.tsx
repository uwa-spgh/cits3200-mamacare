import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view'; // custom dependencies from expo, maybe use later

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text>This is an empty template for the app. Please add your screens under screens tab</Text>
      <Link href="/" dismissTo style={styles.link}>
        <Text>Go to home screen</Text>
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