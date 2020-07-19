import React, {useEffect, useState} from 'react';
import { Alert, StyleSheet, View, Text,TextInput, FlatList, ImageBackground, TouchableOpacity, Button, ActivityIndicator,YellowBox} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Micons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import LocationItem from '../../models/LocationItem'
import moment from 'moment';
import {ipAddress,ipImage} from '../config'
import BottomSheet from 'reanimated-bottom-sheet';
import {Avatar} from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from 'react-native-modal';

const TimeTablePage = ({route,navigation }) => {
  const {schedule,isGroupSchedule} = route.params;
  const [isModalVisible, setModalVisible] = useState(false);
  const [isInviteModalVisible, setInviteModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isRreshing, setRreshing] = useState(false);
  const [lastTime,setLastTime] = useState();
  const [userList,setUserList] = useState([]);
  const [scheduleName, setScheduleName] = useState(schedule.Title);
  const [datePickerValue, setDatePickerValue] = useState(new Date(schedule.StartDate));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [inviteEmail,setInviteEmail]=useState('');
  let image = ipImage + schedule.image;
  var wholeDate = datePickerValue.getFullYear() + '-' + ('0' + (datePickerValue.getMonth() + 1)).slice(-2) + '-' + ('0' + datePickerValue.getDate()).slice(-2);
  YellowBox.ignoreWarnings([
    'Sending `onAnimatedValueUpdate` with no listeners registered.','Each child in a list should have a unique "key" prop'
  ]);

  navigation.setOptions({
    headerRight:()=>
    <TouchableOpacity style={{marginRight:20}} onPress={() => navigation.navigate('ScheduleMapView',{attractions:data})}>
      <Entypo name="location" color="white" size={30}/>
    </TouchableOpacity>
  })

  const toggleInviteModal = () => {
    setInviteModalVisible(!isInviteModalVisible);
  };

  const cancelInviteAction = () =>{
    setInviteEmail('');
    toggleInviteModal()
  }

  const saveInviteAction = () =>{
    if (scheduleName == '')
      Alert.alert("Please input schedule name.");
    else {
      fetch(ipAddress+'/schedule/gpschedule/invite', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id:schedule._id,
          email:inviteEmail
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
          Alert.alert("save");
          toggleInviteModal()
      })
      .catch((error) => {
        Alert.alert("Save error!");
      });
    }
  }
  
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
    toggleModal()
  }

  const saveAction = () =>{
    if (scheduleName == '')
      Alert.alert("Please input schedule name.");
    else {
      fetch(ipAddress+'/schedule/update', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          _id:schedule._id,
          Title: scheduleName,
          StartDate: datePickerValue,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        cancelAction();
        getTimetable();
      })
      .catch((error) => {
        Alert.alert("Save error!");
      });
    }
  }

  renderInner = () => (
    <View style={styles.panel}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.panelTitle}>New attraction</Text>
      </View>
      <TouchableOpacity style={styles.panelButton} onPress={() => navigation.navigate('CreateAttractionPage',{schedule:schedule,lastTime:lastTime,onGoBack: () => getTimetable()})}>
        <Text style={styles.panelButtonTitle}>Create new attraction</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton} onPress={() => navigation.navigate('SearchAttraction',{schedule:schedule,lastTime:lastTime,onGoBack: () => (this.bs.current.snapTo(1),getTimetable())})}>
        <Text style={styles.panelButtonTitle}>Choose From collection</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => this.bs.current.snapTo(1)}>
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );

  const _renderItem = ({ item }) =>{
    setLastTime(item.endTime);
    return (
      <LocationItem data={item} refresh={getTimetable}></LocationItem>
    )
  };


  const getTimetable = () =>{
    if(isGroupSchedule) {
      fetch(ipAddress +'/account/findgpuser/'+schedule._id,{
        method:'GET',
        headers:{
          'Content-Type':'application/json'
        }
      })
      .then((response) => response.json())
      .then((json) => (setUserList(json)))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    }
    fetch(ipAddress +'/attraction/'+schedule._id)
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
      setRreshing(false);
  }

const renderAddButton = () => {
  return (
    <TouchableOpacity style={styles.addicon } onPress={() => this.bs.current.snapTo(0)}>
      <Micons  name="add-location" color="#FB7200" size={50} />
      <Text style={{marginTop:13,marginLeft:20,fontSize:20,color:'#808080'}}>Add new attraction</Text>
    </TouchableOpacity>
  )
}

const getUserList =()=> {
  return userList.map((user)=>
    <Avatar.Image 
      source={{
        uri: user.icon != '' ? ipImage+user.icon : ipImage+'default_icon.png'
      }}
      size={35}
      style={{marginRight:10,marginTop:10}}
  />
  )
}

const inviteUser = ()=>{

}

const renderListHeader = () => {
  return (
    <View style={styles.sitem}>
      <ImageBackground style={styles.simage} source={{uri:image}} imageStyle={{ }}>
        <View style={styles.sitemDate}>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.sitemTitle}>{scheduleName}</Text>
            <TouchableOpacity onPress={toggleModal} style={{marginTop:10}}>
              <MaterialCommunityIcons name="square-edit-outline" color="white" size={20}/>
            </TouchableOpacity>
          </View>
          <Text style={styles.sitemDateText}>{moment(new Date(datePickerValue)).format('YYYY-MM-DD')}</Text>
        </View>
        {!isGroupSchedule ? null
          : <View style={{flexDirection:'row',marginTop: 90,backgroundColor:'rgba(0, 0, 0, 0.55)'}}>
              <TouchableOpacity onPress={toggleInviteModal}>
                <Avatar.Image source={{uri: ipImage+'add_group.png'}} size={35} style={{marginRight:10,marginTop:10}}/>
              </TouchableOpacity>
              {getUserList()}
          </View>
          }
          
      </ImageBackground>
    </View>
  )
}

  useEffect(() => {
    bs = React.createRef();
    getTimetable();
  }, []);
  
  return (
    <>
      <View style={styles.screen}>
        <BottomSheet
          ref={this.bs}
          snapPoints={[330, 0]}
          renderContent={this.renderInner}
          renderHeader={this.renderHeader}
          initialSnap={1}
          callbackNode={this.fall}
          enabledGestureInteraction={true}
        />
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
        <Modal style={{justifyContent: 'flex-end',margin: 0}} isVisible={isInviteModalVisible} avoidKeyboard={true} 
        onBackdropPress={toggleInviteModal} onSwipeComplete={toggleInviteModal} swipeDirection="down" >

          <View style={styles.modalButtomContainer}>
              <Button style={styles.modalButtom} onPress={cancelInviteAction} color='#F88C43' title='Cancel'/>
              <Button style={styles.modalButtom} onPress={saveInviteAction} color='#F88C43' title='Save'/>
          </View>

          <View style={styles.content}>
            <View style={styles.ScheduleModal}>
                <View style={{borderBottomWidth:1,borderBottomColor:'#D3D3D3',marginTop:10,marginLeft:10,marginRight:10}}>
                  <Text style={{fontSize:17}}>{"Email"}</Text>
                  <TextInput
                    style={{color:"black",height: 40,fontSize:15}}
                    placeholderTextColor="#666666"
                    placeholder="Please input email"
                    onChangeText={inviteEmail => setInviteEmail(inviteEmail)}
                    defaultValue={inviteEmail}
                    clearButtonMode='while-editing'/>
                </View>
            </View>
          </View>

        </Modal>

          

        <Modal style={{justifyContent: 'flex-end',margin: 0}} isVisible={isModalVisible} avoidKeyboard={true} 
        onBackdropPress={toggleModal} onSwipeComplete={toggleModal} swipeDirection="down" >

          <View style={styles.modalButtomContainer}>
              <Button style={styles.modalButtom} onPress={cancelAction} color='#F88C43' title='Cancel'/>
              <Button style={styles.modalButtom} onPress={saveAction} color='#F88C43' title='Save'/>
          </View>

          <View style={styles.content}>
            <View style={styles.ScheduleModal}>
                <View style={{borderBottomWidth:1,borderBottomColor:'#D3D3D3',marginTop:10,marginLeft:10,marginRight:10}}>
                  <Text style={{fontSize:17}}>{"Name of schedule"}</Text>
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
    flexDirection:'row',
    width: '100%',
    height: '100%',
  },
  addicon: {
    flexDirection:'row',
    margin:13
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
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

export default TimeTablePage;
