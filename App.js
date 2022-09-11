import React, { useEffect, useState } from 'react';

import Home from './Home' 
import Favourite from './Favourite'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";

// Bottom Navigator for the bottom BAR
const Tab = createBottomTabNavigator(

);


const Stack = createNativeStackNavigator();


export default function App() {


return(
  

  <NavigationContainer>

    {/* TO change the color of the bottom navigator */}

<Tab.Navigator
         screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused
                ? 'md-home'
                : 'md-home';
            } else if (route.name === 'Favourite') {
              iconName = focused ? 'md-star' : 'md-star';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#009688',
          tabBarInactiveTintColor: 'gray',
        })}
>
  {/* From here we can click to go the next screen */}
        <Tab.Screen name="Home" component={Home} 
        
        />
        <Tab.Screen name="Favourite" component={Favourite} />
      </Tab.Navigator>

</NavigationContainer>
)


}















