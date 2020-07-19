import React, {useEffect, useState, useLayoutEffect} from 'react';
import { StyleSheet, View, Image, Console, TouchableOpacity, 
          Dimensions, Platform,Button,Text,Alert,ScrollView,
          Animated,} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MapView, { PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {ipImage}  from '../config'

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;
const ScheduleMapView = ({route,navigation}) => {

    const {attractions} = route.params
    let mapIndex = 0;
    let mapAnimation = new Animated.Value(0);
    const [state, setState] = React.useState(attractions);
    const _map = React.useRef(null);
    const _scrollView = React.useRef(null);
    const SPACING_FOR_CARD_INSET = width * 0.1 - 10;
    useEffect(() => {
      mapAnimation.addListener(({ value }) => {
        let index = Math.floor(value / CARD_WIDTH + 0.3); 
        if (index >= state.length) {
          index = state.length - 1;
        }
        if (index <= 0) {
          index = 0;
        }
  
        clearTimeout(regionTimeout);
  
        const regionTimeout = setTimeout(() => {
          if( mapIndex !== index ) {
            mapIndex = index;
            const { coordinate } = state[index];
            _map.current.animateToRegion(
              {
                ...coordinate,
                latitudeDelta: 0.1515,
                longitudeDelta: 0.1521,
              },
              350
            );
          }
        }, 10);
      });
    });

    mapMarkers = () => {
      
      return attractions.map((attraction, index) => {
        const scaleStyle = {
          transform: [
            {
              scale: interpolations[index].scale,
            },
          ],
        };
        return (
          <MapView.Marker key={index} coordinate={attraction.coordinate} onPress={(e)=>onMarkerPress(e)}>
            <Animated.View style={[styles.markerWrap]}>
              <Animated.Image
                source={require('../../assets/New_Project.png')}
                style={[{width: 56, height: 70},scaleStyle]}
                resizeMode="contain"
              />
            </Animated.View>
          </MapView.Marker>
        );
      })}

    mapMarkersOnCard = () => {
      return attractions.map((attraction,index) => 
      
      <View style={styles.card} key={index}>
        <Image source={{uri:ipImage+attraction.image}} style={styles.cardImage} resizeMode="cover" ></Image>
        <View style={styles.textContent}>
          <Text numberOfLines={1} style={styles.cardtitle}>{attraction.title}</Text>
          <Text numberOfLines={1} style={styles.cardDescription}>{attraction.location}</Text>
        </View>
      </View>
      )}

      const interpolations = attractions.map((attraction,index) => {
        const inputRange = [
          (index - 1) * CARD_WIDTH,
          index * CARD_WIDTH,
          ((index + 1) * CARD_WIDTH),
        ];
    
        const scale = mapAnimation.interpolate({
          inputRange,
          outputRange: [1, 1.5, 1],
          extrapolate: "clamp"
        });
    
        return { scale };
      });

    const onMarkerPress = (mapEventData) => {
      const markerID = mapEventData._targetInst.return.key;
    
      let x = (markerID * CARD_WIDTH) + (markerID * 20); 
      if (Platform.OS === 'ios') {
         x = x - SPACING_FOR_CARD_INSET;
      }
    
      _scrollView.current.scrollTo({x: x, y: 0, animated: true});
    }

    return(
      <>
              <MapView // remove if not using Google Maps
                ref={_map}
                style={styles.map}
                region={{
                latitude: attractions[0].latitude,
                longitude: attractions[0].longitude,
                latitudeDelta: 0.1515,
                longitudeDelta: 0.1521,
                }}
              >
                {this.mapMarkers()}
              </MapView>
              <Animated.ScrollView
                ref={_scrollView}
                horizontal
                scrollEventThrottle={1}
                showsHorizontalScrollIndicator={false}
                style={styles.scrollView}
                pagingEnabled
                snapToInterval={CARD_WIDTH + 20}
                snapToAlignment="center"
                onScroll={Animated.event(
                  [
                    {
                      nativeEvent: {
                        contentOffset: {
                          x: mapAnimation,
                        }
                      },
                    },
                  ],
                  {useNativeDriver: true}
                )}
              >
                {this.mapMarkersOnCard()}

              </Animated.ScrollView>
              
              </>
    );};


const styles = StyleSheet.create({
    map: {
      ...StyleSheet.absoluteFillObject,
      height:"100%"
    },
    scrollView: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      paddingVertical: 10,
    },
    markerWrap: {
      alignItems: "center",
      justifyContent: "center",
      width:50,
      height:50,
    },
    card: {
      // padding: 10,
      elevation: 2,
      backgroundColor: "#FFF",
      borderTopLeftRadius: 5,
      borderTopRightRadius: 5,
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowRadius: 5,
      shadowOpacity: 0.3,
      shadowOffset: { x: 2, y: -2 },
      height: CARD_HEIGHT,
      width: CARD_WIDTH,
      overflow: "hidden",
    },
    cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
    textContent: {
      flex: 2,
      padding: 10,
    },
    cardtitle: {
      fontSize: 12,
      // marginTop: 5,
      fontWeight: "bold",
    },
    cardDescription: {
      fontSize: 12,
      color: "#444",
    },
    cardImage: {
      flex: 3,
      width: "100%",
      height: "100%",
      alignSelf: "center",
    },
    textContent: {
      flex: 2,
      padding: 10,
    },
    cardtitle: {
      fontSize: 12,
      // marginTop: 5,
      fontWeight: "bold",
    },
    cardDescription: {
      fontSize: 12,
      color: "#444",
    },
});

export default ScheduleMapView;