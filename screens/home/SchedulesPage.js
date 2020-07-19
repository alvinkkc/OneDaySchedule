import React, {useEffect, useState} from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, Dimensions, ActivityIndicator,Button,TextInput,Alert} from 'react-native';
import ScheduleCell from '../../models/ScheduleCell';
import BackgroundCurve from '../../components/BackgroundCurve';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Modal from 'react-native-modal';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {ipAddress} from "../config"
import AsyncStorage from '@react-native-community/async-storage';
const SchedulesPage = ({navigation}) => {

  const [isLoading, setLoading] = useState(true);
  const [isRreshing, setRreshing] = useState(false);
  const [data, setData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [scheduleName, setScheduleName] = useState('');
  const [datePickerValue, setDatePickerValue] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [MySchedulesColor, setMySchedulesColor] = useState("#F88C43");
  const [GPSchedulesColor, setGPSchedulesColor] = useState("transparent");
  const [isGroupSchedule, setGroupSchedule] = useState(false);
  const [userID,setUserID] = useState('');
  var wholeDate = datePickerValue.getFullYear() + '-' + ('0' + (datePickerValue.getMonth() + 1)).slice(-2) + '-' + ('0' + datePickerValue.getDate()).slice(-2);

  const _renderItem = ({ item }) =>{
    return (
      <ScheduleCell Schedule={item} user_id={userID} isGroupSchedule={isGroupSchedule} onLongPress={isGroupSchedule?getGroupSchedule:getScheduleList} onPress={() => navigation.navigate('TimeTablePage',{schedule:item,isGroupSchedule:isGroupSchedule})}/>);
      
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDatePickerValue(date)
    hideDatePicker();
  };

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const cancelAction = () =>{
    setScheduleName('');
    setDatePickerValue(new Date());
    toggleModal()
  }

  const createScudel = () =>{
    if(!isGroupSchedule){

      fetch(ipAddress+'/schedule/save', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Title: scheduleName,
          StartDate: datePickerValue,
          EndDate:datePickerValue,
          image:'',
          user_id:userID
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        cancelAction();
        getScheduleList();
      })
      .catch((error) => {
        Alert.alert("Save error!");
      });

    } else {
      var user_list = [userID]
      fetch(ipAddress+'/schedule/gpschedule/create', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          Title: scheduleName,
          StartDate: datePickerValue,
          EndDate:datePickerValue,
          image:'',
          user_list:user_list
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        cancelAction();
        getGroupSchedule();
      })
      .catch((error) => {
        Alert.alert("Save error!");
      });
    }
    
  }

  const getScheduleList = async () =>{
    const value = await AsyncStorage.getItem('userToken');
    setUserID(value);
    fetch(ipAddress+ '/schedule/find/'+value)
      .then((response) => response.json())
      .then((json) => {console.log(json),setData(json)})
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    setRreshing(false);
    setMySchedulesColor("#F88C43");
    setGPSchedulesColor("transparent");
    setGroupSchedule(false)
  }

  const getGroupSchedule = async () =>{
    const value = await AsyncStorage.getItem('userToken');
    setUserID(value);
    fetch(ipAddress+ '/schedule/gpschedule/'+value)
      .then((response) => response.json())
      .then((json) => {console.log(json),setData(json)})
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    setRreshing(false);
    setMySchedulesColor("transparent");
    setGPSchedulesColor("#F88C43");
    setGroupSchedule(true);
  }

  
  const saveAction = () =>{
    if (scheduleName == '')
      Alert.alert("Please input schedule name.");
    else {
      createScudel();
    }
  }

  const getEmpty = () =>{
    return (
      <TouchableOpacity style={styles.addicon } onPress={toggleModal}>
        <Text style={{marginTop:13,marginLeft:20,fontSize:20,color:'#808080'}}>Press here to create one.</Text>
      </TouchableOpacity>
    )
  }
  
  useEffect(() => {
    getScheduleList();
  }, []);

  return (
    <>
      <View style={styles.screen}>
      <BackgroundCurve style={styles.svg} />
      <View style={styles.listBtn}>
        <TouchableOpacity onPress={getScheduleList} style={[styles.button,{backgroundColor:MySchedulesColor}]}>
          <Text style={styles.buttonText}>My Schedules</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={getGroupSchedule} style={[styles.button,{backgroundColor:GPSchedulesColor}]}>
          <Text style={styles.buttonText}>Group's Schedules</Text>
        </TouchableOpacity>
      </View>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={item => item._id}
          renderItem={_renderItem}
          style={styles.Listview}
          refreshing={isRreshing}
          onRefresh={isGroupSchedule?getGroupSchedule:getScheduleList}
          ListEmptyComponent={getEmpty}
        />
      )}
      <TouchableOpacity>
          <Ionicons style={styles.addingButton} onPress={toggleModal} name="ios-add-circle" color="#FB7200" size={70} />
        </TouchableOpacity>

        <Modal style={{justifyContent: 'flex-end',margin: 0}} isVisible={isModalVisible} avoidKeyboard={true} 
        onBackdropPress={toggleModal} onSwipeComplete={toggleModal} swipeDirection="down" >

          <View style={styles.modalButtomContainer}>
              <Button style={styles.modalButtom} onPress={cancelAction} color='#F88C43' title='Cancel'/>
              <Button style={styles.modalButtom} onPress={saveAction} color='#F88C43' title='Save'/>
          </View>

          <View style={styles.content}>
            <View style={styles.ScheduleModal}>
                <View style={{borderBottomWidth:1,borderBottomColor:'#D3D3D3',marginTop:10,marginLeft:10,marginRight:10}}>
                  <Text style={{fontSize:17}}>{isGroupSchedule?"Name of group schedule":"Name of schedule"}</Text>
                  <TextInput
                    style={{color:"black",height: 40,fontSize:15}}
                    placeholderTextColor="#666666"
                    placeholder="Please input name of schedule"
                    onChangeText={scheduleName => setScheduleName(scheduleName)}
                    defaultValue={scheduleName}
                    clearButtonMode='while-editing'/>
                </View>
                <View style={{marginTop:5,marginLeft:10}}>
                  <Text style={{fontSize:17}}>Start Date</Text>
                  <Text style={{height: 40,marginTop:10,fontSize:15}} onPress={showDatePicker}>{wholeDate}</Text>
                </View>
            </View>
            <DateTimePickerModal
              style={{color:"black"}}
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}/>
          </View>

        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  screen:{
    backgroundColor:'#FFFFFF',
    height:'100%'
  },
  Listview:{
    marginTop:50
  },
  svg: {
    position: 'absolute',
    width: Dimensions.get('window').width,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#F88C43',
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  buttonText: {
    fontWeight: '500',
    color: '#fff',
    marginLeft: 10,
  },
  listBtn: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 35,
  },
  addingButton: {
    position: 'absolute',
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    right: 5,
    bottom: 30,
 },
content: {
  backgroundColor: 'white',
  paddingBottom:160,
  justifyContent: 'center',
  alignItems: 'center',
},
ScheduleModal:{
  borderRadius: 4,
  shadowColor: 'gray',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.5,
  shadowRadius: 4,
  backgroundColor: '#FFFFFF',
  marginTop:10,
  width: 385
},
modalButtomContainer:{
  marginTop:20,
  flexDirection:'row',
  justifyContent:'space-between',
  alignItems: 'flex-start',
  borderTopRightRadius:5,
  backgroundColor: 'white'
},
modalButtom:{
  flex:1,
}
});

export default SchedulesPage;