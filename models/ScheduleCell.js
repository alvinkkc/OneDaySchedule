import React, {Component} from 'react';
import {TouchableOpacity, View, Image, Text, StyleSheet,Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ipAddress,ipImage}  from '../screens/config'
import LinearGradient from 'react-native-linear-gradient';
export default class ScheduleCell extends Component {
  


  render() {

    let {Schedule,isGroupSchedule,user_id} = this.props;
    let image = ipImage + Schedule.image;
    var formattedDate = new Date(Schedule.StartDate);
    var wholeDate = formattedDate.getFullYear() + '-' + ('0' + (formattedDate.getMonth() + 1)).slice(-2) + '-' + ('0' + formattedDate.getDate()).slice(-2);

    showDelete=()=>{
        Alert.alert('Delete', 'Do you want to delete this schedule?', [
          {text: 'Cancel'},{ text: "Delete",onPress: () =>deleteSchedule()}
      ]);
    }

    deleteSchedule=()=>{
      if (!isGroupSchedule){
        fetch(ipAddress+'/schedule/remove/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            _id: Schedule._id
          })
        }).then((response) => response.json())
        .then((responseJson) => {
          this.props.onLongPress()
        })
        .catch((error) => {
          Alert.alert("Save error!");
        });
      }else{
        fetch(ipAddress+'/schedule/gpschedule/remove/', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            _id: Schedule._id,
            user_id:user_id
          })
        }).then((response) => response.json())
        .then((responseJson) => {
          Alert.alert(responseJson.message);
          this.props.onLongPress()
        })
        .catch((error) => {
          Alert.alert("Save error!");
        });
      }
        
    }

    return (     
      <TouchableOpacity onPress={this.props.onPress} onLongPress={showDelete}>
        <View style={styles.sitem}>
          <Image style={styles.simage} source={{uri: image}}></Image>
          <Text style={styles.sitemTitle}>{Schedule.Title}</Text>
          <View style={styles.sitemDate}>
            <Ionicons name="time-outline" size={16}/>
            <Text style={styles.sitemDateText}>{wholeDate}</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  sitem: {
    borderRadius: 10,
    shadowColor:'gray',
    shadowOffset:{width:0,height:0},
    shadowOpacity:0.3,
    shadowRadius:4,
    height:220,
    marginTop:5,
    margin:5,
    backgroundColor:'#FFFFFF'

  },
  sitemTitle: {
    marginTop:5,
    marginLeft:30,
    fontSize: 15,
    fontWeight: 'bold',
  },
  sitemDate:{
    marginTop:10,
    marginLeft:10,
    flex:1,
    flexDirection:'row'
  },
  sitemDateText: {
    marginLeft:5,
    fontWeight: '500',
    color:'#808080'
  },
  simage:{
    width: '95%',
    height: '70%',
    marginTop:7,
    marginLeft:10,
    borderRadius:5
  }
});