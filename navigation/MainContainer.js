import * as React from 'react';

import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import Ionicons from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../style/colors';

//screens
import HomeScreen from "./screens/HomeScreen"
import ProfileScreen from "./screens/ProfileScreen"
import LoginScreen from "./screens/LoginScreen"
import LibraryScreen from './screens/LibraryScreen';

//Screen names
const homeName = 'Home';
const profileName = 'Profile';
const libraryName = 'Library'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator
    initialRouteName={homeName}
      screenOptions={({ route }) => ({

        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconColor;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? 'home' : 'home-outline';
            iconColor = focused ? COLORS.darkBlue : COLORS.grey;
          } else if (rn === profileName) {
            iconName = focused ? 'person' : 'person-outline';
            iconColor = focused ? COLORS.darkBlue : COLORS.grey;
          } else if (rn === libraryName) {
            iconName = focused ? 'list' : 'list-outline';
            iconColor = focused ? COLORS.darkBlue : COLORS.grey;
          }

          return <Ionicons name={iconName} size={size} color={iconColor}></Ionicons>
        },
        tabBarActiveTintColor: COLORS.darkBlue,
        tabBarInactiveTintColor: COLORS.grey,
        tabBarLabelStyle: {paddingBottom: 5, fontSize: 12, fontWeight: '600'},
        tabBarStyle: {padding: 5, height: 50, backgroundColor: COLORS.lightGreen}
      })}

      >

      <Tab.Screen options={{headerShown: false}} name={homeName} component={HomeScreen}></Tab.Screen>
      <Tab.Screen options={{headerShown: false}} name={libraryName} component={LibraryScreen}></Tab.Screen>
      <Tab.Screen options={{headerShown: false}} name={profileName} component={ProfileScreen}></Tab.Screen>
  
    </Tab.Navigator>
  );
}

export default function MainContainer() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}



/*
<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="LoginScreen" component={LoginScreen}></Stack.Screen>
        <Stack.Screen options={{ title: "Home", headerLeft: null }} name="HomeScreen" component={HomeScreen}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
    */