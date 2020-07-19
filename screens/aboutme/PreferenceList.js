import React,{useState,useEffect} from 'react';
import {View, SafeAreaView, StyleSheet, ScrollView,Text,Alert,YellowBox} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Rating, AirbnbRating } from 'react-native-ratings';
import {ipAddress,ipImage} from "../config"
const PreferenceList = ({route,navigation}) => {

  const {data} = route.params;
  const {preference} = route.params;
  navigation.setOptions({
    headerRight: () => 
      <View style={{marginRight:10}}>
        <MaterialIcons.Button
          name="save"
          size={30}
          backgroundColor= '#FB7200'
          color= 'white'
          onPress={save}
        />
      </View>
  })

YellowBox.ignoreWarnings([
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`','Non-serializable values were found in the navigation state',
]);
const [shopping,setShopping] = useState(preference.shopping)
const [view,setView] = useState(preference.view)
const [sport,setSport] = useState(preference.sport)
const [culture,setCulture] = useState(preference.culture)
const [music,setMusic] = useState(preference.music)

save = () =>{
  fetch(ipAddress+"/preference/save", {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id:data._id,
      shopping: shopping,
      view: view,
      sport:sport,
      culture:culture,
      music:music
    })
  })
  .then((response) => response.json())
  .then((responseJson) => {
    Alert.alert("Preference","Save Successfully!",[{ text: "OK", onPress: () => (route.params.onGoBack(),navigation.goBack()) }
  ]);
  })
  .catch((error) => {
    Alert.alert("Save error!"+error);
  });
}

useEffect(() => {
  console.log(preference)
}, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.menuWrapper}>
 
        <View style={styles.rating}>
            <Text style={styles.title}>Shopping</Text>
            <AirbnbRating
              count={5}
              reviews={["Not intersting", "OK", "Good", "Very Good", "Love it"]}
              defaultRating={shopping}
              showRating
              size={50}
              onFinishRating={(rating)=>setShopping(rating)}
            />
        </View>
        <View style={styles.rating}>
            <Text style={styles.title}>View</Text>
            <AirbnbRating
              count={5}
              reviews={["Not intersting", "OK", "Good", "Very Good", "Love it"]}
              defaultRating={view}
              showRating
              size={50}
              onFinishRating={(rating)=>setView(rating)}
            />
        </View>
        <View style={styles.rating}>
        <Text style={styles.title}>Sport</Text>
        <AirbnbRating
              count={5}
              reviews={["Not intersting", "OK", "Good", "Very Good", "Love it"]}
              defaultRating={2}
              showRating
              size={50}
              onFinishRating={(rating)=>setSport(rating)}
            />
        </View>
        <View style={styles.rating}>
        <Text style={styles.title}>Culture</Text>
        <AirbnbRating
              count={5}
              reviews={["Not intersting", "OK", "Good", "Very Good", "Love it"]}
              defaultRating={1}
              showRating
              size={50}
              onFinishRating={(rating)=>setCulture(rating)}
            />
        </View>
        <View style={styles.rating}>
        <Text style={styles.title}>Music</Text>
        <AirbnbRating
              count={5}
              reviews={["Not intersting", "OK", "Good", "Very Good", "Love it"]}
              defaultRating={2}
              showRating
              size={50}
              onFinishRating={(rating)=>setMusic(rating)}
            />
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

export default PreferenceList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white"
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    alignSelf:'center'
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
  rating: {
    marginTop: 10,
    borderBottomWidth:2,
    borderBottomColor:'#D3D3D3',
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
