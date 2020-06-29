import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, FlatList} from 'react-native';
import firebase from 'firebase';
require('firebase/firestore');
import Fire from '../Fire';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

var posts = [];
var postsAvatar = [];
var followers = [];
var follow = [];
var following;

    
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

    

    //console.log(postsAvatar)


export default class ProfileOutScreen extends React.Component{
    state = {
        user: {}
    }

    unsubscribe = null

    componentDidMount(){
        const params = this.props.navigation.state.params;
        console.log(params)
        let db = firebase.firestore().collection('posts').where('uid', '==', params);
        let query = db.get()
        .then(snapshot => {
            if (snapshot.empty) {
            console.log('No matching documents.');
            return;
            }

            

            snapshot.forEach(doc => {
                
                //console.log(doc.id, '=>', doc.data().text);
                var id = doc.id
                var data = doc.data();
                posts.push(data)
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
        let dbFollow = firebase.firestore().collection('users').doc(params);
        let queryAvatar = dbFollow.get()
        .then(snapshot => {
            if (snapshot.empty) {
            console.log('No matching documents.');
            return;
            }

            var id = snapshot.id
            followers.push(snapshot.data().seguidores)
            follow.push(snapshot.data().seguindo)
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
        //console.log(followers)
        
        const user = this.props.uid || Fire.shared.uid;

        this.unsubscribe = Fire.shared.firestore.collection('users').doc(user).onSnapshot(doc => {
            this.setState({user: doc.data()})
        })
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    signOut = () => {
        firebase.auth().signOut()
    }

    renderPost = post => {
        //console.log(post)
            return(
                <View style={styles.feedItem}>
                    {postsAvatar.map(res => {
                        //console.log(res)
                        if(res.id == post.uid){
                            return <Image source={{uri: res.avatar}} style={styles.avatarFeed}/>
                        }
                    })}
                    <View style={{flex: 1}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                            <View>
                                <Text style={styles.nameFeed}>{postsAvatar.map(res => {
                                    if(res.id == post.uid){
                                        return res.name
                                    }
                                })}</Text>
                                <Text style={styles.timestamp}>{moment(post.timestamp).fromNow()}</Text>
                            </View>
                            <Ionicons style={{marginRight: 10}} name='ios-more' size={24} color='#73788B'/>
                        </View>
                        <Text style={styles.post}>{post.text}</Text>
                        <Image source={{uri: post.image}} style={styles.postImage} resizeMode='cover'/>
                        <View style={{flexDirection: 'row'}}>
                            <Ionicons name='ios-heart' size={24} color='#73788B' style={{marginRight: 16}}/>
                            <Text style={{color: '#73788B', marginRight: 16}}>{post.likes}</Text>
                            <Ionicons name='ios-chatboxes' size={24} color='#73788B'/>
                            <Text style={{color: '#73788B', marginLeft: 16}}>{post.comment}</Text>
                        </View>
                    </View>
                </View>
            )
        
    }

    handleFollow = () => {
        const params = this.props.navigation.state.params;

        followers.map(fol => {
            console.log(fol)
            if(fol.length == 0){
                following = true;
                Fire.shared.addFollow({ user: this.state.user, id: params}).then(ref => {
                    this.props.navigation.goBack();
                })
                .catch(err => {
                    alert(err);
                })
            }else if(fol.uid.indexOf(this.state.user.uid) !== -1){
                following = false;
                Fire.shared.removeFollow({user: this.state.user, id: params}).then(ref => {
                    this.props.navigation.goBack();
                })
                .catch(err => {
                    alert(err);
                })
            } else {
                following = true;
                Fire.shared.addFollow({ user: this.state.user, id: params}).then(ref => {
                    this.props.navigation.goBack();
                })
                .catch(err => {
                    alert(err);
                })
            }
        })

        
    }

    render(){
        const params = this.props.navigation.state.params;
        console.log(following)
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Ionicons name='md-arrow-back' size={24} color='#D8D9DB'></Ionicons>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handleFollow}>
                        <Text style={{fontWeight: 'bold'}}>{following == false ? 'Deixar de Seguir':'Seguir'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop: 64, alignItems: 'center'}}>
                    <View style={styles.avatarContainer}>
                        {postsAvatar.map(res => {
                            if(res.id == params){
                                return(
                                    <Image style={styles.avatar} source={res.avatar ? {uri: res.avatar} : require('../assets/temavatar.jpg')}/>
                                )
                            }
                        })}
                    </View>
                    <Text style={styles.name}>
                    {postsAvatar.map(res => {
                            if(res.id == params){
                                return res.name
                            }
                        })}
                    </Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.stat}>
                        <Text style={styles.statsAmount}>{posts.length}</Text>
                        <Text style={styles.statsTitle}>Posts</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statsAmount}>{followers.length}</Text>
                        <Text style={styles.statsTitle}>Seguidores</Text>
                    </View>
                    <View style={styles.stat}>
                        <Text style={styles.statsAmount}>{follow.length}</Text>
                        <Text style={styles.statsTitle}>Seguindo</Text>
                    </View>
                </View>
                <FlatList 
                    style={styles.feed}
                    data={posts}
                    renderItem={({item}) => this.renderPost(item)}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
                <TouchableOpacity onPress={this.signOut}>
                    <Text>Sair</Text>
                </TouchableOpacity>
            </View>
        )
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    avatarContainer: {
        shadowColor: '#151732',
        shadowRadius: 15,
        shadowOpacity: 0.4
    },
    avatar: {
        width: 136,
        height: 136,
        borderRadius: 68
    },
    name: {
        marginTop: 24,
        fontSize: 26,
        fontWeight: 'bold'
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 32
    },
    stat: {
        alignItems: 'center',
        flex: 1
    },
    statsAmount: {
        color: '#4F566D',
        fontSize: 18,
        fontWeight: "300"
    },
    statsTitle: {
        color: '#C3C5CD',
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4
    },
    feed: {
        marginHorizontal: 16,
    },
    feedItem: {
        backgroundColor: '#FFF',
        borderRadius: 5,
        padding: 8,
        flexDirection: 'row',
        marginVertical: 8
    },
    avatarFeed: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 16
    },
    nameFeed: {
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 32,
        paddingVertical: 12,
        marginTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#D8D9Db'
    }
})