import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    Image,
    AsyncStorage,
    TouchableOpacity,
    TextInput,
    Linking,
    RefreshControl,
} from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlatList, TouchableHighlight } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';

_storeTopics = async (topicsArray) => {
    try{
        const topicsStr = topicsArray.join(',')
        await AsyncStorage.setItem('TOPICS', topicsStr);
    } catch (error) {
        console.error(error);
    }
}

_retrieveTopics = async() => {

    try{

        const topicsString = await AsyncStorage.getItem('TOPICS');

        if (topicsString !== null) {
            const topicsArray = topicsString.split(',');
            return topicsArray;
        }

        else {
            _storeTopics(["mexico"]).then(() => {
                return _retrieveTopics();
            });
        }

    } catch (error) {

        console.error(err);

        _storeTopics(["mexico"]).then(() => {
            return _retrieveTopics();
        });

    }
}

class ArticleView extends Component {

    constructor(props){

        super(props);

        var imageUrl = this.props.imageUrl;
        if(imageUrl === "" || imageUrl === "https://s4.reutersmedia.net/resources_v2/images/rcom-default.png"){
            imageUrl = "https://i.ytimg.com/vi/3JUtQsAbtCQ/maxresdefault.jpg";
        }
        var datePublished = this.props.publishedAt.split("T")[0];

        this.state = {
            datePublished: datePublished,
            imageUrl: imageUrl,
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
                    backgroundColor: 'rgba(0,153,255, 1)',
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
                    fontFamily: 'symbol',
                    color: '#EEE',
                },

                sourceText: {
                    fontSize: 10,
                    fontFamily: 'georgia',
                    color: '#AA0077'
                },

                dateText: {
                    fontSize: 8,
                    fontFamily: 'menlo',
                    color: 'rgba(0,0,0, 1)'
                }

            })
        };

    }

    componentDidUpdate(prevProps){
        if(prevProps.imageUrl !== this.props.imageUrl || prevProps.datePublished !== this.props.datePublished){
            var imageUrl = this.props.imageUrl;
            if(imageUrl === "" || imageUrl === "https://s4.reutersmedia.net/resources_v2/images/rcom-default.png"){
                imageUrl = "https://i.ytimg.com/vi/3JUtQsAbtCQ/maxresdefault.jpg";
            }
            var datePublished = this.props.publishedAt.split("T")[0];
            this.setState({
                imageUrl: imageUrl,
                datePublished: datePublished,
            });
            this.forceUpdate();
        }
    }

    render(){
        return(
            <View style={this.state.styles.outerArticleContainer}>
                <View style={this.state.styles.innerArticleContiner}>
                    <TouchableHighlight onPress={() => Linking.openURL(this.props.articleUrl)} style={this.state.styles.image}>
                        <Image 
                            source={{uri: this.state.imageUrl}}
                            style={this.state.styles.image}
                        />
                    </TouchableHighlight>
                    <View style={this.state.styles.textView}>
                        <Text style={this.state.styles.titleText}>{this.props.title}</Text>
                        <Text numberOfLines={1}>
                            <Text style={this.state.styles.sourceText}>{this.props.source}</Text>
                            <Text style={this.state.styles.dateText}> | {this.state.datePublished}</Text>
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

export class TopicsScreen extends Component {

    constructor(props) {

        super(props);
        this.topicsArray = [];

        this.state = {
            isLoading: true,
            topicsArrayHolder: [],
            textInputHolder: '',

            styles: StyleSheet.create({

                textInputStyle: {
                    marginLeft: '5%',
                    marginRight: '5%',
                    height: 40,
                    width: '90%',
                    borderWidth: 1,
                    borderColor: '#4CAF50',
                    borderRadius: 7,
                    marginTop: 12,
                    textAlign: 'center',
                    color: 'white',
                  },

                  button: {
                    marginLeft: '5%',
                    marginRight: '5%',
                    width: '90%',
                    height: 40,
                    padding: 10,
                    backgroundColor: '#4CAF50',
                    borderRadius: 8,
                    marginTop: 10
                  },
                 
                  buttonText: {
                    color: '#fff',
                    textAlign: 'center',
                  },

                  outerTopicContainer: {
                    flex: 1,
                    flexDirection: 'column',
                    marginLeft: '5%',
                    marginRight: '5%',
                    width: '90%',
                    marginTop: 20,
                },

                innerTopicContainer: {
                    flex: 1,
                    flexDirection: 'row',
                    backgroundColor: 'rgba(0,153,255,1)',
                    marginRight: 5,
                    marginLeft: 5,
                },

                outerTrashContainer: {
                    width: 100,
                    height: 60,
                    backgroundColor: 'red',
                },

                innerTrashContainer: {
                    marginLeft: '40%',
                    marginTop: '10%',
                    backgroundColor: 'red',
                },

                topicView: {
                    flex: 1,
                    flexDirection: 'column',
                    height: 60,
                    paddingLeft: 20,
                },

                topicText: {
                    fontSize: 24,
                    fontFamily: 'symbol',
                    color: '#EEE',
                }

            }),

        };
    }

    componentDidMount() {
        _retrieveTopics().then((topicsArray) => {
            this.topicsArray = topicsArray;
            console.log(this.topicsArray);
            this.setState({
                isLoading: false,
                topicsArrayHolder: [...this.topicsArray],
            });
        });
    };

    removeDataByIndex = (removedTopicIndex) => {
        this.topicsArray.splice(removedTopicIndex, 1);
        _storeTopics(this.topicsArray).then(() => {
            this.setState({
                topicsArrayHolder: [...this.topicsArray],
            })
        });
    }

    joinData = () => {
        this.topicsArray.push(this.state.textInputHolder);
        _storeTopics(this.topicsArray).then(() => {
            this.setState({
                topicsArrayHolder: [...this.topicsArray]
            });
        });
    }

    render() {

        if(this.state.isLoading){
            return (
                <View style={styles.container}>
                    <ActivityIndicator />
                </View>
            );
        }

        return(
            <View style={styles.container}>
                <TextInput 
                    placeholder='Add topic'
                    onChangeText={data => this.setState({ textInputHolder: data })}
                    style={this.state.styles.textInputStyle}
                    underlineColorAndroid='transparent'
                />

                <TouchableOpacity
                    onPress={this.joinData}
                    activeOpacity={0.7}
                    style={this.state.styles.button}
                >
                    <Text style={this.state.styles.buttonText}>Add Topic</Text>
                </TouchableOpacity>
                       
                <FlatList
                    data={this.state.topicsArrayHolder}
                    renderItem={({ item, index }) =>
                        <View style={this.state.styles.outerTopicContainer}>
                            <View style={this.state.styles.innerTopicContainer}>
                                <View style={this.state.styles.outerTrashContainer}>
                                    <View style={this.state.styles.innerTrashContainer}>
                                        <Icon reverse name="ios-trash" color='white' size={30} onPress={() => this.removeDataByIndex(index)}/>
                                    </View>
                                </View>
                                <View style={this.state.styles.topicView}>
                                    <Text style={this.state.styles.topicText}>{this.state.topicsArrayHolder[index]}</Text>
                                </View>
                            </View>
                        </View>
                    }
                />
            </View>
        );
        
    }
}

export class MyNewsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
        }
    }

    fetch = () => {
        _retrieveTopics().then((topics) => {

            const topicsString = "'" + topics.join("','") + "'";

            const uri = 'https://www.infinitynews.org/api/topics?q=' + topicsString;
            console.log(uri); 
            
            fetch(uri)
            .then(response => response.json())
            .catch((error) => {
                console.error(error);
                this.setState({refreshing: false});
            })
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    data: responseJson,
                    refreshing: false,
                },
                function () {
                    // console.log(responseJson);
                });
            }).catch((error) => {
                console.error(error);
                this.setState({refreshing: false});
            });

        });
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.fetch();
    }

    componentDidMount() {
        this.fetch();        
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
                <Text style={styles.titleText}>My News</Text>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item, index }) =>
                        <ArticleView
                            key={index} 
                            title={item.title}
                            source={item.source}
                            publishedAt={item.publishedAt}
                            imageUrl={item.imageUrl}
                            articleUrl={item.url}
                        />
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
                        />
                    }
                />
            </View>
        )
    }
}

export class HeadlinesScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            refreshing: false,
        }
    }

    fetch = () => {
        fetch('https://www.infinitynews.org/api')
            .then(response => response.json())
            .catch((error) => {
                console.error(error);
                this.setState({refreshing: false});
            })
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    data: responseJson,
                    refreshing: false,
                },
                function () {
                    // console.log(responseJson);
                });
            }).catch((error) => {
                console.error(error);
                this.setState({refreshing: false});
            });
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.fetch();
    }

    componentDidMount() {
        this.fetch();
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
                <Text style={styles.titleText}>Today's headlines</Text>
                <FlatList
                    data={this.state.data}
                    renderItem={({ item, index }) =>
                        <ArticleView
                            key={index} 
                            title={item.title}
                            source={item.source}
                            publishedAt={item.publishedAt}
                            imageUrl={item.imageUrl}
                            articleUrl={item.url}
                        />
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh.bind(this)}
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
    initialRouteName: 'Headlines',
    order: ['MyNews', 'Topics', 'Headlines'],
    navigationOptions: {
        tabBarVisible: true,
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
        backgroundColor: '#111'
    },

    titleText: {
        marginTop: 15,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'rgba(0,153,255,1)',
    }
});