import React, { Component } from 'react';
import { View, Text, FlatList, AsyncStorage } from 'react-native';
import { MaterialIcons } from "@expo/vector-icons";
import ArtistCard from '../layout/ArtistCard';
export default class RecentArtist extends Component {
    constructor(props) {
        super(props)

        this.state = {
            artists: ''
        }
    }
    render() {
        AsyncStorage.getItem('artist')
            .then((res) => JSON.parse(res))
            .then((data) => {
                this.setState({ artists: { data } })
            }).catch((e) => {
                this.setState({ artists: [] })
            })

        const newLocalArtist = this.state.artists;
        return (
            (newLocalArtist == null) ?
                (<View>
                    <Text>No recent Artist Viewed (-_-).</Text>
                </View>)
                : ((newLocalArtist.length == 0) ?
                    (<View>
                        <Text>Loading...</Text>
                    </View>)
                    :
                    (
                        <View>
                            <FlatList
                               renderToHardwareTextureAndroid={true}
                               removeClippedSubviews={true}
                               maxToRenderPerBatch={5}
                               showsVerticalScrollIndicator={false}
                               updateCellsBatchingPeriod={100}
                               windowSize={5}
                                numColumns={4}
                                keyExtractor={artist => artist.ar_id}
                                data={newLocalArtist}
                                renderItem={artist => {
                                    return (
                                        <ArtistCard data={artist.item} nav={this.props.navigation} />
                                    );
                                }}
                            />
                        </View >))

        );
    }
}
RecentArtist.navigationOptions = {
    tabBarIcon: ({ tintColor, focused }) => (
        <MaterialIcons
            name={focused ? 'people' : 'person'}
            color={tintColor}
            size={25}
        />
    )
} 