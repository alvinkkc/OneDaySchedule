import React, {useEffect, useState} from 'react';
import { Alert, StyleSheet, View, Text,TextInput, FlatList, ImageBackground, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Micons from 'react-native-vector-icons/MaterialIcons';
import RecommendItem from '../../models/RecommendItem'
import moment from 'moment';
import {ipAddress,ipImage} from "../config"
import AsyncStorage from '@react-native-community/async-storage';
const GeneratedTimeTable = ({navigation }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isRreshing, setRreshing] = useState(false);
  var initStartTime = new Date().setHours('14','00','00');

  navigation.setOptions({
    headerLeft:()=>(
    <TouchableOpacity style={{marginLeft:15}} onPress={addToSchedule}>
    <Micons name="playlist-add" color="white" size={30}/>
  </TouchableOpacity>),
    headerRight:()=>(
    <TouchableOpacity style={{marginRight:20}} onPress={() => navigation.navigate('ScheduleMapView',{attractions:data})}>
      <Entypo name="location" color="white" size={30}/>
    </TouchableOpacity>)
  })

  const _renderItem = ({ item }) =>{
      StartTime = moment(initStartTime).add(2,'hours');
      initStartTime = StartTime;
      return (
        <RecommendItem data={item} startTime={StartTime} refresh={getTimetable}></RecommendItem>
      ) 
  };

  const getTimetable = async() =>{
    const value = await AsyncStorage.getItem('userToken');
    setData([]);
    fetch(ipAddress+'/recommend/'+value)
    .then((response) => response.json())
    .then((json) => {setData(json)})
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
    setRreshing(false);
  }

const renderAddButton = () => {
  return (
    <TouchableOpacity style={styles.addicon }>
      <Micons  name="add-location" color="#FB7200" size={50} />
      <Text style={{marginTop:13,marginLeft:20,fontSize:20,color:'#808080'}}>Add new attraction</Text>
    </TouchableOpacity>
  )
}

const renderListHeader = () => {
  return (
    <View style={styles.sitem}>
      <ImageBackground style={styles.simage}imageStyle={{ }}>
        <View style={styles.sitemDate}>
          <Text style={styles.sitemTitle}>Recommened Trip</Text>
          <Text style={styles.sitemDateText}>{moment(new Date()).format('YYYY-MM-DD')}</Text>
        </View>
      </ImageBackground>
    </View>
  )
}

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getTimetable();
    });
    getTimetable();
    return unsubscribe;
  }, [navigation]);
  
 const addToSchedule = async()=>{
    const value = await AsyncStorage.getItem('userToken');
    fetch(ipAddress+'/recommend/add', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: value,
        Title: "Recommened Trip",
        StartDate:new Date(),
        EndDate:new Date(),
        data:data
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      Alert.alert("schedule","save Successfully!",[{ text: "OK", onPress: () => navigation.navigate("SchedulesPage")}]);
    })
    .catch((error) => {
      Alert.alert("Save error!"+error);
    });
  }
 

  return (
    <>
      <View style={styles.screen}>
        {isLoading ? <ActivityIndicator/> : (
          <FlatList
            data={data}
            keyExtractor={item => item._id}
            renderItem={_renderItem}
            style={styles.Listview}
            refreshing={isRreshing}
            onRefresh={getTimetable}
            ListHeaderComponent={renderListHeader}
            ListFooterComponent={renderAddButton}
          />
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#FFFFFF',
    height: '100%'
  },
  heading: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginLeft: 120,
    marginTop: 30
  },
  sitem: {
    height: 150,
    width:"100%",
    marginBottom:5,
    backgroundColor: '#FFFFFF'
  },
  sitemTitle: {
    marginTop: 10,
    marginLeft: 15,
    fontSize: 18,
    color: '#FFFFFF'
  },
  sitemDate: {
    marginTop: 90,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'rgba(0, 0, 0, 0.55)'
  },
  sitemDateText: {
    marginTop: 5,
    marginLeft: 15,
    fontWeight: '500',
    color: '#FFFFFF'
  },
  simage: {
    width: '100%',
    height: '100%',
  },
  addicon: {
    flexDirection:'row',
    margin:13
  },
});

export default GeneratedTimeTable;
