import React, {useEffect, useState, useLayoutEffect} from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator,Button,TextInput,Alert,YellowBox} from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {ipAddress,ipImage} from '../config'
import Geocoder from 'react-native-geocoding';
import SearchInput, { createFilter } from 'react-native-search-filter';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const SearchAttraction = ({route,navigation}) => {

    const KEYS_TO_FILTERS = ['title', 'location'];
    const [collection,setCollection] = useState([])
    const [searchTerm,setSearchTerm] = useState('')
    const {schedule} = route.params;
    const {lastTime} = route.params;
    YellowBox.ignoreWarnings([
        'Non-serializable values were found in the navigation state',
      ]);

    const filteredEmails = collection.filter(createFilter(searchTerm, KEYS_TO_FILTERS))
    const getCollection =()=>{
        fetch(ipAddress +'/attractiondetail')
        .then((response) => response.json())
        .then((json) => setCollection(json))
        .catch((error) => console.error(error))
    }
    saveAttraction = (attraction) =>{
      var newEndTime;
      if (lastTime==null){
        var startTime = new Date(schedule.StartDate);
        startTime.setHours('08','00','00');
        newEndTime = moment(startTime).add(attraction.timespend,'hours');
      }else{
        newEndTime = moment(lastTime).add(attraction.timespend,'hours');
      }
      fetch(ipAddress+'/attraction/save', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startTime: lastTime==null? startTime:lastTime,
          endTime: newEndTime,
          title:attraction.title,
          location:attraction.location,
          image:attraction.image,
          schedule_id:schedule._id,
          latitude:attraction.latitude,
          longitude:attraction.longitude,
          timeSpend:attraction.timeSpend,
          coordinate:{latitude:attraction.latitude,longitude:attraction.longitude}
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        route.params.onGoBack();
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert("Save error!" + error);
      });
    }
    useEffect(() => {
        getCollection();
    }, []);
    return (
        <View style={styles.container}>
          <SearchInput 
            onChangeText={(searchTerm) => { setSearchTerm(searchTerm) }} 
            style={styles.searchInput}
            placeholder="Type a message to search"
            placeholderTextColor="#666666"
            />
          <ScrollView>
            {filteredEmails.map(attraction => {
              return (
                <TouchableOpacity onPress={()=>saveAttraction(attraction)} key={attraction._id} style={styles.Item}>
                  <View>
                    <Text style={styles.title}>{attraction.title}</Text>
                    <Image source={{uri:ipImage+attraction.image}}></Image>
                    <Text style={styles.location}><Ionicons name="md-pin" size={15} />{attraction.location}</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>
      );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'flex-start'
    },
    Item:{
      borderBottomWidth: 0.5,
      borderColor: 'rgba(0,0,0,0.3)',
      padding: 10
    },
    location: {
        fontSize:14,
        marginTop:10,
        color: 'rgba(0,0,0,0.5)'
    },
    title:{
        fontSize:16,
    },
    searchInput:{
      color:"black",
      padding: 10,
      borderColor: '#CCC',
      borderWidth: 1,
      height:50,
      fontSize:18
    }
  });
export default SearchAttraction;