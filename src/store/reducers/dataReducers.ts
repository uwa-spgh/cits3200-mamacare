import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { GestationSource } from "../../types/types";

export type PersonalInformation = {
  fullName: string;
  dateOfBirth: string | null;
  height: string;
  weight: string;
  gender: string;
  phoneNumber: string;
};

export type EmergencyContact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  address: string;
  isNextOfKin: boolean;
  contactInEmergency: boolean;
};

const initialPersonalInformation: PersonalInformation = {
  fullName: "",
  dateOfBirth: null,
  height: "",
  weight: "",
  gender: "",
  phoneNumber: "",
};

const initialState = {
  language: "en",
  userName: "",
  userPicture: "",
  edd: "",
  lmp: "",
  gestationSource: "auto",
  birthDate: "",
  dismissedBirthPromptAt: "",
  personalInformation: initialPersonalInformation,
  emergencyContacts: [] as EmergencyContact[],
};

export const dataReducer = createSlice({
  name: "dataReducer",
  initialState: initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setPersonalInformation: (
      state,
      action: PayloadAction<PersonalInformation>,
    ) => {
      state.personalInformation = action.payload;
      state.userName = action.payload.fullName;
    },
    setEmergencyContacts: (
      state,
      action: PayloadAction<EmergencyContact[]>,
    ) => {
      state.emergencyContacts = action.payload;
    },
    setEdd: (state, action: PayloadAction<string>) => {
      state.edd = action.payload;
    },
    setProfilePicture: (state, action: PayloadAction<string>) => {
      state.userPicture = action.payload
    },
    setLmp: (state, action: PayloadAction<string>) => {
      state.lmp = action.payload;
    },
    setGestationSource: (state, action: PayloadAction<GestationSource>) => {
      state.gestationSource = action.payload;
    },
    setBirthDate: (state, action: PayloadAction<string>) => {
      state.birthDate = action.payload;
      state.dismissedBirthPromptAt = ""; // reset so future prompts can fire
    },
    clearBirthDate: (state) => {
      state.birthDate = "";
    },
    setDismissedBirthPromptAt: (state, action: PayloadAction<string>) => {
      state.dismissedBirthPromptAt = action.payload;
    },
    resetData: () => initialState,
  },
});

export const {
  setLanguage,
  setUserName,
  setPersonalInformation,
  setEmergencyContacts,
  setEdd,
  setProfilePicture,
  resetData,
} = dataReducer.actions;

export default dataReducer.reducer;

