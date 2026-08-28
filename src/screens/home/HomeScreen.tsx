import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppSafeView from '../../components/views/AppSafeView'
import HomeHeader from '../../components/headers/HomeHeader'
import {s, vs} from 'react-native-size-matters'
import { AppFonts } from '../../styles/fonts'

const HomeScreen = () => {
  return (
    <AppSafeView>
      <HomeHeader/>
      <Text style={{fontSize: s(16), fontFamily: AppFonts.TextRegular}}>HomeScreen</Text>
    </AppSafeView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})