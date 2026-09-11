import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useMedications } from "../../context/MedicationContext";

export default function MedicationHistoryScreen() {
    const { adherenceHistory } = useMedications();

    return (
        <ScrollView
            style={styles.screen}
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.headerRow}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace("/medication")}
                    hitSlop={{
                        top: 15,
                        bottom: 15,
                        left: 15,
                        right: 15,
                    }}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color="#AE214D"
                    />
                </TouchableOpacity>

                <Text style={styles.title}>
                    Adherence History
                </Text>
            </View>

            {adherenceHistory.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons
                        name="time-outline"
                        size={40}
                        color="#C78A9D"
                    />

                    <Text style={styles.emptyTitle}>
                        No medication history yet
                    </Text>

                    <Text style={styles.emptyText}>
                        Medication activity will appear here when
                        medications are marked as taken or missed.
                    </Text>
                </View>
            ) : (
                adherenceHistory.map((record) => (
                    <View
                        key={record.id}
                        style={styles.historyCard}
                    >
                        <View
                            style={[
                                styles.statusIcon,
                                record.status === "taken"
                                    ? styles.takenIcon
                                    : styles.missedIcon,
                            ]}
                        >
                            <Ionicons
                                name={
                                    record.status === "taken"
                                        ? "checkmark"
                                        : "close"
                                }
                                size={18}
                                color="#FFFFFF"
                            />
                        </View>

                        <View style={styles.historyContent}>
                            <Text style={styles.medicationName}>
                                {record.medicationName}
                            </Text>

                            <Text style={styles.historyDetails}>
                                {record.date} • {record.time}
                            </Text>

                            <Text
                                style={[
                                    styles.statusText,
                                    record.status === "taken"
                                        ? styles.takenText
                                        : styles.missedText,
                                ]}
                            >
                                {record.status === "taken"
                                    ? "Taken"
                                    : "Missed"}
                            </Text>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#FFF8F8",
    },

    container: {
        padding: 20,
        paddingBottom: 40,
    },

    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },

    backButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },

    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#AE214D",
    },

    emptyContainer: {
        marginTop: 80,
        alignItems: "center",
        paddingHorizontal: 20,
    },

    emptyTitle: {
        marginTop: 14,
        fontSize: 17,
        fontWeight: "700",
        color: "#4A373C",
    },

    emptyText: {
        marginTop: 8,
        fontSize: 13,
        color: "#78666C",
        textAlign: "center",
        lineHeight: 19,
    },

    historyCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFF9FA",
        borderWidth: 1,
        borderColor: "#EDD0D7",
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
    },

    statusIcon: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },

    takenIcon: {
        backgroundColor: "#62A96F",
    },

    missedIcon: {
        backgroundColor: "#D66A5A",
    },

    historyContent: {
        flex: 1,
    },

    medicationName: {
        fontSize: 14,
        fontWeight: "700",
        color: "#3E3034",
    },

    historyDetails: {
        fontSize: 12,
        color: "#78666C",
        marginTop: 3,
    },

    statusText: {
        fontSize: 12,
        fontWeight: "700",
        marginTop: 5,
    },

    takenText: {
        color: "#57A868",
    },

    missedText: {
        color: "#C95043",
    },
});