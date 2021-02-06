import React, { Component } from 'react'
import { Text, View, Share,  StyleSheet, Image, ToastAndroid, AsyncStorage } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import MoreOptionPopupMenu from '../optionMenu/MoreOptionPopupMenu';
import ShareHandlerComponent from '../handler/ShareHandlerComponent';


class SongListLayout extends Component {
    constructor(props) {
        super(props)


        this.state = {
            loadedData: false
        }
    }

    shouldComponentUpdate() {
        return false;
    }


    render() {

        const item = this.props.data;

        const playBtnHandler = (songObj) => {
            this.props.screenProps(songObj, null, 'play');
            ToastAndroid.show('Playing', ToastAndroid.SHORT);


            // add ascynstore Data
            const song = item;
            const loaded = this.state.loadedData;
            const songData = {
                songId: song.item.songId,
                songName: song.item.songName,
                songImg: song.item.songImg,
            }
            const newSongId = songData.songId;
            if (newSongId != '') {
                if (!loaded) {
                    this.setState({ loadedData: true });

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
                this.setState({ loadedData: false })
                AsyncStorageData(song)

            }
        }

        const shareBtnHandler = (songId) => {
            const shareUrl = ShareHandlerComponent.songShare.url + songId;
            Share.share({
                message: shareUrl,
            })
        }
        return (
            <View style={styles.songViewContainer} renderToHardwareTextureAndroid={true}>
                <TouchableOpacity
                    onPress={() => {
                        playBtnHandler(item.item);
                    }}
                    style={styles.songView}
                    onLongPress={() =>
                        shareBtnHandler(item.item.songId)
                    }
                >
                    <Image
                        resizeMode="cover"
                        source={{ uri: item.item.songImg }}
                        style={styles.songViewImg}
                    />
                    <Text style={styles.songViewText} numberOfLines={2}>
                        {item.item.songName}
                    </Text>
                </TouchableOpacity>
                <View style={styles.songViewIcon}>
                    <View style={styles.moreOptionIcon}>
                        <MoreOptionPopupMenu dataSongId={item.item}
                            songName={item.item.songName} screenProps={this.props.screenProps} navigation={this.props.navigation} />
                    </View>
                </View>
            </View>

        )
    }
}
export default SongListLayout;
const styles = StyleSheet.create({

    songListContainer: {},
    songViewContainer: {
        flexDirection: "row",
        padding: 5,
        marginBottom: 2,
        marginTop: 2,
        flex: 1,
        backgroundColor: "#efefef",
        shadowRadius: 2,
        shadowOffset: {
            width: 2,
            height: 3
        },
        shadowColor: "#000000",
        elevation: 4
    },
    songViewImg: {
        width: 70,
        height: 40
    },

    songViewText: {
        padding: 5,
        fontSize: 10,
        flexGrow: 1,
        width: 240
    },
    songView: {
        flexDirection: "row",
        flex: 3
    },
    songViewIcon: {
        justifyContent: "space-around",
        flexDirection: "row",
        paddingHorizontal: 3
    },
    moreOptionIcon: {
        padding: 5
    },
    textContainer: {
        padding: 20
    },

});