import React, {Component} from 'react';
import{
    View,
    Text,
    StyleSheet,
} from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

export class MyNewsScreen extends Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>Welcome to My News screen</Text>
            </View>
        )
    }
}

export class TopicsScreen extends Component{
    render(){
        return(
            <View style={styles.container}>
                <Text>Welcome to Topics screen</Text>
            </View>
        )
    }
}

export class HeadlinesScreen extends Component{

    constructor(props){
        super(props);
        this.state = { isLoading: true }
    }

    componentDidMount(){
        return fetch('https://www.infinitynews.org/api')
        .then(response => response.json())
        .then((responseJson) => {
            this.setState({
                isLoading: false,
                data: JSON.stringify(responseJson)
            }, 
            function(){
            
            });
        }).catch((error) => {
            console.error(error);
        })
    }

    render(){

        if(this.state.isLoading){
            return(
                <View style={styles.container}>
                    <Text>Welcome to Headlines screen</Text>
                </View>
            )
        }

        return(
            <View style={styles.container}>
                <Text>{this.state.data}</Text>
            </View>
        )
    }
}

const tabNavigator = createBottomTabNavigator({
    MyNews: {
        screen: MyNewsScreen,
        navigationOptions: {
            tabBarLabel: 'My News',
            tabBarIcon: ({ tintColor }) => (
                <Icon name="ios-infinite" color={tintColor} size={24} />
            )
        }
    },
    Topics: {
        screen: TopicsScreen,
        navigationOptions: {
            tabBarLabel: 'My Topics',
            tabBarIcon: ({ tintColor }) => (
                <Icon name="ios-filing" color={tintColor} size={24} />
            )
        }
    },
    Headlines: {
        screen: HeadlinesScreen,
        navigationOptions: {
            tabBarLabel: 'Headlines',
            tabBarIcon: ({ tintColor }) => (
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
        justifyContent: 'center'
    },
});