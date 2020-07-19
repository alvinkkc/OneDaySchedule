import React, {useEffect, useState, useLayoutEffect} from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, ActivityIndicator,Button,TextInput,Alert,YellowBox} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {ipAddress} from '../config'
import Geocoder from 'react-native-geocoding';
import moment from 'moment';
const CreateAttractionPage = ({route,navigation}) => {
    const {schedule} = route.params;
    const {lastTime} = route.params;
    const [attractionName, setAttractionName] = useState('');
    const [latitude, setLatitude] = useState(22.3366793);
    const [longitude, setLongitude] = useState(114.1724234);
    const [location, setLocation] = useState('');
    const [timeSpend, setTimeSpend] = useState(1);
    const [isMarker, setIsMarker] = useState(false);
    Geocoder.init("AIzaSyA4Mn4xJlZn-HW5AltMaSA4_bb2QFCWWRk");

    YellowBox.ignoreWarnings([
      'Non-serializable values were found in the navigation state',
    ]);
    const SaveAttractin = () =>{
      var newEndTime;
      if (lastTime==null){
        var startTime = new Date(schedule.StartDate);
        startTime.setHours('08','00','00');
        newEndTime = moment(startTime).add(timeSpend,'hours');
      }else{
        newEndTime = moment(lastTime).add(timeSpend,'hours');
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
          title:attractionName,
          location:location,
          image:"",
          schedule_id:schedule._id,
          latitude:latitude,
          longitude:longitude,
          timeSpend:timeSpend,
          coordinate:{latitude:latitude,longitude:longitude}
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
    
    navigation.setOptions({
      headerRight:()=>
        <Button onPress={SaveAttractin} color="white" title="Save"/>
    })
    
    searchSubmit =()=>{
      Geocoder.from(location)
        .then(json => {
        var locationResult = json.results[0].geometry.location;
        setLatitude(locationResult.lat);
        setLongitude(locationResult.lng);
        setIsMarker(true);
      }).catch(error => console.warn(error));
    }

    return(
      <View style={styles.content}>
          
      <View style={styles.InputContainer}>
        <Text style={styles.label}>Name of attraction</Text>
          <TextInput
            style={styles.Input}
            placeholderTextColor="#666666"
            placeholder="Please input name of attraction"
            onChangeText={attractionName => setAttractionName(attractionName)}
            defaultValue={attractionName}
            clearButtonMode='while-editing'/>
      </View>

      <View style={styles.InputContainer}>
        <Text style={styles.label}>Time spend</Text>
          <TextInput
            style={styles.Input}
            placeholder="Please input Tiem spend"
            placeholderTextColor="#666666"
            onChangeText={timeSpend => setTimeSpend(timeSpend)}
            defaultValue={String(timeSpend)}
            clearButtonMode='while-editing'
            keyboardType='decimal-pad'
            maxLength={2}/>
      </View>

      <View style={styles.InputContainer}>
        <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.Input}
            placeholderTextColor="#666666"
            placeholder="Please input location of attraction"
            onChangeText={location => setLocation(location)}
            defaultValue={location}
            clearButtonMode='while-editing'
            textContentType="location"
            onSubmitEditing={searchSubmit}
            />
      </View>
      <View style={styles.InputContainer}>
        <MapView
          style={styles.map}
          region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01115,
          longitudeDelta: 0.01121,
          }}
        >
          <MapView.Marker coordinate={{latitude:latitude,longitude:longitude}}>
              <Image
                source={require('../../assets/New_Project.png')}
                style={[{width: 56, height: 70}]}
                resizeMode="contain"
              />
          </MapView.Marker>
        </MapView>
      </View>
      
    </View>
        
    );
};


const styles = StyleSheet.create({
    content: {
        backgroundColor: 'white',
        height:"100%",
        flexDirection:'column'
    },
    InputContainer:{
      borderBottomWidth:1,
      borderBottomColor:'#D3D3D3',
      marginTop:10,
    },
    InputContainerL:{
      borderBottomWidth:1,
      borderBottomColor:'#D3D3D3',
    },
    label:{
      fontSize:17,
      marginLeft:10,
    },
    Latitudelabel:{
      fontSize:17,
      marginLeft:10,
      marginTop:10
    },
    Input:{
      color:"black",
      marginLeft:10,
      height: 40,
      fontSize:15
    },
    container: {
      
    },
    map: {
      height: 300,
      width: 450,
      alignItems: 'center',
      ...StyleSheet.absoluteFillObject,
    },
});

export default CreateAttractionPage;