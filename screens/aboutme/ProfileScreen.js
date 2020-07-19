import React,{useEffect,useState} from 'react';
import {View, SafeAreaView, StyleSheet} from 'react-native';
import {
  Avatar,
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../../components/context'
import {ipAddress,ipImage} from "../config"
import AsyncStorage from '@react-native-community/async-storage';
const ProfileScreen = ({navigation}) => {
  const [data,setData] = useState([])
  const [preference,setPreference] = useState([])
  navigation.setOptions({

    headerRight: () => 
      <View style={{marginRight:10}}>
        <Icon.Button
          name="account-edit"
          size={25}
          backgroundColor= '#FB7200'
          color= 'white'
          onPress={() => navigation.navigate('EditProfileScreen',{data:data,onGoBack: () => getProfile()})}
        />
      </View>
    
  })
  const signOutHandler = ()=>{
    signOut();
    navigation.navigate("SchedulesPage");
  }

  const getProfile = async()=>{
    const value = await AsyncStorage.getItem('userToken');
    fetch(ipAddress+ '/account/find/'+value)
      .then((response) => response.json())
      .then((json) => {console.log(json),setData(json)})
      .catch((error) => console.error(error))
  }

  const getPreference = ()=>{
    fetch(ipAddress+"/preference/"+data._id)
    .then((response) => response.json())
    .then((json) => setPreference(json))
    .catch((error) => console.error(error))
  }

  useEffect(() => {
    getProfile();
    getPreference();
  }, []);

  const { signOut } = React.useContext(AuthContext);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
          <Avatar.Image 
            source={{
              uri: data.icon != '' ? ipImage+data.icon : ipImage+'default_icon.png'
            }}
            size={80}
          />
          <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {
              marginTop:15,
              marginBottom: 5,
            }]}>{data.userName}</Title>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="email" color="#777777" size={20}/>
          <Text style={{color:"#777777", marginLeft: 20}}>{data.email}</Text>
        </View>
      </View>

      <View style={styles.menuWrapper}>
        <TouchableRipple onPress={() => navigation.navigate('PreferenceList',{data:data,preference:preference,onGoBack: () => getPreference()})}>
          <View style={styles.menuItem}>
            <MaterialIcons name="favorite-border" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Preference List</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={() => {signOutHandler()}}>
          <View style={styles.menuItem}>
            <Icon name="logout-variant" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Logout</Text>
          </View>
        </TouchableRipple>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 26,
  },
});
