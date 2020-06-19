import React, { Component } from 'react';
import { Text, FlatList, View, AsyncStorage } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import SongListLayout from '../layout/SongListLayout';
export default class RecentSong extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Song: ''
        }
    }
    render() {
        
        AsyncStorage.getItem('song')
            .then((res) => JSON.parse(res))
            .then((data) => {
                this.setState({ Song: data });
            }).catch(() => {
                this.setState({ Song: [] });
            })

        const newLocalSong = this.state.Song;
        return (
            <View>
                {
                    (newLocalSong == null) ?
                        (<View>
                            <Text>No recent Song Play (-_-).</Text>
                        </View>)
                        : ((newLocalSong.length == 0) ?
                            (<View>
                                <Text>Loading...</Text>
                            </View>)
                            :
                            (<View>
                                <FlatList
                                    renderToHardwareTextureAndroid={true}
                                    removeClippedSubviews={true}
                                    maxToRenderPerBatch={5}
                                    showsVerticalScrollIndicator={false}
                                    updateCellsBatchingPeriod={100}
                                    windowSize={5}
                                    keyExtractor={song => song.songId}
                                    data={newLocalSong}
                                    renderItem={songs => {
                                        return (
                                            <SongListLayout data={songs} screenProps={this.props.screenProps} />
                                        );
                                    }}
                                />
                            </View >))
                }
            </View>

        );
    }
}
RecentSong.navigationOptions = {
    tabBarIcon: ({ tintColor, focused }) => (
        <MaterialIcons
            name={focused ? 'music-video' : 'queue-music'}
            color={tintColor}
            size={25}
        />
    )
};


