import React, { useState } from 'react'
import { Text, View, StyleSheet, Platform, ScrollView } from 'react-native'
import { TextInput, FlatList, TouchableOpacity } from 'react-native-gesture-handler';

import ApiHandelComponent from './handler/ApiHandelComponent';
import SongListLayout from './layout/SongListLayout';
import ChannelCard from './layout/ChannelCard';
import ArtistCard from './layout/ArtistCard';



var timer;
const list = {
    song: [],
    artist: [],
    channel: []
}
const url = {
    song: '',
    artist: '',
    channel: ''
};
const radioBtnValue = {
    value: 2,
}
const SearchComponent = (props) => {



    const fromLimit = 0; //kha se start ho
    const toLimit = 1; //per page kitne item

    const [loading, setLoading] = useState('Type Something to search!');
    const [searchText, setSearchText] = useState();
    const [radioButtonValue, setRadioButtonValue] = useState('2');

    const loadSong = async () => {
        await fetch(url.song)
            .then((response) => response.json())
            .then(responseJson => {
                list.song = (responseJson.songResult);
            })
            .catch(() => {
            });
        setLoading('Loaded');
    }


    const loadArtist = async () => {
        await fetch(url.artist)
            .then((response) => response.json())
            .then(responseJson => {
                list.artist = (responseJson.artistResult);
            })
            .catch(() => {
            });
        setLoading('Loaded');

    }

    const loadChannel = async () => {

        await fetch(url.channel)
            .then((response) => response.json())
            .then(responseJson => {
                list.channel = (responseJson.channelResult);
            })
            .catch(() => {
            });
        setLoading('Loaded');

    }

    const searchInputHandler = (text) => {
        setSearchText(text);

        if (timer) {
            clearTimeout(timer);
        }
        if (text == '') {
            setLoading('Type Something to search!')
            return;
        }
        timer = setTimeout(() => {
            list.song = [];
            list.artist = [];
            list.channel = [];
            setLoading('Loading...');

            if (radioBtnValue.value == 0) {
                url.artist = ApiHandelComponent.searchArtist.url + fromLimit + "/" + toLimit + "/" + text;
                loadArtist();

            } else if (radioBtnValue.value == 1) {
                url.channel = ApiHandelComponent.searchChannel.url + fromLimit + "/" + toLimit + "/" + text;
                loadChannel();

            } else {
                url.song = ApiHandelComponent.searchSong.url + fromLimit + "/" + toLimit + "/" + text;
                loadSong();

            }

        }, 500);
    }


    const options = [
        {
            key: '0',
            text: 'Artist',
        },
        {
            key: '1',
            text: 'Channel',
        },
        {
            key: '2',
            text: 'Song',
        },
    ];
    // ser radio button value 
    const radioButtonHanlder = (key) => {
        setRadioButtonValue(key);
        radioBtnValue.value = (key);
    }

    const DataHandler = (value, list) => {
        let type = value.radioBtnValue.value;
        let datalist = list.list;

        if (type == 0) {
            return (
                <View style={styles.listContainer} renderToHardwareTextureAndroid={true}>
                    <Text style={styles.resultTitle}>Search Artist Result</Text>
                    <FlatList
                        style={styles.songListContainer}
                        renderToHardwareTextureAndroid={true}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={5}
                        showsVerticalScrollIndicator={false}
                        updateCellsBatchingPeriod={100}
                        windowSize={5}
                        data={datalist.artist}
                        keyExtractor={(item) => item.ar_id}
                        renderItem={(item) => {
                            return (
                                <ArtistCard data={item.item} nav={props.navigation} />
                            );
                        }}
                    />
                </View>
            )

        } else if (type == 1) {
            return (
                <View style={styles.listContainer} renderToHardwareTextureAndroid={true}>
                    <Text style={styles.resultTitle}>Search Channel Result</Text>
                    <FlatList
                        style={styles.songListContainer}
                        renderToHardwareTextureAndroid={true}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={5}
                        showsVerticalScrollIndicator={false}
                        updateCellsBatchingPeriod={100}
                        windowSize={5}
                        data={datalist.channel}
                        keyExtractor={(item) => item.c_id}
                        renderItem={() => {
                            return (
                                <ChannelCard data={channel} nav={props.navigation} />
                            );
                        }}
                    />
                </View>
            )

        }
        else {
            return (
                <View style={styles.listContainer} renderToHardwareTextureAndroid={true}>
                    <Text style={styles.resultTitle}>Search Song Result</Text>
                    <FlatList
                        style={styles.songListContainer}
                        renderToHardwareTextureAndroid={true}
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={5}
                        showsVerticalScrollIndicator={false}
                        updateCellsBatchingPeriod={100}
                        windowSize={5}
                        data={datalist.song}
                        keyExtractor={(item) => item.songId}
                        renderItem={(item) => {
                            return (
                                <SongListLayout data={item} screenProps={props.screenProps} />
                            );
                        }}
                    />
                </View>
            )
        }

    }


    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false} renderToHardwareTextureAndroid={true}>
            <View style={styles.searchContainer}>
                <Text style={styles.searchText}>Search</Text>
            </View>
            {
                <View style={styles.buttonContainer}>
                    {options.map(item => {
                        return (
                            <View key={item.key} style={styles.innerBtnContainer}>
                                <TouchableOpacity
                                    style={styles.circle}
                                    onPress={() => radioButtonHanlder(item.key)}// we set our value state to key
                                >
                                    {radioButtonValue === item.key && (<View style={styles.checkedCircle} />)}
                                </TouchableOpacity>
                                <Text style={styles.btnText}>{item.text}</Text>
                            </View>
                        )
                    })}
                </View>
            }
            <View style={styles.inputCotainer}>
                <TextInput
                    placeholderTextColor='rgba(255,255,255,0.7)'
                    style={styles.textInput}
                    placeholder="Command me what you love !"
                    onChangeText={(text) => {
                        searchInputHandler(text)
                    }}
                    value={searchText}
                />
            </View>
            {
                (loading != 'Loaded') ? <Text style={{ alignSelf: 'center' }}>{loading}</Text> : DataHandler({ radioBtnValue }, { list })
            }

        </ScrollView>

    )
}

export default SearchComponent;

const styles = StyleSheet.create({
    container: {
        marginTop: (Platform.OS == 'android') ? 24 : 0,
        flex: 1,
    },
    searchContainer: {
        justifyContent: "center",
        textAlign: "center",
    },
    searchText: {
        textAlign: "center",
        fontSize: 48,
        fontFamily: 'sans-serif-thin',
    },
    inputCotainer: {
        backgroundColor: '#2e3a4f',
        margin: 20,
        borderRadius: 10,
    },
    textInput: {
        flex: 1,
        fontFamily: "sans-serif-thin",
        fontSize: 20,
        padding: 10,
        color: '#fff'
    },
    listContainer: {
        flex: 1,
    },
    resultTitle: {
        margin: 15,
        marginHorizontal: 20,
        fontSize: 20,
        color: "rgba(70,70,20,0.8)"

    },
    // radio btn
    buttonContainer: {
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    innerBtnContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',

    },
    btnText: {
        paddingHorizontal: 10,
    },
    circle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ACACAC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#794F9B',
    },

})