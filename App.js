import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    Image,
} from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlatList } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';

class ArticleView extends Component {

    constructor(props){

        super(props);

        this.state = {
            styles: StyleSheet.create({

                outerArticleContainer: {
                    flex: 1,
                    flexDirection: 'column',
                    width: '100%',
                    marginTop: 20,
                },

                innerArticleContiner: {
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: 'rgba(0,153,255,0.5)',
                    marginRight: 5,
                    marginLeft: 5,
                },

                image: {
                    width: 100,
                    height: 60,
                },

                textView: {
                    flex: 1,
                    flexDirection: 'column',
                    height: 60,
                    paddingLeft: 5,
                },

                titleText: {
                    fontSize: 10,
                    fontWeight: 'bold',
                    fontFamily: 'Roboto',
                }

            })
        };

    }

    render(){
        return(
            <View style={this.state.styles.outerArticleContainer}>
                <View style={this.state.styles.innerArticleContiner}>
                    <Image 
                        source={{uri: this.props.imageUrl}}
                        style={this.state.styles.image}
                    />
                    <View style={this.state.styles.textView}>
                        <Text style={this.state.styles.titleText}>{this.props.title}</Text>
                    </View>
                </View>
            </View>
        )
    }
}

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
                    renderItem={({ item, index }) =>
                        <ArticleView
                            key={index} 
                            title={item.title}
                            imageUrl={item.imageUrl}
                        />
                    }
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
        marginTop: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    },
});