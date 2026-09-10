import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function SettingsScreen() {
  const [appointments, setAppointments] = useState(true);
  const [medication, setMedication] = useState(true);
  const [tips, setTips] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.back}>‹</Text>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView>
        <Text style={styles.sectionTitle}>Account & Profile</Text>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowIcon}>
            <Ionicons 
              name = "person"
              size = {17}
              />
          </Text>
          <View style={styles.rowContent}>
            <Text style={styles.label}>Personal Information</Text>
            <Text style={styles.description}>Name, phone number, due date</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowIcon}>
            <Ionicons
              name = "image"
              size = {17}
              />
          </Text>
          <Text style={styles.label}>Change Profile Picture</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Text style={styles.subheading}>Language</Text>

          <View style={styles.languages}>
            <TouchableOpacity style={styles.selectedLanguage}>
              <Text>English</Text>
            </TouchableOpacity>
            <Text>नेपाली (Nepali)</Text>
          </View>

          <Text style={styles.subheading}>Notifications</Text>

          <SettingRow
            icon="▦"
            label="Appointment Reminders"
            value={appointments}
            onChange={setAppointments}
          />
          <SettingRow
            icon="▣"
            label="Medication Alerts"
            value={medication}
            onChange={setMedication}
          />
          <SettingRow
            icon="◌"
            label="Daily Tips"
            value={tips}
            onChange={setTips}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Support & Legal</Text>
          {['Help Center', 'Privacy Policy', 'Terms of Service', 'About MamaCare'].map(
            item => (
              <TouchableOpacity style={styles.row} key={item}>
                <Text style={styles.label}>{item}</Text>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ),
          )}
        </View>

        <TouchableOpacity style={styles.logout}>
          <Text style={styles.logoutText}>⇥  Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  label,
  value,
  onChange,
}: {
  icon: string;
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#D9DDE5', true: '#008C78' }}
        thumbColor={value ? '#2674E8' : '#FFFFFF'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F8' },
  header: {
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    borderBottomWidth: 1,
    borderBottomColor: '#E8D8DC',
    backgroundColor: '#FFF8F8',
  },
  back: { fontSize: 30, color: '#C2185B' },
  title: {
    flex: 1,
    marginLeft: 18,
    fontSize: 17,
    fontWeight: '700',
    color: '#C2185B',
  },
  icon: { fontSize: 22, color: '#333' },
  sectionTitle: {
    margin: 18,
    marginBottom: 10,
    fontSize: 13,
    color: '#333',
  },
  card: {
    marginTop: 1,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  row: {
    minHeight: 55,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    backgroundColor: '#FFFFFF',
  },
  rowContent: { flex: 1 },
  rowIcon: { width: 30, fontSize: 18, color: '#111' },
  label: { fontSize: 13, color: '#222' },
  description: { marginTop: 3, fontSize: 11, color: '#555' },
  arrow: { fontSize: 24, color: '#111' },
  subheading: {
    marginHorizontal: 18,
    marginTop: 10,
    marginBottom: 8,
    fontSize: 12,
    color: '#222',
  },
  languages: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 18,
  },
  selectedLanguage: {
    width: 110,
    padding: 9,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  settingRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  logout: {
    margin: 12,
    padding: 13,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  logoutText: { fontSize: 13, color: '#111' },
});

