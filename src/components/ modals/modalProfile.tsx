import React, { FC, useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { AppColors } from '../../styles/colors';
import {s, vs} from 'react-native-size-matters'
import AppText from '../texts/AppText';
import { AppFonts } from '../../styles/fonts';

interface ModalProps {
    visible: boolean;
    initialValue: string;
    onSubmit: (name:string) => void;
    onClose: () => void;
}

const NameInputModal: FC<ModalProps> = ({ visible, initialValue, onSubmit, onClose }) => {
  const [name, setName] = useState(initialValue);

  const handleSubmit = () => {
    onSubmit(name);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            style={styles.input}
            autoFocus
          />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose}>
                <AppText style={
                    {
                        fontFamily: AppFonts.Heading1Bold,
                        color: AppColors.button_primary_accent
                    }
                }>Cancel</AppText>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} >
                <AppText style={
                    {
                        fontFamily: AppFonts.Heading1Bold,
                        color: AppColors.button_primary_accent
                    }
                }>Save</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NameInputModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  container: {
    width: '80%',
    backgroundColor: AppColors.white,
    padding: s(20),
    borderRadius: s(10),
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.stroke_primary,
    padding: s(10),
    borderRadius: s(5),
    marginBottom: s(20),
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
});