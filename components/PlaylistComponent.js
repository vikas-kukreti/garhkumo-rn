import React, { Component } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, ImageBackground } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import MoreOptionPlayer from './optionMenu/MoreOptionPlayer';

export default class PlaylistComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playlist: props.playlist
    }
  }
  goBackHandler() {
    this.props.close();
  }
  render() {
    if (this.state.playlist == null || this.state.playlist.length == 0)
      return (
        <View style={styles.container}>
          <View class={styles.header}>
            <TouchableOpacity
              style={{ alignSelf: 'center' }}
              onPress={() => {
                this.goBackHandler();
              }}
            >
              <MaterialIcons
                name="keyboard-arrow-down"
                color="#777"
                size={32}
                style={{ padding: 10 }}
              />
            </TouchableOpacity>
          </View>
          <Text style={{ textAlign: 'center', padding: 30, color: '#ccc' }}>Empty Playlist...</Text>
        </View>
      );
    else
      return (
        <View style={styles.container}>
          <View class={styles.header}>
            <TouchableOpacity
              style={{ alignSelf: 'center' }}
              onPress={() => {
                this.goBackHandler();
              }}
            >
              <MaterialIcons
                name="keyboard-arrow-down"
                color="#afafaf"
                size={32}
                style={{ padding: 10 }}
              />
            </TouchableOpacity>
          </View>
          <FlatList
            renderToHardwareTextureAndroid={true}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            showsVerticalScrollIndicator={false}
            updateCellsBatchingPeriod={100}
            windowSize={5}
            data={this.state.playlist}
            keyExtractor={(item) => item.songId}
            renderItem={(item) => {
              return (
                <ImageBackground style={{ flex: 1, marginBottom: 5 }} source={{ uri: item.item.songImg }} blurRadius={4}>
                  <View style={{ backgroundColor: 'rgba(40,40,50,0.8)', flex: 1, flexDirection: 'row' }}>
                    <Image style={{ height: 50, width: 50 * 16 / 9 }} source={{ uri: item.item.songImg }} />
                    <TouchableOpacity onPress={() => {
                      this.props.play(item.index);
                    }} style={{ flex: 1, padding: 5 }}>
                      <Text numberOfLines={2} style={{ color: '#fff',fontSize:10 }}>{item.item.songName}</Text>
                      <Text numberOfLines={1} style={{ color: '#fff', fontSize: 10 }}>{item.item.artistOne + (item.item.artistTwo ? ', ' + item.item.artistTwo : '')}</Text>
                    </TouchableOpacity>
                    <View>
                      {/* <MoreOptionPlayer dataSongId={item.item}
                            songName={item.item.songName} screenProps={this.props.screenProps} /> */}
                    </View>
                  </View>
                </ImageBackground>
              );
            }}
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
  },
  header: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#222',
    padding: 10,
    flexDirection: "column"
  }
});
