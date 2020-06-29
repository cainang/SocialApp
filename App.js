import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs'
import LoadingScreen from './screens/LoadingScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MessageScreen from './screens/MessageScreen';
import PostScreen from './screens/PostScreen';
import NotificationScreen from './screens/NotificationScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProfileOutScreen from './screens/ProfileOutScreen';
import RegisterScreen from './screens/RegisterScreen';
import CommentScreen from './screens/CommentScreen';
import * as firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';

var firebaseConfig = {
  apiKey: "AIzaSyA1Ff0YxZ7pv6NKPfPz9d31P7eNFpdAvoo",
  authDomain: "socialapp-6c4f0.firebaseapp.com",
  databaseURL: "https://socialapp-6c4f0.firebaseio.com",
  projectId: "socialapp-6c4f0",
  storageBucket: "socialapp-6c4f0.appspot.com",
  messagingSenderId: "1083746092217",
  appId: "1:1083746092217:web:4f5bce1bb50006cb538768",
  measurementId: "G-XPVHK71KCK"
};
if  ( ! firebase . apps . length )  { 
  firebase.initializeApp(firebaseConfig);
}

const AppContainer = createStackNavigator({
  default: createBottomTabNavigator({
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => <Ionicons name='ios-home' size={27} color={tintColor}></Ionicons>
      }
    },
    Message: {
      screen: MessageScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => <Ionicons name='ios-chatboxes' size={27} color={tintColor}></Ionicons>
      }
    },
    Post: {
      screen: PostScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => <Ionicons 
        name='ios-add-circle' 
        size={48} 
        color='#E9446A' 
        style={{shadowColor: '#E9446A', shadowOffset: {width: 0, height: 0}, shadowRadius: 10, shadowOpacity: 0.3}}
        ></Ionicons>
      }
    },
    Notification: {
      screen: NotificationScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => <Ionicons name='ios-notifications' size={27} color={tintColor}></Ionicons>
      }
    },
    Profile: {
      screen: ProfileScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => <Ionicons name='ios-person' size={27} color={tintColor}></Ionicons>
      }
    },
  },{
    defaultNavigationOptions: {
      tabBarOnPress: ({navigation, defaultHandler}) => {
        if(navigation.state.key === 'Post'){
          navigation.navigate('postModal');
        }else{
          defaultHandler()
        }
      }
    },
    tabBarOptions: {
      showLabel: false,
      activeTintColor: '#161F3D',
      inactiveTintColor: '#B8BBC4'
    }
  }),
  postModal: {
    screen: PostScreen
  },
  commentModal: {
    screen: CommentScreen
  },
  profileModal: {
    screen: ProfileOutScreen
  }
},
{
  mode: 'modal',
  headerMode: 'none'
}
)

const AuthStack = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      headerShown: false
    }
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      headerShown: false
    }
  }
})

export default createAppContainer(
  createSwitchNavigator({
      Loading: LoadingScreen,
      App: AppContainer,
      Auth: AuthStack
    },
    {
      initialRouteName: 'Loading'
    }
  )
)