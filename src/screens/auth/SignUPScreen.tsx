import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import AppSafeView from "../../components/views/AppSafeView";
import { sharedPaddingHorizontal } from "../../styles/sharedStyles";
import MamaCareLogo from "../../assets/icons";
import { s, vs } from "react-native-size-matters";
import AppText from "../../components/texts/AppText";
import AppTextInput from "../../components/inputs/AppTextInput";
import AppButton from "../../components/buttons/AppButton";
import { AppColors } from "../../styles/colors";
import { useNavigation } from "@react-navigation/native";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("")
  const navigation = useNavigation()

  return (
    <AppSafeView style={styles.container}>
      <MamaCareLogo style={styles.logo} />
      <AppTextInput placeholder="User Name" onChangeText={setUserName} />
      <AppTextInput placeholder="Email" onChangeText={setEmail} />
      <AppTextInput
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      />
      <AppButton title="Create New Account" style={styles.newAccountBtn} />
      <AppButton
        title="Go to Sign In"
        style={styles.goSignInBtn}
        textColor={AppColors.text_secondary}
        onPress={() => navigation.navigate("SignInScreen")}
      />
    </AppSafeView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: sharedPaddingHorizontal,
  },
  logo: {
    width: s(400),
    height: vs(400),
    marginTop: vs(30),
  },

  newAccountBtn: {
    marginTop: s(50),
  },

  goSignInBtn: {
    backgroundColor: AppColors.bg_button_secondary,
    borderColor: AppColors.stroke_primary,
    borderWidth: s(2),
    marginVertical: vs(10),
  },
});
