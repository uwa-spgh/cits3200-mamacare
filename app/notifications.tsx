import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Stack, router } from "expo-router";

type IoniconName = ComponentProps<typeof Ionicons>['name'];

type Notification = {
  title: string;
  message: string;
  time: string;
  icon: IoniconName;
  color: string;
};

const notifications: Notification[] = [
  {
    title: 'Upcoming ANC Visit',
    message: 'Your next Antenatal Care visit is scheduled for tomorrow at 10:00 AM.',
    time: '2 hours ago',
    icon: 'calendar',
    color: '#D6336C',
  },
  {
    title: 'Medication Reminder',
    message: 'Time for your Folic Acid supplement. Remember to take it with food.',
    time: '5 hours ago',
    icon: 'medkit-outline',
    color: '#009447',
  },
  {
    title: 'Daily Health Tip',
    message: "Check out today's nutrition tip: The importance of Iron in your third trimester.",
    time: 'Yesterday, 9:00 AM',
    icon: 'alert',
    color: '#55CFC5',
  },
  {
    title: 'Milestone Reached!',
    message: "You've completed 60% of your pregnancy journey! Keep up the great work.",
    time: 'Mon, Oct 12',
    icon: 'star',
    color: '#4F9650',
  },
];

export default function NotificationsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.screenTitle}>Notifications</Text>

        <View style={styles.headingRow}>
          <Text style={styles.heading}>Updates</Text>
          <Text style={styles.markRead}>Mark all as read</Text>
        </View>

        <Text style={styles.date}>Today</Text>
        <NotificationCard notification={notifications[0]} unread />
        <NotificationCard notification={notifications[1]} unread />

        <Text style={styles.date}>Yesterday</Text>
        <NotificationCard notification={notifications[2]} />

        <Text style={styles.date}>Earlier</Text>
        <NotificationCard notification={notifications[3]} />
      </ScrollView>
    </SafeAreaView>
  );
}

function NotificationCard({
  notification,
  unread = false,
}: {
  notification: (typeof notifications)[number];
  unread?: boolean;
}) {
  return (
    <View style={styles.notification}>
      <View style={[styles.notificationIcon, { backgroundColor: notification.color }]}>
        <Ionicons
          name={notification.icon}
          size={17}
          color="#FFFFFF"
        />
      </View>
      <View style={styles.notificationBody}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.time}>{notification.time}</Text>
      </View>
      {unread && <View style={styles.unread} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8F8' },
    header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#E8D8DC",
    backgroundColor: "#FFF9F8",
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2B2224",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: "#B62555",
  },

  headerRightSpace: {
    width: 40,
  },
  title: {
    flex: 1,
    marginLeft: 18,
    fontSize: 17,
    fontWeight: '700',
    color: '#C2185B',
  },
  profile: { marginRight: 18, fontSize: 20 },
  settings: { fontSize: 20 },
  content: { padding: 18 },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2B2224",
  },

  markRead: {
    fontSize: 14,
    fontWeight: "600",
    color: "#AE214D",
  },

  date: {
    marginTop: 22,
    paddingBottom: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#E8CDD3",
    fontSize: 14,
    fontWeight: "600",
    color: "#66585B",
  },
  notification: {
    minHeight: 108,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F0D9DE',
    backgroundColor: '#FFF3F4',
  },
  notificationIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
  },
  iconText: { color: '#FFFFFF', fontSize: 17 },
  notificationBody: { flex: 1, marginLeft: 10 },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2B2224",
  },
  message: {
    marginTop: 5,
    fontSize: 14,
    lineHeight: 21,
    color: "#444",
  },
  time: {
    marginTop: 6,
    fontSize: 12,
    color: "#66585B",
  },
});