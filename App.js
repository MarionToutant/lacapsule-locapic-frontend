import React from 'react';

import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

import {Icon} from 'react-native-elements';

import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import MapScreen from './screens/MapScreen';
import PoiScreen from './screens/PoiScreen';

import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';
import pseudo from './reducers/pseudo';
import poi from './reducers/poi';

console.disableYellowBox = true;

const store = createStore(combineReducers({pseudo, poi}));

// BOTTOM NAVIGATOR

var BottomNavigator = createBottomTabNavigator({
  Map: MapScreen,
  POI: PoiScreen,
  Chat: ChatScreen,
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      var iconName;
      if (navigation.state.routeName == 'Map') {
        iconName = 'ios-navigate';
        iconType = 'ionicon';
      } else if (navigation.state.routeName == 'POI') {
        iconName = 'marker';
        iconType = 'foundation';
      } else if (navigation.state.routeName == 'Chat') {
        iconName = 'ios-chatboxes'; 
        iconType = 'ionicon';
      }
      return <Icon type={iconType} name={iconName} size={25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: '#eb4d4b',
    inactiveTintColor: '#FFFFFF',
    style: {backgroundColor: '#130f40'},
  },
}
);

// STACK NAVIGATOR

var StackNavigator = createStackNavigator(
  {
    Home: HomeScreen,  
    BottomNavigator: BottomNavigator
  }, 
  { 
    headerMode: 'none' 
  } 
);  

// APP CONTAINER

const Navigation = createAppContainer(StackNavigator);

// REDUX STORE FOR THE WHOLE APP

export default function App() {
  return (
    <Provider store={store}>
      <Navigation/>
    </Provider>
  );
}
