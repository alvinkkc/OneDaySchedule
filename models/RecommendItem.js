import React, { Component } from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet, Animated,Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton } from "react-native-gesture-handler";
import moment from 'moment';
import {ipAddress} from '../screens/config'


export default class RecommendItem extends Component {

    renderRightAction = (text, color, x, progress) => {
        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [x, 0],
        });
        const pressHandler = () => {
            this.close();
            var {data} = this.props;
            fetch(ipAddress+'/attraction/remove/', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  _id: data._id
                })
              }).then((response) => response.json())
              .then((responseJson) => {
                  this.props.refresh()
              })
              .catch((error) => {
                Alert.alert("Save error!");
              });
        }

        return (
            <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
                <RectButton
                    style={[styles.rightAction, { backgroundColor: color }]}
                    onPress={pressHandler}>
                    <Text style={styles.actionText}>{text}</Text>
                </RectButton>
            </Animated.View>
        );
    };

    _renderRightActions = progress => (
        <View style={{ width: 152, flexDirection: 'row' }}>
            {this.renderRightAction('Delete', '#dd2c00', 152, progress)}
        </View>
    );
    updateRef = ref => {
        this._swipeableRow = ref;
    };
    close = () => {
        this._swipeableRow.close();
    };

    render() {

        let { data,startTime} = this.props;

        var formattedStartTime = new Date(startTime);
        var formattedEndTime = moment(startTime).add(2,'hours');
        var StartTime = moment(formattedStartTime).format('LT');
        var EndTime = moment(formattedEndTime).format('LT');

        return (
            <View style={styles.cell}>
                <View style={{marginTop:5}}>
                    <View style={styles.time}>
                        <Text>{StartTime}</Text>
                    </View>
                    <View style={styles.locationIcon}>
                        <MaterialCommunityIcons name="timeline-clock-outline" size={35} />
                    </View>
                    <View style={styles.time}>
                        <Text>{EndTime}</Text>
                    </View>
                </View>
                <View style={styles.location}>
                    <Swipeable
                        ref={this.updateRef}
                        friction={2}
                        leftThreshold={30}
                        rightThreshold={40}
                        renderRightActions={this._renderRightActions}>
                        <View style={styles.SwipeableItem}>
                            <Text style={styles.SwipeableItemTitle}>{data.title}</Text>
                            <Text style={styles.SwipeableItemLocation}>
                            <Ionicons name="md-pin" size={15} />
                            {" "+data.location}
                            </Text>
                        </View>
                    </Swipeable>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cell: {
        marginTop: 15,
        flexDirection: 'row',
        width: "100%",
        height: 100
    },
    locationIcon: {
        flex: 2,
        width: 70,
        alignItems: 'center'
    },
    time: {
        flex: 1,
        alignItems: 'center'
    },
    location: {
        borderRadius: 10,
        shadowColor: 'gray',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        backgroundColor: '#FFFFFF',
        width: 335, height: "100%"
    },
    SwipeableItem: {
        flexDirection:"column",
        width: 300,
        height: "100%"
    },
    SwipeableItemTitle:{
        flex:2,
        padding:10,
        fontSize:18
    },
    SwipeableItemLocation:{
        color:'#808080',
        padding:10,
        fontSize:12
    },
    actionText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        borderRadius: 10,
    },
});