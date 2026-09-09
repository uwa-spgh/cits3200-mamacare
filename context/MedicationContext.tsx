import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

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

    toggleMedicationTaken: (id: string) => void;

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

const initialMedications: Medication[] = [
    {
        id: "1",
        name: "Iron & Folic Acid",
        dosage: "1 Pill",
        instructions: "With food",
        time: "8:00 AM",
        period: "Morning",
        taken: true,
        missed: false,
    },
    {
        id: "2",
        name: "Calcium Supplement",
        dosage: "2 Pills",
        instructions: "After lunch",
        time: "1:00 PM",
        period: "Afternoon",
        taken: false,
        missed: false,
    },
    {
        id: "3",
        name: "Prenatal Vitamin",
        dosage: "1 Pill",
        instructions: "Before bed",
        time: "9:00 PM",
        period: "Evening",
        taken: true,
        missed: false,
    },
];

function isMedicationPastDue(time: string) {
    const match = time
        .trim()
        .match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

    if (!match) {
        return false;
    }

    let hour = Number(match[1]);
    const minute = Number(match[2]);
    const period = match[3].toUpperCase();

    if (period === "AM" && hour === 12) {
        hour = 0;
    }

    if (period === "PM" && hour !== 12) {
        hour += 12;
    }

    const scheduledMinutes = hour * 60 + minute;

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
    
        const [adherenceHistory, setAdherenceHistory] =
        useState<AdherenceRecord[]>([]);

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

    const toggleMedicationTaken = (id: string) => {
        const medication = medications.find(
            (item) => item.id === id
        );

        if (!medication) {
            return;
        }

        const newTakenStatus = !medication.taken;
        const today = new Date().toLocaleDateString();

        const shouldBeMissed =
            !newTakenStatus &&
            isMedicationPastDue(medication.time);

        setMedications((currentMedications) =>
            currentMedications.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        taken: newTakenStatus,
                        missed: shouldBeMissed,
                    }
                    : item
            )
        );

        setAdherenceHistory((currentHistory) => {
            // Remove today's existing status for this medication first.
            const cleanedHistory = currentHistory.filter(
                (record) =>
                    !(
                        record.medicationId === medication.id &&
                        record.date === today
                    )
            );

            if (newTakenStatus) {
                const takenRecord: AdherenceRecord = {
                    id: Date.now().toString(),
                    medicationId: medication.id,
                    medicationName: medication.name,
                    date: today,
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

        const today = new Date().toLocaleDateString();

        setMedications((currentMedications) =>
            currentMedications.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        taken: false,
                        missed: true,
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

    const removeMedication = (id: string) => {
        setMedications((currentMedications) =>
            currentMedications.filter(
                (medication) => medication.id !== id
            )
        );

        setAdherenceHistory((currentHistory) =>
            currentHistory.filter(
                (record) => record.medicationId !== id
            )
        );
    };

    useEffect(() => {
        const checkForMissedMedications = () => {
            const today = new Date().toLocaleDateString();

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