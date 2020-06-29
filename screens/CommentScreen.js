import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, FlatList} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/pt-br';
import Fire from '../Fire';
import UserPermissions from '../utils/UserPermissions';

const firebase = require('firebase');
require('firebase/firestore')


var comments = [];
var postsAvatar = [];

let dbAvatar = firebase.firestore().collection('users');
let queryAvatar = dbAvatar.get()
    .then(snapshot => {
        if (snapshot.empty) {
        console.log('No matching documents.');
        return;
        }

        snapshot.forEach(doc => {
        //console.log(doc.id, '=>', doc.data().text);
        var id = doc.id
        var data = {id, ...doc.data()}
        postsAvatar.push(data);
        });
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });

export default class CommentScreen extends React.Component{
    state = {
        text: '',
        user: {}
    };

    unsubscribe = null

    componentDidMount(){
        const params = this.props.navigation.state.params;

        try{
            let db = firebase.firestore().collection('posts').doc(params);
            let query = db.get()
                .then(snapshot => {
                    if (snapshot.empty) {
                    console.log('No matching documents.');
                    return;
                    }
                    var a = Object.keys(snapshot.data().comments).length;
                    if(comments.length < a || comments.length > a){
                        while (comments.length) {
                            comments.pop();
                        }
                    }
                        //console.log(doc.id, '=>', doc.data().text);
                        var data = snapshot.data().comments
                        comments.push(data);
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                });
                
                //console.log(comments)
        } catch(err){
            console.log(err)
        }

        const user = this.props.uid || Fire.shared.uid;

        this.unsubscribe = Fire.shared.firestore.collection('users').doc(user).onSnapshot(doc => {
            this.setState({user: doc.data()})
        })
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    renderComment = post => {
        //console.log(post)
        var postid;
        return(
            <>
                {post.map(res => {
                    postid = res.uid;
                    return(
            
                        <View key={res.idPost} style={styles.feedItem}>
                                
                            {postsAvatar.map(res1 => {
                                //console.log(res)
                                if(res1.id == postid){
                                    return <Image source={{uri: res1.avatar}} style={styles.avatar}/>
                                }
                            })}
                            <View style={{flex: 1}}>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <View>
                                        {res.id == post.uid && (
                                                <>
                                                    <Text style={styles.name}>{res.name}</Text>
                                                    <Text style={styles.timestamp}>{moment(res.timestamp).locale('pt-br').fromNow()}</Text>
                                                </>
                                                )
                                        }
                                        
                                    </View>
                                </View>
                                <Text style={styles.post}>
                                    {res.text}
                                </Text>
                            </View>
                        </View>
                    )
                })}
            </>
        )
    }

    handlePostComment = () => {
        const params = this.props.navigation.state.params;

        Fire.shared.addPostComment({text: this.state.text.trim(), user: this.state.user, id: params}).then(ref => {
            this.setState({text: ''});
            this.props.navigation.goBack();
        })
        .catch(err => {
            alert(err);
        })
    }
    
    
    render(){

        return (
            <ScrollView style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name='md-arrow-back' size={24} color='#D8D9DB'></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handlePostComment}>
                        <Text style={{fontWeight: 'bold'}}>Comentar</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    style={styles.feed}
                    data={comments}
                    renderItem={({item}) => this.renderComment(item)}
                    keyExtractor={item => item.idPost}
                    showsVerticalScrollIndicator={false}
                />
                <View style={styles.inputContainer}>
                    <Image source={{uri: this.state.user.avatar}} style={styles.avatar}></Image>
                    <TextInput 
                        autoFocus={false} 
                        multiline={true} 
                        numberOfLines={4} 
                        placeholder='Digite seu Post...'
                        onChangeText={text => this.setState({text})}
                        value={this.state.text}
                    ></TextInput>
                </View>
            </ScrollView>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        paddingVertical: 12,
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#D8D9Db'
    },
    inputContainer: {
        margin: 32,
        flexDirection: 'row',
        paddingTop: 100
    },
    photo: {
        alignItems: 'flex-end',
        marginHorizontal: 32
    },
    feed: {
        marginHorizontal: 16,
        flexDirection: 'column'
    },
    feedItem: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        padding: 8,
        flexDirection: 'row',
        marginVertical: 8
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16
    },
    name: {
        fontSize: 15,
        fontWeight: '500',
        color: '#454D65'
    },
    timestamp: {
        fontSize: 11,
        color: '#C4C6CE',
        marginTop: 4
    },
    post: {
        marginTop: 16,
        fontSize: 14,
        color: '#838899'
    },
    postImage: {
        width: undefined,
        height: 150,
        borderRadius: 5,
        marginVertical: 16
    }
})