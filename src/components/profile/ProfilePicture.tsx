import { StyleSheet, TouchableOpacity, View } from "react-native";
import { s, vs } from "react-native-size-matters";
import { Image } from "expo-image";
import React from "react";
import { AppColors } from "../../styles/colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { setProfilePicture } from "../../store/reducers/dataReducers";

const ProfilePicture = () => {
  const dispatch = useDispatch();

  const userPicture = useSelector(
    (state: { dataReducer: { userPicture: string } }) =>
      state.dataReducer.userPicture,
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      dispatch(setProfilePicture(result.assets[0].uri));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.9} style={styles.edit}>
        <MaterialIcons
          name="edit"
          size={s(20)}
          color={AppColors.white}
          onPress={pickImage}
        />
      </TouchableOpacity>

      {userPicture ? (
        <Image source={{ uri: userPicture }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <MaterialIcons
            name="person"
            size={s(60)}
            color={AppColors.white}
          />
        </View>
      )}
    </View>
  );
};

export default ProfilePicture;

const styles = StyleSheet.create({
  container: {
    height: vs(100),
    width: s(100),
  },

  image: {
    width: "100%",
    height: "100%",
    borderRadius: s(50),
  },

  placeholder: {
    width: "100%",
    height: "100%",
    borderRadius: s(50),
    backgroundColor: AppColors.bg_button_secondary,
    justifyContent: "center",
    alignItems: "center",
  },

  edit: {
    justifyContent: "center",
    alignItems: "center",
    height: vs(26),
    width: s(26),
    borderRadius: s(13),
    backgroundColor: AppColors.button_primary_accent,
    position: "absolute",
    zIndex: 1,
    bottom: 1,
    right: 1,
  },
});