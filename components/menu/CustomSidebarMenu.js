import React, { Component } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, ToastAndroid, ScrollView, AsyncStorage } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { Linking } from 'expo';
import ApiHandelComponent from '../handler/ApiHandelComponent';


export default class CustomSidebarMenu extends Component {
  constructor() {
    super();
    this.proileImage =ApiHandelComponent.logo.url;
    this.items = [

      {
        navOptionThumb: 'home',
        navOptionName: 'Home',
        screenToNavigate: 'HomeMenu',
      },
      {
        navOptionThumb: 'search',
        navOptionName: 'Search',
        screenToNavigate: 'Search',
      },
      {
        navOptionThumb: 'users',
        navOptionName: 'Artist',
        screenToNavigate: 'allArtist',
      },
      {
        navOptionThumb: 'music',
        navOptionName: 'Songs',
        screenToNavigate: 'allSong',
      },
      {
        navOptionThumb: 'youtube',
        navOptionName: 'Channels',
        screenToNavigate: 'allChannel',
      },
      {
        navOptionThumb: 'history',
        navOptionName: 'Recently View',
        screenToNavigate: 'recentScreen',
      },
    ];
    this.recently = [
      {
        name: 'artist',
        icon: 'user',
        text: 'clear View Artist'
      },
      {
        name: 'channel',
        icon: 'youtube',
        text: 'clear View channel'
      },
      {
        name: 'song',
        icon: 'music',
        text: 'clear play Songs'
      },
    ]

  }
  render() {

    const _historyClear = (name) => {
      AsyncStorage.removeItem(name);
      ToastAndroid.show('Cleare recently view ' + name, ToastAndroid.SHORT);
    }
    return (
      <ScrollView style={styles.sideMenuContainer} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: this.proileImage }}
          style={styles.sideMenuProfileIcon}
        />
        <View style={styles.braker} />

        <View style={{ width: '100%' }}>
          {this.items.map((item, key) => (

            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate(item.screenToNavigate);
              }}
              style={styles.row}
              key={key}>
              <View style={styles.iconContainer}>
                <FontAwesome name={item.navOptionThumb} size={20} color="#808080" />
              </View>
              <Text style={styles.iconText}>
                {item.navOptionName}
              </Text>
            </TouchableOpacity>

          ))}
          <View style={styles.braker} />
          <View style={styles.history} key='history'>
            <View style={{ marginRight: 10, marginLeft: 20 }}>
            </View>
            <Text style={{ ...styles.iconText, ...styles.historyText }}> History</Text>
          </View>
          <View style={styles.braker} />
          <View style={styles.braker} />

          {
            this.recently.map((recentlyItem) => (
              <TouchableOpacity
                onPress={() => _historyClear(recentlyItem.name)}
                style={styles.row}
                key={recentlyItem.name}>
                <View style={styles.iconContainer}>
                  <FontAwesome name={recentlyItem.icon} size={20} color="#808080" />
                </View>
                <Text style={styles.iconText}>
                  {recentlyItem.text}
                </Text>
              </TouchableOpacity>
            ))
          }
          <View style={styles.braker} />
          <View style={styles.history} key='help'>
            <View style={{ marginRight: 10, marginLeft: 20 }}>
            </View>
            <Text style={{ ...styles.iconText, ...styles.historyText }}> Help & Support</Text>
          </View>
          <View style={styles.braker} />
          <View style={styles.braker} />
          <TouchableOpacity  onPress={()=>Linking.openURL(ApiHandelComponent.about.url)}  style={styles.row} key='about'>
            <View style={styles.iconContainer}>
              <FontAwesome name='address-card' size={20} color="#808080" />
            </View>
            <Text style={styles.iconText}> About </Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={()=>Linking.openURL(ApiHandelComponent.contact.url)}  style={styles.row} key='contact'>
            <View style={styles.iconContainer}>
              <FontAwesome name='envelope-open' size={20} color="#808080" />
            </View>
            <Text style={styles.iconText}> Contact </Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={()=>Linking.openURL(ApiHandelComponent.appLink.url)}  style={styles.row} key='app'>
            <View style={styles.iconContainer}>
              <FontAwesome name='share-alt' size={20} color="#808080" />
            </View>
            <Text style={styles.iconText}> Share App </Text>
          </TouchableOpacity>
          

          <View style={styles.braker} />
          <View style={styles.history} key='social'>
            <View style={{ marginRight: 10, marginLeft: 20 }}>
            </View>
            <Text style={{ ...styles.iconText, ...styles.historyText }}> Social</Text>
          </View>
          <View style={styles.braker} />
          <View style={styles.braker} />
          <View style={styles.row}>
            <View style={styles.socialContainer}>
              <TouchableOpacity  onPress={()=>Linking.openURL(ApiHandelComponent.facebook.url)}  style={{ ...styles.facebook, ...styles.social }}>
                <FontAwesome name='facebook' size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.socialContainer}>
              <TouchableOpacity  onPress={()=>Linking.openURL(ApiHandelComponent.instagram.url)}  style={{ ...styles.instagram, ...styles.social }}>
                <FontAwesome name='instagram' size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.socialContainer}>
              <TouchableOpacity  onPress={()=>Linking.openURL(ApiHandelComponent.twitter.url)}  style={{ ...styles.twitter, ...styles.social }}>
                <FontAwesome name='twitter' size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={styles.socialContainer}>
              <TouchableOpacity onPress={()=>Linking.openURL(ApiHandelComponent.telegram.url)} style={{ ...styles.telegram, ...styles.social }}>
                <FontAwesome name='telegram' size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  sideMenuContainer: {
    width: '100%',
    height: '100%',
  },
  sideMenuProfileIcon: {
    resizeMode: "contain",
    width: null,
    height: 80,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e2e2',
  },
  iconContainer: { marginRight: 20, marginLeft: 20 },
  iconText: { fontSize: 14, },
  history: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#26ADF2',
    justifyContent:"center"
  },
  historyText: {
    color: '#fff',
    textAlign:"center",
  },
  braker: {
    width: '100%',
    height: 1,
    backgroundColor: '#e2e2e2',
    marginTop: 1,
  },
  coulmn: {
    flex: 1,
  },
  socialContainer:{
    paddingHorizontal:10,
    justifyContent:'space-between',
    alignSelf:"center",    
  },
  social: {
    borderRadius: 50,
    padding: 5,
  },
  facebook: {    
    paddingHorizontal:10,
    backgroundColor: '#5D7DBE',
  },
  instagram: {
    backgroundColor: '#9B2093',
  },
  twitter: {
    backgroundColor: '#0098EE',
  },
  telegram: {
    backgroundColor: '#44B6E5',
  },
});