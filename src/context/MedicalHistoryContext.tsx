import {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";

export type MedicalHistory = {
    conditions: string[];
    allergies: string[];
};

type MedicalHistoryContextType = {
    medicalHistory: MedicalHistory;
    saveMedicalHistory: (history: MedicalHistory) => void;
};

const MedicalHistoryContext = createContext<
    MedicalHistoryContextType | undefined
>(undefined);

const initialMedicalHistory: MedicalHistory = {
    conditions: [],
    allergies: [],
};

type MedicalHistoryProviderProps = {
    children: ReactNode;
};

export function MedicalHistoryProvider({
    children,
}: MedicalHistoryProviderProps) {
    const [medicalHistory, setMedicalHistory] =
        useState<MedicalHistory>(initialMedicalHistory);

    const saveMedicalHistory = (
        history: MedicalHistory,
    ) => {
        setMedicalHistory(history);
    };

    return (
        <MedicalHistoryContext.Provider
            value={{
                medicalHistory,
                saveMedicalHistory,
            }}
        >
            {children}
        </MedicalHistoryContext.Provider>
    );
}

export function useMedicalHistory() {
    const context = useContext(MedicalHistoryContext);

    if (!context) {
        throw new Error(
            "useMedicalHistory must be used inside MedicalHistoryProvider",
        );
    }

    return context;
}