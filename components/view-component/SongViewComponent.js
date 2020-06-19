import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, ToastAndroid, Share, Dimensions } from 'react-native';
import { TouchableOpacity, FlatList } from 'react-native-gesture-handler';
import { MaterialIcons } from "@expo/vector-icons";
import ApiHandelComponent from '../handler/ApiHandelComponent';
import ShareHandlerComponent from '../handler/ShareHandlerComponent';
import SongListLayout from '../layout/SongListLayout';
import Searchbtn from '../layout/Searchbtn';
import Preloader from '../layout/Preloader';

var fromLimit = 0; //kha se start ho
var channelUrl = '';
const SongViewComponent = (props) => {
    const toLimit = 25; //per page kitne item
    const limitOrder = "D";

    const [songInfo, setSongInfo] = useState([]);
    const [state, setstate] = useState({
        channelSong: [],
        loading: true,
    })

    // change share sonh Id
    const shareSongongId = props.navigation.state.params.dataSongId;
    const songUrl = ApiHandelComponent.songInfo.url + shareSongongId;

    const channelSonngList = () => {
        fetch(channelUrl)
            .then(response => response.json())
            .then(responseJson => {
                (
                    setstate({ channelSong: [...state.channelSong, ...responseJson.channelResult], loading: false })
                )
            })
            .catch(error => {

            });
    }
    useEffect(() => {
        fetch(songUrl)
            .then(response => response.json())
            .then(responseJson => {
                setSongInfo(responseJson);

                channelUrl = ApiHandelComponent.channelSongList.url + fromLimit + "/" + toLimit + "/" + limitOrder + "/" + responseJson[0].channelId;

                channelSonngList();
            })
            .catch(error => {
            });
    }, []);


    const playBtnHandler = (song) => {
        props.screenProps(song, null, 'play');
    ToastAndroid.show('Playing', ToastAndroid.SHORT);
    }
    const addPlayListBtnHandler = (songId) => {
        props.screenProps(song, null, 'add');
        ToastAndroid.show('Add Queue', ToastAndroid.SHORT);
    }
    const shareBtnHandler = (songId) => {
        const shareUrl = ShareHandlerComponent.songShare.url + songId;
        Share.share({
            message: shareUrl,
        })
    }
    const _loadMoreDataHandler = () => {
        fromLimit += 25;
        channelSonngList();
    }
    return (
        <View style={styles.container}>
            <Preloader data={state.loading} />
            {

                songInfo.map((song) => {
                    const releseData = song.releaseDate.split('T');
                    return (
                        <View key={song.songId} style={styles.infoContainer}>
                            <View style={styles.imgContainer}>
                                <Image style={styles.thumbnail} resizeMode="cover" source={{ uri: song.songImg }} />
                            </View>
                            <View style={styles.textContainer}>
                                <View style={styles.textInnerContainer}>
                                    <MaterialIcons name="music-note" style={styles.textIcon} />
                                    <Text numberOfLines={1} style={styles.songNameText}> {song.songName}</Text>
                                </View>
                                <View style={styles.textInnerContainer}>
                                    <MaterialIcons name="people" style={styles.textIcon} />
                                    <Text numberOfLines={1} style={styles.iconText}>{song.artistOne}{(song.artistTwo != '') ? ', ' + song.artistTwo : ''}</Text>
                                </View>
                                <View style={styles.textInnerContainer}>
                                    <MaterialIcons name="shop" style={styles.textIcon} />
                                    <Text numberOfLines={1} style={styles.iconText}> {song.channelName}</Text>
                                </View>
                                <View style={styles.textInnerContainer}>
                                    <MaterialIcons name="today" style={styles.textIcon} />
                                    <Text numberOfLines={1} style={styles.iconText}>{releseData[0]}</Text>
                                    <View style={styles.btnContainer}>
                                        <TouchableOpacity style={{ ...styles.btn, ...styles.play }} onPress={() => playBtnHandler(song)}>
                                            <MaterialIcons name="play-arrow" style={styles.btnIcon} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ ...styles.btn, ...styles.playList }} onPress={() => addPlayListBtnHandler(song)}>
                                            <MaterialIcons name="playlist-play" style={styles.btnIcon} />
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{ ...styles.btn, ...styles.share }} onPress={() => (song.songId)}>
                                            <MaterialIcons name="share" style={styles.btnIcon} />
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>
                        </View>
                    )
                })
            }
            <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Releted Songs Result</Text>
            </View>
            <FlatList
                onEndReached={() => _loadMoreDataHandler()}
                renderToHardwareTextureAndroid={true}
                removeClippedSubviews={true}
                maxToRenderPerBatch={5}
                showsVerticalScrollIndicator={false}
                updateCellsBatchingPeriod={100}
                windowSize={5}
                keyExtractor={(channelSong) => channelSong.id}
                data={state.channelSong}
                renderItem={(channelSong) => {
                    return (
                        <SongListLayout data={channelSong} screenProps={props.screenProps} />
                    )
                }}

            />

        </View>
    )
}
SongViewComponent.navigationOptions = ({ navigation }) => {
    const { navigate } = navigation;
    return {
        headerTitle: () => (
            <Text numberOfLines={1} style={{ width: Dimensions.get('screen').width - 120, fontSize: 15 }}>{navigation.state.params.songName}</Text>
        ),
        headerRight: () => <Searchbtn navigate={navigate} />

    }
}
export default SongViewComponent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    infoContainer: {
        margin: 0,
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderColor: '#1F1F1F'
    },
    imgContainer: {
        flex: 1,
        paddingLeft: 3,
        paddingTop: 14,
    },
    thumbnail: {
        width: null,
        height: 70,
    },
    textContainer: {
        padding: 10,
        flex: 2,
    },
    textInnerContainer: {
        flexDirection: 'row',
    },
    textIcon: {
        padding: 3,
        fontSize: 14,
        paddingEnd: 4,

    },
    songNameText: {
        flex: 1,
        fontWeight: 'bold',
    },
    iconText: {
        flex: 1,
        padding: 2,
        fontSize: 12,
    },
    btnContainer: {
        padding: 5,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    btn: {
        borderRadius: 50,
        padding: 3,
        marginEnd: 10,
    },
    play: {
        backgroundColor: '#39EB7F',
    },
    playList: {
        backgroundColor: '#1DA6F3',
    },
    share: {
        backgroundColor: '#FF992C'
    },
    btnIcon: {
        fontSize: 24,
    },
    resultContainer: {
        padding: 4,
        paddingHorizontal: 5,
    },
    resultTitle: {
        fontSize: 20,
        paddingBottom: 5,
        color: "rgba(70,70,20,0.8)"

    },



})