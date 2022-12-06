import React, {Component} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "./components/HomeScreen";
import ListView from "./components/ListView";
import {StyleSheet} from "react-native";
import UpdateTaskComponent from "./components/UpdateTaskComponent";

const Stack = createNativeStackNavigator();

const App = ({props}) => {
    return (
      <NavigationContainer>
          <Stack.Navigator>
              <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{title: 'List overview'}}
              />
              <Stack.Screen
                  name="ListView"
                  component={ListView}
                  options={{title: 'List content'}}
              />
              <Stack.Screen
                  name="UpdateTaskComponent"
                  component={UpdateTaskComponent}
                  options={{title: 'Update task'}}
              />
          </Stack.Navigator>
      </NavigationContainer>

    )
}

const styles = StyleSheet.create({
    appContainer: {
        backgroundColor: '#000000'
    },

})
export default App






