import React, { useState } from "react";
import { Text, View, Image, StyleSheet, Share, AsyncStorage, ToastAndroid } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ShareHandlerComponent from "../handler/ShareHandlerComponent";
import MoreOptionPopupMenu from '../optionMenu/MoreOptionPopupMenu';

const SongCard = props => {

  const song = props.data;
  const [loaded, setLoaded] = useState(false)


  const songClickHandler = songObj => {
    props.screenProps(songObj, null, 'play');
    ToastAndroid.show('Playing', ToastAndroid.SHORT);

    // store data in AscynStore 
    const songData = {
      songId: song.item.songId,
      songName: song.item.songName,
      songImg: song.item.songImg,
    }
    const newSongId = songData.songId;
    if (newSongId != '') {
      if (!loaded) {
        setLoaded(true);

        AsyncStorage.getItem('song')
          .then((res) => JSON.parse(res))
          .then((oldSongData) => {

            oldSongData.find((element) => {
              if (element.songId != newSongId) {
                oldSongData.push(songData);
                oldSongData.unshift(songData);
                AsyncStorage.setItem('song', JSON.stringify(oldSongData));
              }
            });
          }).catch(() => {
            let oldSongData = [];
            oldSongData.push(songData);
            AsyncStorage.setItem('song', JSON.stringify(oldSongData));
          });
      }
    } else {
      setLoaded(false);
      AsyncStorageData(song)

    }
  };
  const shareBtnHandler = songId => {
    const shareUrl = ShareHandlerComponent.songShare.url + songId;
    Share.share({
      message: shareUrl
    });
  };

  return (
    <View>
      <View style={styles.moreOption}>
        <MoreOptionPopupMenu dataSongId={song.item}
          songName={song.item.songName} screenProps={props.screenProps} navigation={props.navigation} />
      </View>
      <TouchableOpacity
        onPress={() => {
          songClickHandler(song.item);
        }}
        onLongPress={() => shareBtnHandler(song.item.songId)}
      >
        <View style={styles.card}>
          <Image
            resizeMode="cover"
            source={{ uri: song.item.songImg }}
            style={styles.cardImage}
          />
          <Text style={styles.cardText} numberOfLines={2}>
            {song.item.songName}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};
export default SongCard;
const styles = StyleSheet.create({
  card: {
    padding: 4,
    flex: 1,
    flexDirection: "column"
  },
  cardImage: {
    width: 112,
    height: 63
  },
  cardText: {
    width: 112,
    fontSize: 10,
    flexGrow: 1,
    flex: 1
  },
  moreOption: {
    position: 'absolute',
    top: 3,
    right: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.29)',
    zIndex: 1,
  }
});
