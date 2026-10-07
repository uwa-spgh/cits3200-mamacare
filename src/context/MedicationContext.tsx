import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    MEDICATION_STORAGE_KEY,
    syncAllNotifications,
} from "../notifications/notificationService";
import { localDateKey, parseMedicationTime } from "../notifications/planning";

const ADHERENCE_HISTORY_STORAGE_KEY = "mamacare_adherence_history";

export type Period = "Morning" | "Afternoon" | "Evening";

export type Medication = {
    id: string;
    name: string;
    dosage: string;
    instructions: string;
    time: string;
    period: Period;
    taken: boolean;
    missed: boolean;
    statusDate?: string;
    createdDate: string;
};

export type AdherenceRecord = {
    id: string;
    medicationId: string;
    medicationName: string;
    date: string;
    time: string;
    status: "taken" | "missed";
};

type NewMedication = {
    name: string;
    dosage: string;
    instructions: string;
    time: string;
    period: Period;
};

type MedicationContextType = {
    medications: Medication[];
    adherenceHistory: AdherenceRecord[];

    addMedication: (medication: NewMedication) => void;

    toggleMedicationTaken: (
        id: string,
        date: string,
    ) => void;

    markMedicationMissed: (id: string) => void;

    removeMedication: (id: string) => void;

    updateMedication: (
        id: string,
        updates: Partial<Medication>
    ) => void;
};

const MedicationContext = createContext<
    MedicationContextType | undefined
>(undefined);

const initialMedications: Medication[] = [];

function isMedicationPastDue(time: string) {
    const parsedTime = parseMedicationTime(time);
    if (!parsedTime) {
        return false;
    }

    const scheduledMinutes = parsedTime.hour * 60 + parsedTime.minute;

    const now = new Date();
    const currentMinutes =
        now.getHours() * 60 + now.getMinutes();

    return currentMinutes > scheduledMinutes;
}

type MedicationProviderProps = {
    children: ReactNode;
};

export function MedicationProvider({
    children,
}: MedicationProviderProps) {
    const [medications, setMedications] =
        useState<Medication[]>(initialMedications);
    const [hasLoadedState, setHasLoadedState] = useState(false);

    const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

    const [adherenceHistory, setAdherenceHistory] =
        useState<AdherenceRecord[]>([]);


    const dateFromKey = (dateKey: string) => {
        const [year, month, day] = dateKey
            .split("-")
            .map(Number);

        return new Date(year, month - 1, day);
    };

    const normalizeDailyStatus = (items: Medication[]) => {
        const today = localDateKey(new Date());

        return items.map((medication) =>
            medication.statusDate &&
                medication.statusDate !== today
                ? {
                    ...medication,
                    taken: false,
                    missed: false,
                    statusDate: today,
                    createdDate:
                        medication.createdDate ??
                        localDateKey(new Date()),
                }
                : {
                    ...medication,
                    statusDate:
                        medication.statusDate ?? today,
                    createdDate:
                        medication.createdDate ??
                        localDateKey(new Date()),
                },
        );
    };


    const addMedication = (medication: NewMedication) => {
        const newMedication: Medication = {
            id: Date.now().toString(),

            name: medication.name,
            dosage: medication.dosage,
            instructions: medication.instructions,
            time: medication.time,
            period: medication.period,

            taken: false,
            missed: false,
            statusDate: localDateKey(new Date()),
            createdDate: localDateKey(new Date()),
        };

        setMedications((currentMedications) => [
            ...currentMedications,
            newMedication,
        ]);
    };

    const updateMedication = (
        id: string,
        updates: Partial<Medication>) => {
        setMedications((currentMedications) =>
            currentMedications.map((medication) =>
                medication.id === id
                    ? {
                        ...medication,
                        ...updates,
                    }
                    : medication
            )
        );
    };

    useEffect(() => {
        if (!hasLoadedState || !hasLoadedHistory) {
            return;
        }

        const today = localDateKey(new Date());

        setAdherenceHistory((currentHistory) => {
            const updatedHistory = [...currentHistory];

            medications.forEach((medication) => {
                const currentDate =
                    dateFromKey(medication.createdDate);

                while (localDateKey(currentDate) < today) {
                    const dateKey = localDateKey(currentDate);

                    const existingRecord =
                        updatedHistory.some(
                            (record) =>
                                record.medicationId === medication.id &&
                                record.date === dateKey,
                        );

                    if (!existingRecord) {
                        updatedHistory.push({
                            id: `missed-${medication.id}-${dateKey}`,
                            medicationId: medication.id,
                            medicationName: medication.name,
                            date: dateKey,
                            time: medication.time,
                            status: "missed",
                        });
                    }

                    currentDate.setDate(
                        currentDate.getDate() + 1,
                    );
                }
            });

            return updatedHistory;
        });
    }, [
        hasLoadedState,
        hasLoadedHistory,
        medications,
    ]);

    const toggleMedicationTaken = (
        id: string,
        selectedDate: string,
    ) => {
        const medication = medications.find(
            (item) => item.id === id,
        );

        if (!medication) {
            return;
        }

        const today = localDateKey(new Date());

        const existingRecord = adherenceHistory.find(
            (record) =>
                record.medicationId === medication.id &&
                record.date === selectedDate,
        );

        const newTakenStatus =
            existingRecord?.status !== "taken";

        const isPastDate = selectedDate < today;

        const shouldBeMissed =
            !newTakenStatus &&
            (isPastDate || isMedicationPastDue(medication.time));

        // Only update the medication's current-day visual state
        // when the user is editing today.
        if (selectedDate === today) {
            setMedications((currentMedications) =>
                currentMedications.map((item) =>
                    item.id === id
                        ? {
                            ...item,
                            taken: newTakenStatus,
                            missed: shouldBeMissed,
                            statusDate: today,
                        }
                        : item,
                ),
            );
        }

        setAdherenceHistory((currentHistory) => {
            const cleanedHistory = currentHistory.filter(
                (record) =>
                    !(
                        record.medicationId === medication.id &&
                        record.date === selectedDate
                    ),
            );

            if (newTakenStatus) {
                const takenRecord: AdherenceRecord = {
                    id:
                        Date.now().toString() +
                        medication.id +
                        selectedDate,
                    medicationId: medication.id,
                    medicationName: medication.name,
                    date: selectedDate,
                    time: medication.time,
                    status: "taken",
                };

                return [
                    takenRecord,
                    ...cleanedHistory,
                ];
            }

            if (shouldBeMissed) {
                const missedRecord: AdherenceRecord = {
                    id:
                        Date.now().toString() +
                        medication.id +
                        selectedDate,
                    medicationId: medication.id,
                    medicationName: medication.name,
                    date: selectedDate,
                    time: medication.time,
                    status: "missed",
                };

                return [
                    missedRecord,
                    ...cleanedHistory,
                ];
            }

            return cleanedHistory;
        });
    };

    const markMedicationMissed = (id: string) => {
        const medication = medications.find(
            (item) => item.id === id
        );

        if (!medication || medication.taken) {
            return;
        }

        const today = localDateKey(new Date());
        const statusDate = today;

        setMedications((currentMedications) =>
            currentMedications.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        taken: false,
                        missed: true,
                        statusDate,
                    }
                    : item
            )
        );

        setAdherenceHistory((currentHistory) => {
            const cleanedHistory = currentHistory.filter(
                (record) =>
                    !(
                        record.medicationId === medication.id &&
                        record.date === today
                    )
            );

            const missedRecord: AdherenceRecord = {
                id: Date.now().toString(),
                medicationId: medication.id,
                medicationName: medication.name,
                date: today,
                time: medication.time,
                status: "missed",
            };

            return [
                missedRecord,
                ...cleanedHistory,
            ];
        });
    };

    useEffect(() => {
        let isMounted = true;

        AsyncStorage.getItem(MEDICATION_STORAGE_KEY)
            .then((value) => {
                if (!isMounted) {
                    return;
                }

                const stored = value
                    ? (JSON.parse(value) as Medication[])
                    : initialMedications;
                setMedications(normalizeDailyStatus(stored));
            })
            .catch(() => undefined)
            .finally(() => {
                if (isMounted) {
                    setHasLoadedState(true);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!hasLoadedState) {
            return;
        }

        AsyncStorage.setItem(MEDICATION_STORAGE_KEY, JSON.stringify(medications))
            .then(() => syncAllNotifications())
            .catch(() => undefined);
    }, [hasLoadedState, medications]);

    useEffect(() => {
        let isMounted = true;

        AsyncStorage.getItem(ADHERENCE_HISTORY_STORAGE_KEY)
            .then((value) => {
                if (!isMounted) {
                    return;
                }

                const storedHistory = value
                    ? (JSON.parse(value) as AdherenceRecord[])
                    : [];

                setAdherenceHistory(storedHistory);
            })
            .catch(() => undefined)
            .finally(() => {
                if (isMounted) {
                    setHasLoadedHistory(true);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        if (!hasLoadedHistory) {
            return;
        }

        AsyncStorage.setItem(
            ADHERENCE_HISTORY_STORAGE_KEY,
            JSON.stringify(adherenceHistory),
        ).catch(() => undefined);
    }, [hasLoadedHistory, adherenceHistory]);

    useEffect(() => {
        AsyncStorage.setItem(
            ADHERENCE_HISTORY_STORAGE_KEY,
            JSON.stringify(adherenceHistory),
        ).catch(() => undefined);
    }, [adherenceHistory]);

    useEffect(() => {
        const resetForNewDay = () => {
            setMedications((current) => normalizeDailyStatus(current));
        };

        const appStateListener = AppState.addEventListener("change", (state) => {
            if (state === "active") {
                resetForNewDay();
            }
        });
        const interval = setInterval(resetForNewDay, 60000);

        return () => {
            appStateListener.remove();
            clearInterval(interval);
        };
    }, []);

    const removeMedication = (id: string) => {
        setMedications((currentMedications) =>
            currentMedications.filter(
                (medication) => medication.id !== id,
            ),
        );
    };

    useEffect(() => {
        const checkForMissedMedications = () => {
            const today = localDateKey(new Date());

            setMedications((currentMedications) => {
                const newlyMissed = currentMedications.filter(
                    (medication) =>
                        !medication.taken &&
                        !medication.missed &&
                        isMedicationPastDue(medication.time)
                );

                if (newlyMissed.length === 0) {
                    return currentMedications;
                }

                setAdherenceHistory((currentHistory) => {
                    const newRecords = newlyMissed
                        .filter(
                            (medication) =>
                                !currentHistory.some(
                                    (record) =>
                                        record.medicationId === medication.id &&
                                        record.date === today &&
                                        record.status === "missed"
                                )
                        )
                        .map((medication) => ({
                            id: Date.now().toString() + medication.id,
                            medicationId: medication.id,
                            medicationName: medication.name,
                            date: today,
                            time: medication.time,
                            status: "missed" as const,
                        }));

                    return [
                        ...newRecords,
                        ...currentHistory,
                    ];
                });

                return currentMedications.map((medication) =>
                    newlyMissed.some(
                        (missedMedication) =>
                            missedMedication.id === medication.id
                    )
                        ? {
                            ...medication,
                            missed: true,
                        }
                        : medication
                );
            });
        };

        checkForMissedMedications();

        const interval = setInterval(
            checkForMissedMedications,
            60000
        );

        return () => clearInterval(interval);
    }, []);

    return (
        <MedicationContext.Provider
            value={{
                medications,
                adherenceHistory,
                addMedication,
                updateMedication,
                toggleMedicationTaken,
                markMedicationMissed,
                removeMedication,
            }}
        >
            {children}
        </MedicationContext.Provider>
    );
}

export function useMedications() {
    const context = useContext(MedicationContext);

    if (!context) {
        throw new Error(
            "useMedications must be used inside MedicationProvider"
        );
    }

    return context;
}
