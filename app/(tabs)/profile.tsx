import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <Text style={styles.body}>Your profile details will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#FFF8F8',
  },
  title: {
    color: '#AE214D',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  body: {
    color: '#4F343B',
    fontSize: 16,
  },
});
