import {
    createContext,
    ReactNode,
    useContext,
    useState,
} from "react";

export type PersonalInformation = {
    fullName: string;
    dateOfBirth: Date | null;
    height: string;
    weight: string;
    gender: string;
    phoneNumber: string;
};

type PersonalInformationContextType = {
    personalInformation: PersonalInformation;
    savePersonalInformation: (information: PersonalInformation) => void;
};

const PersonalInformationContext = createContext<
    PersonalInformationContextType | undefined
>(undefined);

const initialPersonalInformation: PersonalInformation = {
    fullName: "",
    dateOfBirth: null,
    height: "",
    weight: "",
    gender: "",
    phoneNumber: "",
};

type PersonalInformationProviderProps = {
    children: ReactNode;
};

export function PersonalInformationProvider({
    children,
}: PersonalInformationProviderProps) {
    const [personalInformation, setPersonalInformation] =
        useState<PersonalInformation>(initialPersonalInformation);

    const savePersonalInformation = (
        information: PersonalInformation,
    ) => {
        setPersonalInformation(information);
    };

    return (
        <PersonalInformationContext.Provider
            value={{
                personalInformation,
                savePersonalInformation,
            }}
        >
            {children}
        </PersonalInformationContext.Provider>
    );
}

export function usePersonalInformation() {
    const context = useContext(PersonalInformationContext);

    if (!context) {
        throw new Error(
            "usePersonalInformation must be used inside PersonalInformationProvider",
        );
    }

    return context;
}