import React, { Component } from "react";
import NavigaterMenu from "./components/menu/NavigaterMenu";
import { FontAwesome } from "@expo/vector-icons";
import {
  View,
  Slider,
  Animated,
  PanResponder,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
  StyleSheet,
  Modal,
  ToastAndroid
} from "react-native";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import PlaylistComponent from "./components/PlaylistComponent";
import ApiHandelComponent from "./components/handler/ApiHandelComponent";
import { MenuProvider } from "react-native-popup-menu";

import { enableScreens } from 'react-native-screens';
enableScreens();

export class App extends Component {
  constructor(props) {
    super(props);
    this.playlist = [];
    this.index = 0;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    this.playbackInstance = null;
    this.transitionActive = false;
    this.state = {
      playbackInstancePosition: null,
      playbackInstanceDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isLoading: true,
      playlistOpen: false,
      playerHidden: false
    };
    this.position = new Animated.ValueXY();
    this.position.setValue({ x: 0, y: 0 });
    this.playerOpen = true;
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onPanResponderStart: (e, g) => {
        this.transitionActive = true;
      },
      onPanResponderMove: (evt, gestureState) => {},
      onPanResponderRelease: (evt, gestureState) => {
        setTimeout(() => {
          this.transitionActive = false;
        }, 1500);
        if (gestureState.dy < -150) {
          Animated.timing(this.position, {
            toValue: { x: 0, y: Dimensions.get("window").height }
          }).start();
          this.playerOpen = false;
        } else if (gestureState.dy > 150) {
          Animated.timing(this.position, {
            toValue: { x: 0, y: 0 }
          }).start();
          this.playerOpen = true;
        } else if (gestureState.dy >= -150 && gestureState.dy < 0) {
          if (this.playerOpen) {
            Animated.timing(this.position, {
              toValue: { x: 0, y: 0 }
            }).start();
          } else {
            Animated.timing(this.position, {
              toValue: { x: 0, y: Dimensions.get("window").height }
            }).start();
          }
        } else if (gestureState.dy <= 150 && gestureState.dy >= 0) {
          if (!this.playerOpen) {
            Animated.timing(this.position, {
              toValue: { x: 0, y: Dimensions.get("window").height }
            }).start();
          } else {
            Animated.timing(this.position, {
              toValue: { x: 0, y: 0 }
            }).start();
          }
        }
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        return true;
      }
    });
  }
  handleBackPress = () => {
    if (!this.playerOpen) {
      this.closePlayer(this.position);
    } else {
      return true;
    }
    if (playlistOpen) {
      this.setState({ playlistOpen: false });
    }
  };
  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: false,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX
    });
  }

  componentWillUnmount() {
    this._onStopPressed();
  }

  async _loadNewPlaybackInstance(playing) {
    if (this.playbackInstance != null) {
      await this.playbackInstance.unloadAsync();
      this.playbackInstance.setOnPlaybackStatusUpdate(null);
      this.playbackInstance = null;
    }
    let localUrl =
      ApiHandelComponent.songAudioFile.url + this.playlist[this.index].songId;
    const source = { uri: localUrl };

    const initialStatus = {
      shouldPlay: playing,
      rate: 1.0,
      volume: 1.0,
      progressUpdateIntervalMillis: 1000
    };
    const { sound, status } = await Audio.Sound.createAsync(
      source,
      initialStatus,
      this._onPlaybackStatusUpdate
    );
    this.playbackInstance = sound;

    this._updateScreenForLoading(false);
  }

  _updateScreenForLoading(isLoading) {
    if (isLoading) {
      this.setState({
        isPlaying: false,
        playbackInstanceDuration: null,
        playbackInstancePosition: null,
        isLoading: true
      });
    } else {
      this.setState({
        isLoading: false
      });
    }
  }

  _onPlaybackStatusUpdate = status => {
    if(this.transitionActive) {
      return;
    }
    if (status.isLoaded) {
      this.setState({
        playbackInstancePosition: status.positionMillis,
        playbackInstanceDuration: status.durationMillis,
        shouldPlay: status.shouldPlay,
        isPlaying: status.isPlaying,
        isLoading: false
      });
      if (status.didJustFinish) {
        this._advanceIndex(true);
        this._updatePlaybackInstanceForIndex(true);
      }
    } else {
      if (status.error) {
      }
    }
  };

  _advanceIndex(forward) {
    this.index =
      (this.index + (forward ? 1 : this.playlist.length - 1)) %
      this.playlist.length;
  }

  async _updatePlaybackInstanceForIndex(playing) {
    this._updateScreenForLoading(true);
    this._loadNewPlaybackInstance(playing);
  }

  _onPlayPausePressed = () => {
    if (this.playbackInstance != null) {
      if (this.state.isPlaying) {
        this.playbackInstance.pauseAsync();
      } else {
        this.playbackInstance.playAsync();
      }
    }
  };

  _onStopPressed = () => {
    if (this.playbackInstance != null) {
      this.playbackInstance.stopAsync();
    }
  };

  _onForwardPressed = () => {
    if (this.playbackInstance != null) {
      this._advanceIndex(true);
      this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
    }
  };

  _onBackPressed = () => {
    if (this.playbackInstance != null) {
      this._advanceIndex(false);
      this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
    }
  };

  _onSeekSliderValueChange = value => {
    if (this.playbackInstance != null && !this.isSeeking) {
      this.isSeeking = true;
      this.shouldPlayAtEndOfSeek = this.state.shouldPlay;
      this.playbackInstance.pauseAsync();
    }
  };

  _onSeekSliderSlidingComplete = async value => {
    if (this.playbackInstance != null) {
      this.isSeeking = false;
      const seekPosition = value * this.state.playbackInstanceDuration;
      if (this.shouldPlayAtEndOfSeek) {
        this.playbackInstance.playFromPositionAsync(seekPosition);
      } else {
        this.playbackInstance.setPositionAsync(seekPosition);
      }
    }
  };

  _getSeekSliderPosition() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return (
        this.state.playbackInstancePosition /
        this.state.playbackInstanceDuration
      );
    }
    return 0;
  }

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = number => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  }

  _getTimestamp() {
    if (
      this.playbackInstance != null &&
      this.state.playbackInstancePosition != null &&
      this.state.playbackInstanceDuration != null
    ) {
      return `${this._getMMSSFromMillis(
        this.state.playbackInstancePosition
      )} / ${this._getMMSSFromMillis(this.state.playbackInstanceDuration)}`;
    }
    return "";
  }
  musicBarPosition() {
    const height = this.position.y.interpolate({
      inputRange: [0, Dimensions.get("window").height],
      outputRange: [0, Dimensions.get("window").height]
    });
    return {
      height: height
    };
  }
  musicBoxHeight() {
    const height = this.position.y.interpolate({
      inputRange: [
        0,
        Dimensions.get("screen").height - 300,
        Dimensions.get("screen").height - 300
      ],
      outputRange: [61, 0, 0]
    });
    return {
      height: height
    };
  }
  openPlayer(position) {
    this.transitionActive = true;
    this.playerOpen = true;
    setTimeout(() => {
      this.transitionActive = false;
    }, 2000);
    this.position.setValue({
      x: 0,
      y: 0
    });
    Animated.timing(position, {
      toValue: { x: 0, y: Dimensions.get("window").height }
    }).start();
  }
  closePlayer(position) {
    this.transitionActive = true;
    setTimeout(() => {
      this.transitionActive = false;
    }, 2000);
    this.playerOpen = false;
    Animated.timing(position, {
      toValue: { x: 0, y: 0 }
    }).start();
  }
  inPlaylist(target) {
    for (var i = 0; i < this.playlist.length; i++) {
      if (this.playlist[i].songId == target.songId) {
        return i;
      }
    }
    return -1;
  }
  addSong(song, list, toPlay) {

    if (list != null) {
      const l = this.playlist.length;
      if (toPlay == 'play') {
        this.playlist = list;
        this._loadNewPlaybackInstance(true);
        ToastAndroid.show('Please Wait', ToastAndroid.LONG);

        if (this.playbackInstance != null) {
          if (this.state.isPlaying) {
            this.playbackInstance.pauseAsync();
          }
          this.playbackInstance.playAsync();
        }
      }
    }
    else if (typeof song == "object" && toPlay == 'play') {
      const l = this.playlist.length;
      const index = this.inPlaylist(song);
      if (index < 0) this.playlist.unshift(song);
      else this.index = index;
      if (l == 0) {
        this.playbackInstance = null;
        this._loadNewPlaybackInstance(true);
      } else {
        this.index = 0;
        if (this.playbackInstance != null) {
          this._updatePlaybackInstanceForIndex(this.state.shouldPlay);
        }
      }
    }
    else if (typeof song == "object" && toPlay == 'add') {
      const index = this.inPlaylist(song);
      if (index < 0) this.playlist.push(song);
    }
    else if (toPlay == 'hide') {
      if (this.playbackInstance != null) {
        if (this.state.isPlaying) {
          this.playbackInstance.pauseAsync();
        }
      }
      this.setState({ playerHidden: true });
    }
    else if (toPlay == 'show') {
      if (this.playbackInstance != null) {
        if (!this.state.isPlaying) {
          this.playbackInstance.playAsync();
        }
      }
      this.setState({ playerHidden: false });
    }
  }


  render() {
    
    return (
      <MenuProvider renderToHardwareTextureAndroid={true} hardwareAccelerated={true} style={{ flex: 1 }}>
        <View style={{ flex: 1, marginBottom: (this.playlist.length != 0 && this.state.playerHidden == false) ? 61 : 0 }}>
          <NavigaterMenu
            screenProps={(x, y, z) => {
              this.addSong(x, y, z);
            }}
            props={this.props}
          />
        </View>
        {(this.playlist != null && this.playlist.length != 0 && this.state.playerHidden == false) ? (
          <Animated.View
          
          useNativeDriver={true}
            {...this._panResponder.panHandlers}
            hardwareAccelerated={true}
            renderToHardwareTextureAndroid={true}
            style={{ ...styles.musicBar, ...this.musicBarPosition() }}
          >
            <Animated.View
            useNativeDriver={true}
              renderToHardwareTextureAndroid={true}
              hardwareAccelerated={true}
              style={{ ...styles.playerContainer, ...this.musicBoxHeight() }}
            >
              <View
                style={{ flex: 1, flexDirection: "row", backgroundColor: '#333333' }}
              >
                <TouchableOpacity
                  style={styles.imgContainer}
                  onPress={() => {
                    this.openPlayer(this.position);
                  }}
                >
                  <Image
                    source={{
                      uri:
                        this.playlist != null && this.playlist.length != 0
                          ? this.playlist[this.index].songImg
                          : ""
                    }}
                    style={styles.imgCard}
                  />
                </TouchableOpacity>
                <View style={styles.bodyContainer}>
                  <View style={styles.infos}>
                    <Text numberOfLines={1} style={styles.songText}>
                      {this.playlist != null && this.playlist.length != 0
                        ? this.playlist[this.index].songName
                        : "No Song played!"}
                    </Text>
                    <Text numberOfLines={1} style={styles.artistText}>
                      {this.playlist != null && this.playlist.length != 0
                        ? this.playlist[this.index].artistOne +
                        (this.playlist[this.index].artistOne || " ")
                        : "."}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={this._onPlayPausePressed}
                    style={styles.controler}
                  >
                    {!this.state.isPlaying ? (
                      <FontAwesome name="play" style={styles.play} />
                    ) : (
                        <FontAwesome name="pause" style={styles.play} />
                      )}
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
            <View style={{ flex: 1, backgroundColor: "#222" }}>
              <View
                style={styles.musicPlayer}
              >
                <View style={styles.containerInner}>
                  <View style={styles.header}>
                    <TouchableOpacity
                      onPress={() => {
                        this.closePlayer(this.position);
                      }}
                    >
                      <MaterialIcons
                        name="keyboard-arrow-down"
                        color="#777"
                        size={32}
                        style={{ padding: 10 }}
                      />
                    </TouchableOpacity>
                    <Modal
                      animationType="slide"
                      hardwareAccelerated={true}
                      visible={this.state.playlistOpen}
                      animationType={"slide"}
                      onRequestClose={() => {
                        this.setState({ playlistOpen: false });
                      }}
                    >
                      <PlaylistComponent
                        play={x => {
                          if (this.playbackInstance != null) {
                            this.index = x;
                            this._updatePlaybackInstanceForIndex(
                              this.state.shouldPlay
                            );
                          }
                        }}
                        close={() => {
                          this.setState({ playlistOpen: false });
                        }}
                        playlist={this.playlist}
                      />
                    </Modal>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ playlistOpen: true });
                      }}
                    >
                      <MaterialIcons
                        name="playlist-play"
                        color="#777"
                        size={32}
                        style={{ padding: 10 }}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.portraitContainer}>
                    <Image
                      style={styles.portrait}
                      source={{
                        uri:
                          this.playlist != null && this.playlist.length != 0
                            ? this.playlist[this.index].songImg
                            : "../../assets/listing-music.jpg"
                      }}
                    />
                  </View>
                  <View style={styles.detailsContainer}>
                    <Text
                      numberOfLines={1}
                      style={{ ...styles.text, ...styles.textTitle }}
                    >
                      {this.playlist != null && this.playlist.length != 0
                        ? this.playlist[this.index].songName
                        : ""}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{ ...styles.text, ...styles.textArtist }}
                    >
                      {this.playlist != null && this.playlist.length != 0
                        ? this.playlist[this.index].artistOne +
                        (this.playlist[this.index].artistTwo
                          ? ", " + this.playlist[this.index].artistTwo
                          : "")
                        : ""}
                    </Text>
                    <Text style={{ ...styles.text, ...styles.textTime }}>
                      {this._getTimestamp() || "00:00 / 00:00"}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.playbackContainer,
                      {
                        opacity: this.state.isLoading ? 0.7 : 1.0
                      }
                    ]}
                  >
                    <Slider
                      style={styles.playbackSlider}
                      value={this._getSeekSliderPosition()}
                      onValueChange={this._onSeekSliderValueChange}
                      onSlidingComplete={this._onSeekSliderSlidingComplete}
                      thumbTintColor="#aaf"
                      minimumTrackTintColor="#fff"
                      maximumTrackTintColor="#fff"
                      disabled={this.state.isLoading}
                    />
                  </View>
                  <View style={styles.controler}>
                    <TouchableOpacity
                      style={styles.wrapper}
                      onPress={this._onBackPressed}
                    >
                      <View>
                        <MaterialIcons
                          name="fast-rewind"
                          size={40}
                          color="#eee"
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ ...styles.wrapper, ...styles.playBtn }}
                      onPress={this._onPlayPausePressed}
                      disabled={this.state.isLoading}
                    >
                      <View>
                        {this.state.isPlaying ? (
                          <MaterialIcons name="pause" size={40} color="#eee" />
                        ) : (
                            <MaterialIcons
                              name="play-arrow"
                              size={40}
                              color="#eee"
                            />
                          )}
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.wrapper}
                      onPress={this._onForwardPressed}
                    >
                      <View>
                        <MaterialIcons
                          name="fast-forward"
                          size={40}
                          color="#eee"
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>)
          : (<View></View>)}
      </MenuProvider>
    );
  }
}
export default App;
// hua kya tik
const styles = StyleSheet.create({
  musicBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 61,
    minHeight: 61,
  },
  playerContainer: {
    flexDirection: "row",
    height: 61,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  imgContainer: {
    flex: 1
  },
  imgCard: {
    flex: 1,
    backgroundColor: "#efefef"
  },
  bodyContainer: {
    backgroundColor: "rgba(20,20,20,0.5)",
    flex: 2,
    flexDirection: "row",
    padding: 10
  },
  infos: {
    flex: 3
  },
  songText: {
    color: "#fff"
  },
  artistText: {
    color: "#fff"
  },
  controler: {
    justifyContent: "space-around"
  },
  play: {
    width: 30,
    height: 30,
    textAlign: "center",
    justifyContent: "space-around",
    paddingLeft: 2,
    paddingVertical: 8,
    color: "#fff",
    borderRadius: 100,
    backgroundColor: "rgba(70,70,200,0.8)",
    fontSize: 14
  },
  musicPlayer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch",
    flex: 1
  },
  containerInner: {
    flex: 1,
    backgroundColor: "rgba(30,30,30,0.7)"
  },
  controler: {
    padding: 20,
    justifyContent: "space-around",
    flexDirection: "row",
    alignContent: "center",
    alignItems: "center"
  },
  header: {
    padding: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    width: Dimensions.get("window").width
  },
  wrapper: {
    alignItems: "center",
    padding: 9
  },
  playBtn: {
    padding: 17,
    textAlign: "center",
    borderRadius: 100,
    backgroundColor: "rgba(70,70,200,0.8)"
  },
  portraitContainer: {
    marginVertical: 10
  },
  portrait: {
    height: (Dimensions.get("window").width * 9) / 16,
    width: Dimensions.get("window").width
  },
  detailsContainer: {
    marginTop: 5,
    alignItems: "center",
    padding: 10
  },
  playbackContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "stretch"
  },
  playbackSlider: {
    marginTop: 5,
    alignSelf: "stretch",
    height: 10,
    padding: 20,
    marginLeft: 10,
    marginRight: 10
  },
  text: {
    fontSize: 15,
    height: 16,
    textAlign: "center",
    margin: 10
  },
  textTitle: {
    fontFamily: "sans-serif-thin",
    fontSize: 20,
    color: "rgba(255,255,255,0.9)",
    height: null
  },
  textArtist: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    fontFamily: "sans-serif-thin",
    height: null
  },
  textTime: {
    fontFamily: "monospace",
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
    height: 30
  }
});
