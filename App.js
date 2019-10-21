import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar
} from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlatList } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';

export class MyNewsScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Welcome to My News screen</Text>
            </View>
        )
    }
}

export class TopicsScreen extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>Welcome to Topics screen</Text>
            </View>
        )
    }
}

export class HeadlinesScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        return fetch('https://www.infinitynews.org/api')
            .then(response => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    data: responseJson
                },
                function () {
                    // console.log(responseJson);
                });
            }).catch((error) => {
                console.error(error);
            })
    }

    render() {

        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator />
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item, index }) => <View key={index}><Text>{item['title']}</Text></View>}
                />
            </View>
        )
    }
}
    
const tabNavigator = createBottomTabNavigator({
    MyNews: {
        screen: MyNewsScreen,
        navigationOptions: {
        tabBarLabel: 'My News',
        tabBarIcon: ({tintColor}) => (
            <Icon name="ios-infinite" color={tintColor} size={24} />
        )
    }
},
    Topics: {
        screen: TopicsScreen,
        navigationOptions: {
            tabBarLabel: 'My Topics',
            tabBarIcon: ({tintColor}) => (
            <Icon name="ios-filing" color={tintColor} size={24} />
        )
    }
},
    Headlines: {
        screen: HeadlinesScreen,
        navigationOptions: {
            tabBarLabel: 'Headlines',
            tabBarIcon: ({tintColor}) => (
                <Icon name="ios-flame" color={tintColor} size={24} />
            )
        }
    }
}, {
    initialRouteName: 'MyNews',
    order: ['MyNews', 'Topics', 'Headlines'],
    navigationOptions: {
        tabBarVisible: true
    },
    tabBarOptions: {
        activeTintColor: '#0099ff',
        inactiveTintColor: 'gray'
    }
});
        
export default createAppContainer(tabNavigator);
        
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
        padding: 20 
    },
});