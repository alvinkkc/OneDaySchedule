import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';
import Header from '../../components/header';
import StickyParallaxHeader from 'react-native-sticky-parallax-header'

function Index(props) {

  const {
    navigation
  } = props;
  const headerProps = {
    title: '关于我',
    navigation,
  }
  return (

    
    <SafeAreaView style={styles.wrapper}>
      <Header {...headerProps} />
      <StickyParallaxHeader headerType="TabbedHeader" 
      title="dsss"
      backgroundColor="red"
      headerHeight={100} />
      
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#eee',
  },
  body: {
    alignItems: 'center',
  },  
  description: {
    padding: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  textWrapper: {
    paddingLeft: 15,
    paddingVertical: 5,
  },
  text: {

    color: '#999'
  }
})
export default Index;