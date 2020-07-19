import React, {Component,useEffect} from 'react';
import {Image, StyleSheet, Text, ActivityIndicator, View} from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


import SchedulesPage from './screens/home/SchedulesPage';
import ProfileScreen from './screens/aboutme/ProfileScreen';
import EditProfileScreen from './screens/aboutme/EditProfileScreen';
import PreferenceList from './screens/aboutme/PreferenceList';
import TimeTablePage from './screens/timetable/TimeTablePage';
import CreateAttractionPage from './screens/timetable/CreateAttractionPage';
import ScheduleMapView from './screens/timetable/ScheduleMapView';
import SearchAttraction from './screens/timetable/SearchAttraction';
import GeneratedTimeTable from './screens/timetable/GeneratedTimeTable';

import { AuthContext } from './components/context';

import AsyncStorage from '@react-native-community/async-storage';


import RootStackScreen from './screens/login/RootStackScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();



const App = ({navigation}) => {

  const initialLoginState = {
    isLoading: true,
    userEmail: null,
    userToken: null,
  };

  const loginReducer = (prevState, action) => {
    switch( action.type ) {
      case 'RETRIEVE_TOKEN': 
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN': 
        return {
          ...prevState,
          userEmail: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT': 
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER': 
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);

  const authContext = React.useMemo(() => ({
    signIn: async(foundUser) => {
      // setUserToken('fgkj');
      // setIsLoading(false);
      const userToken = String(foundUser[0]._id);
      const useremail = foundUser[0].email;
      
      try {
        await AsyncStorage.setItem('userToken', userToken);
      } catch(e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'LOGIN', id: useremail, token: userToken });
    },
    signOut: async() => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await AsyncStorage.removeItem('userToken');
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      // setUserToken('fgkj');
      // setIsLoading(false);
    },
  }), []);

  useEffect(() => {
    setTimeout(async() => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch(e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);

  if( loginState.isLoading ) {
    return(
      <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  createSchedulesPageStackTab = () => 
    <Stack.Navigator>
    <Stack.Screen name="SchedulesPage" component={SchedulesPage} 
      options={{
        headerTitle: props =>
          <Text style={styles.heading}>{'Schedules'}</Text>,
        headerStyle: {
          backgroundColor: "#FB7200",
          shadowColor: 'transparent'
        },
      }}
    />

    <Stack.Screen name="TimeTablePage" component={TimeTablePage} 
      options={{
        headerTitle: 'My day schedule',
        headerTitleStyle:styles.heading,
        headerTintColor:"white",
        headerBackTitleVisible:false,
        headerStyle: {
          backgroundColor: "#FB7200",
          shadowColor: 'transparent'
        },
      }}/>
    <Stack.Screen name="CreateAttractionPage" component={CreateAttractionPage} 
      options={{
        headerTitle: 'Create new attraction',
        headerTitleStyle:styles.heading,
        headerTintColor:"white",
        headerBackTitleVisible:false,
        headerStyle: {
          backgroundColor: "#FB7200",
        },
      }}/>

    <Stack.Screen name="ScheduleMapView" component={ScheduleMapView} 
      options={{
        headerTitle: 'Map View',
        headerTitleStyle:styles.heading,
        headerTintColor:"white",
        headerBackTitleVisible:false,
        headerStyle: {
          backgroundColor: "#FB7200",
        },
    }}/> 

    <Stack.Screen name="SearchAttraction" component={SearchAttraction} 
      options={{
        headerTitle: 'Collection',
        headerTitleStyle:styles.heading,
        headerTintColor:"white",
        headerBackTitleVisible:false,
        headerStyle: {
          backgroundColor: "#FB7200",
        },
    }}/>  
  </Stack.Navigator>

  createGeneratedSchedulesStackTab = () => 
    <Stack.Navigator>
    <Stack.Screen name="GeneratedTimeTable" component={GeneratedTimeTable} 
      options={{
        headerTitle: props =>
          <Text style={styles.heading}>{'My day schedule'}</Text>,
            headerStyle: {
              backgroundColor: "#FB7200",
            },
      }}/>

    <Stack.Screen name="CreateAttractionPage" component={CreateAttractionPage} 
      options={{
        headerTitle: 'Create new attraction',
        headerTitleStyle:styles.heading,
        headerTintColor:"white",
        headerBackTitleVisible:false,
        headerStyle: {
          backgroundColor: "#FB7200",
        },
      }}/>

    <Stack.Screen name="ScheduleMapView" component={ScheduleMapView} 
      options={{
        headerTitle: 'Map View',
        headerTitleStyle:styles.heading,
        headerTintColor:"white",
        headerBackTitleVisible:false,
        headerStyle: {
          backgroundColor: "#FB7200",
        },
    }}/> 
  </Stack.Navigator>

  createProfileStackTab = () => 
    <Stack.Navigator>
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} 
          options={{
            headerTitle: 'Profile',
            headerTitleStyle:styles.heading,
            headerTintColor:"white",
            headerBackTitleVisible:false,
            headerStyle: {
              backgroundColor: "#FB7200",
            },
          }}
        />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} 
          options={{
            headerTitle: 'Edit Profile',
            headerTitleStyle:styles.heading,
            headerTintColor:"white",
            headerBackTitleVisible:false,
            headerStyle: {
              backgroundColor: "#FB7200",
            },
          }}/>
        <Stack.Screen name="PreferenceList" component={PreferenceList} 
          options={{
            headerTitle: 'Preference List',
            headerTitleStyle:styles.heading,
            headerTintColor:"white",
            headerBackTitleVisible:false,
            headerStyle: {
              backgroundColor: "#FB7200",
            },
          }}/> 
      </Stack.Navigator>

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken !== null ? (
            <Tab.Navigator> 
              <Tab.Screen name="SchedulesPage" component={createSchedulesPageStackTab}
                options={{
                  tabBarLabel: 'Schedules',
                  tabBarIcon: ({ focused }) => {
                    const source = focused ? require('./assets/nav/timeline_1.png') : require('./assets/nav/timeline_0.png');
                    return (<Image style={styles.tabBarIcon} source={source} />);
                  },
                }}
              />
              <Tab.Screen name="GeneratedTimeTable" component={createGeneratedSchedulesStackTab} 
                options={{
                  title: 'My day schedule',
                  tabBarLabel: ' ',
                  tabBarIcon: ({ focused }) => {
                    const source = focused ? require('./assets/nav/create_1.png') : require('./assets/nav/create_0.png');
                    return (
                      <View style={{
                        position: 'absolute',
                        bottom: 0, // space from bottombar
                        height: 68,
                        width: 68,
                        borderRadius: 68,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image style={{height: 68,
                        width: 68,}} source={source} />
                    </View>
                    );
                  },
                }}
              />
              <Tab.Screen name="ProfileScreen" component={createProfileStackTab} 
                options={{
                  title: 'Profile',
                  tabBarIcon: ({ focused }) => {
                    const source = focused ? require('./assets/nav/aboutme_1.png') : require('./assets/nav/aboutme_0.png');
                    return (<Image style={styles.tabBarIcon} source={source} />);
                  },
                }}
              />
          </Tab.Navigator>)
          :
          <RootStackScreen/>
        }
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  tabBarIcon: {
      width: 30,
      height: 30
  },  
  heading: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
  },
})
export default App;