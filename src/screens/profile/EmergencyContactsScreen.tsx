import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";

const EMERGENCY_CONTACTS_STORAGE_KEY = "@mamacare/emergency-contacts";

type EmergencyContact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  address: string;
  isNextOfKin: boolean;
  contactInEmergency: boolean;
};

export default function EmergencyContactsScreen() {
  const { t } = useTranslation();

  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isNextOfKin, setIsNextOfKin] = useState(false);
  const [contactInEmergency, setContactInEmergency] = useState(true);

  useEffect(() => {
    const loadContacts = async () => {
      try {
        const savedContacts = await AsyncStorage.getItem(
          EMERGENCY_CONTACTS_STORAGE_KEY,
        );

        if (savedContacts) {
          const parsedContacts = JSON.parse(savedContacts);

          if (Array.isArray(parsedContacts)) {
            setContacts(parsedContacts);
          }
        }
      } catch {
        Alert.alert(
          t("emergencyContactsScreen.loadErrorTitle"),
          t("emergencyContactsScreen.loadErrorMessage"),
        );
      }
    };

    loadContacts();
  }, [t]);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRelationship("");
    setPhone("");
    setAddress("");
    setIsNextOfKin(false);
    setContactInEmergency(true);
  };

  const saveContacts = async (nextContacts: EmergencyContact[]) => {
    await AsyncStorage.setItem(
      EMERGENCY_CONTACTS_STORAGE_KEY,
      JSON.stringify(nextContacts),
    );
    setContacts(nextContacts);
  };

  const handleSave = async () => {
    const trimmedName = name.trim();
    const trimmedRelationship = relationship.trim();
    const trimmedPhone = phone.trim();
    const trimmedAddress = address.trim();

    if (
      !trimmedName ||
      !trimmedRelationship ||
      !trimmedPhone ||
      !trimmedAddress
    ) {
      Alert.alert(
        t("emergencyContactsScreen.missingInformation"),
        t("emergencyContactsScreen.missingInformationMessage"),
      );
      return;
    }

    const namePattern = /^[\p{L}\p{M}' -]+$/u;
    const phonePattern = /^[0-9+() -]+$/;

    if (!namePattern.test(trimmedName)) {
      Alert.alert(
        t("emergencyContactsScreen.invalidNameTitle"),
        t("emergencyContactsScreen.invalidNameMessage"),
      );
      return;
    }

    if (!phonePattern.test(trimmedPhone)) {
      Alert.alert(
        t("emergencyContactsScreen.invalidPhoneTitle"),
        t("emergencyContactsScreen.invalidPhoneMessage"),
      );
      return;
    }

    const contact: EmergencyContact = {
      id: editingId ?? Date.now().toString(),
      name: trimmedName,
      relationship: trimmedRelationship,
      phone: trimmedPhone,
      address: trimmedAddress,
      isNextOfKin,
      contactInEmergency,
    };

    const nextContacts = editingId
      ? contacts.map((existingContact) =>
          existingContact.id === editingId ? contact : existingContact,
        )
      : [...contacts, contact];

    try {
      await saveContacts(nextContacts);

      Alert.alert(
        editingId
          ? t("emergencyContactsScreen.contactUpdated")
          : t("emergencyContactsScreen.contactSaved"),
        t("emergencyContactsScreen.contactSavedMessage"),
      );

      resetForm();
    } catch {
      Alert.alert(
        t("emergencyContactsScreen.saveErrorTitle"),
        t("emergencyContactsScreen.saveErrorMessage"),
      );
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setEditingId(contact.id);
    setName(contact.name);
    setRelationship(contact.relationship);
    setPhone(contact.phone);
    setAddress(contact.address);
    setIsNextOfKin(contact.isNextOfKin);
    setContactInEmergency(contact.contactInEmergency);
  };

  const handleDelete = (contact: EmergencyContact) => {
    Alert.alert(
      t("emergencyContactsScreen.deleteContactTitle"),
      t("emergencyContactsScreen.deleteContactMessage", {
        name: contact.name,
      }),
      [
        {
          text: t("emergencyContactsScreen.cancel"),
          style: "cancel",
        },
        {
          text: t("emergencyContactsScreen.delete"),
          style: "destructive",
          onPress: async () => {
            try {
              const nextContacts = contacts.filter(
                (existingContact) => existingContact.id !== contact.id,
              );

              await saveContacts(nextContacts);

              if (editingId === contact.id) {
                resetForm();
              }
            } catch {
              Alert.alert(
                t("emergencyContactsScreen.deleteErrorTitle"),
                t("emergencyContactsScreen.deleteErrorMessage"),
              );
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.description}>
        {t("emergencyContactsScreen.description")}
      </Text>

      <Text style={styles.sectionTitle}>
        {t("emergencyContactsScreen.savedContacts")}
      </Text>

      {contacts.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>
            {t("emergencyContactsScreen.noContactsTitle")}
          </Text>
          <Text style={styles.emptyText}>
            {t("emergencyContactsScreen.noContactsDescription")}
          </Text>
        </View>
      ) : (
        contacts.map((contact) => (
          <View key={contact.id} style={styles.contactCard}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <Text style={styles.contactDetail}>{contact.relationship}</Text>
            <Text style={styles.contactDetail}>{contact.phone}</Text>
            <Text style={styles.contactDetail}>{contact.address}</Text>

            <View style={styles.badgeRow}>
              {contact.isNextOfKin ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {t("emergencyContactsScreen.nextOfKinBadge")}
                  </Text>
                </View>
              ) : null}

              {contact.contactInEmergency ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {t("emergencyContactsScreen.emergencyContactBadge")}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={styles.contactActions}>
              <Pressable
                accessibilityRole="button"
                onPress={() => handleEdit(contact)}
                style={styles.editButton}
              >
                <Text style={styles.editButtonText}>
                  {t("emergencyContactsScreen.edit")}
                </Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => handleDelete(contact)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>
                  {t("emergencyContactsScreen.delete")}
                </Text>
              </Pressable>
            </View>
          </View>
        ))
      )}

      <Text style={styles.sectionTitle}>
        {editingId
          ? t("emergencyContactsScreen.editContact")
          : t("emergencyContactsScreen.addEmergencyContact")}
      </Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>
          {t("emergencyContactsScreen.fullName")}
        </Text>
        <TextInput
          accessibilityLabel={t("emergencyContactsScreen.fullName")}
          autoCapitalize="words"
          onChangeText={(text) =>
            setName(text.replace(/[^\p{L}\p{M}' -]/gu, ""))
          }
          placeholder={t("emergencyContactsScreen.namePlaceholder")}
          style={styles.input}
          value={name}
        />

        <Text style={styles.label}>
          {t("emergencyContactsScreen.relationship")}
        </Text>
        <TextInput
          accessibilityLabel={t("emergencyContactsScreen.relationship")}
          autoCapitalize="words"
          onChangeText={setRelationship}
          placeholder={t(
            "emergencyContactsScreen.relationshipPlaceholder",
          )}
          style={styles.input}
          value={relationship}
        />

        <Text style={styles.label}>
          {t("emergencyContactsScreen.phoneNumber")}
        </Text>
        <TextInput
          accessibilityLabel={t("emergencyContactsScreen.phoneNumber")}
          keyboardType="phone-pad"
          onChangeText={(text) =>
            setPhone(text.replace(/[^0-9+() -]/g, ""))
          }
          placeholder={t("emergencyContactsScreen.phonePlaceholder")}
          style={styles.input}
          value={phone}
        />

        <Text style={styles.label}>
          {t("emergencyContactsScreen.address")}
        </Text>
        <TextInput
          accessibilityLabel={t("emergencyContactsScreen.address")}
          autoCapitalize="words"
          multiline
          onChangeText={setAddress}
          placeholder={t("emergencyContactsScreen.addressPlaceholder")}
          style={[styles.input, styles.addressInput]}
          textAlignVertical="top"
          value={address}
        />

        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchTitle}>
              {t("emergencyContactsScreen.nextOfKin")}
            </Text>
            <Text style={styles.switchDescription}>
              {t("emergencyContactsScreen.nextOfKinDescription")}
            </Text>
          </View>

          <Switch
            accessibilityLabel={t("emergencyContactsScreen.nextOfKin")}
            onValueChange={setIsNextOfKin}
            trackColor={{ false: "#D8CDD0", true: "#E9AFC0" }}
            thumbColor={isNextOfKin ? "#B62555" : "#FFFFFF"}
            value={isNextOfKin}
          />
        </View>

        <View style={styles.switchRow}>
          <View style={styles.switchTextContainer}>
            <Text style={styles.switchTitle}>
              {t("emergencyContactsScreen.contactInEmergency")}
            </Text>
            <Text style={styles.switchDescription}>
              {t(
                "emergencyContactsScreen.contactInEmergencyDescription",
              )}
            </Text>
          </View>

          <Switch
            accessibilityLabel={t(
              "emergencyContactsScreen.contactInEmergency",
            )}
            onValueChange={setContactInEmergency}
            trackColor={{ false: "#D8CDD0", true: "#A9D5C9" }}
            thumbColor={contactInEmergency ? "#087D67" : "#FFFFFF"}
            value={contactInEmergency}
          />
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={handleSave}
          style={styles.saveButton}
        >
          <Text style={styles.saveButtonText}>
            {editingId
              ? t("emergencyContactsScreen.saveChanges")
              : t("emergencyContactsScreen.addContact")}
          </Text>
        </Pressable>

        {editingId ? (
          <Pressable
            accessibilityRole="button"
            onPress={resetForm}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>
              {t("emergencyContactsScreen.cancelEditing")}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFF9F8",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  description: {
    color: "#66585B",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#2B2224",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 12,
    marginTop: 8,
  },
  emptyCard: {
    backgroundColor: "#FBEAEC",
    borderColor: "#F1CDD3",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    padding: 18,
  },
  emptyTitle: {
    color: "#30272A",
    fontSize: 15,
    fontWeight: "700",
  },
  emptyText: {
    color: "#66585B",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },
  contactCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E0BEC4",
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
    padding: 16,
  },
  contactName: {
    color: "#2B2224",
    fontSize: 17,
    fontWeight: "700",
  },
  contactDetail: {
    color: "#66585B",
    fontSize: 14,
    marginTop: 5,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  badge: {
    backgroundColor: "#F9E3E5",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: "#9F204A",
    fontSize: 12,
    fontWeight: "600",
  },
  contactActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 15,
  },
  editButton: {
    alignItems: "center",
    backgroundColor: "#087D67",
    borderRadius: 7,
    flex: 1,
    paddingVertical: 10,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  deleteButton: {
    alignItems: "center",
    borderColor: "#B62555",
    borderRadius: 7,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 10,
  },
  deleteButtonText: {
    color: "#B62555",
    fontWeight: "700",
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E0BEC4",
    borderRadius: 12,
    borderWidth: 1,
    padding: 18,
  },
  label: {
    color: "#30272A",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#B98B98",
    borderRadius: 7,
    borderWidth: 1,
    color: "#33252A",
    fontSize: 14,
    marginBottom: 16,
    minHeight: 46,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addressInput: {
    minHeight: 84,
  },
  switchRow: {
    alignItems: "center",
    borderTopColor: "#EBCFD4",
    borderTopWidth: 1,
    flexDirection: "row",
    paddingVertical: 14,
  },
  switchTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  switchTitle: {
    color: "#30272A",
    fontSize: 14,
    fontWeight: "700",
  },
  switchDescription: {
    color: "#66585B",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 3,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: "#B62555",
    borderRadius: 8,
    marginTop: 10,
    paddingVertical: 13,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: "#66585B",
    fontSize: 14,
    fontWeight: "600",
  },
});