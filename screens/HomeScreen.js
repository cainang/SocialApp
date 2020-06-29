import React,{useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import 'moment/locale/pt-br';
import firebase from 'firebase';
import Fire from '../Fire';
require('firebase/firestore');

var posts = [];
var postsAvatar = [];
var postsUsers = [];
var iddac = '';
var iddac1 = '';

    let db = firebase.firestore().collection('posts');
    let dbAvatar = firebase.firestore().collection('users');
    

    
    

    //console.log(postsAvatar)

export default class HomeScreen extends React.Component{
    componentDidMount(){
        let query = db.get()
        .then(snapshot => {
            if (snapshot.empty) {
            console.log('No matching documents.');
            return;
            }

            snapshot.forEach(doc => {
                
            //console.log(doc.id, '=>', doc.data().text);
            var data = doc.data()
            posts.push(data);
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
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
        console.log(posts)
    }
    handleLike = async (id) => {
        let likesp = 0;
        
        let dbLike = firebase.firestore().collection('posts').where('idPost', '==', id);
        await dbLike.get().then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }
            snapshot.forEach(doc => {
                //console.log(doc.id, '=>', doc.data().text);
                var id = doc.id;
                iddac = doc.id;
                var data = {id, ...doc.data()}
                likesp = doc.data().likes;
            });
            try{
                firebase.firestore().collection('posts').doc(iddac).update({
                    likes: likesp + 1
                });
            } catch (err){
                console.log(err)
            }
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
        
    }
    onLearnMore = async (item) => {

        let dbl = firebase.firestore().collection('posts').where('idPost', '==', item);
        await dbl.get().then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }
            snapshot.forEach(doc => {
                //console.log(doc.id, '=>', doc.data().text);
                var id = doc.id;
                iddac = doc.id;
            });
            try{
                this.props.navigation.navigate('commentModal', iddac);
            } catch (err){
                console.log(err)
            }
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    };
    onNavP = async (item) => {
        //console.log(item)
        if(item !== Fire.shared.uid){
            console.log('lalolali')
            let dbl = firebase.firestore().collection('user').doc(item);
            await dbl.get().then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents.');
                    return;
                }
                    //console.log(doc.id, '=>', doc.data().text);
                    var id = snapshot.id;
                    iddac1 = snapshot.id;
                try{
                    this.props.navigation.navigate('profileModal', iddac1);
                } catch (err){
                    console.log(err)
                }
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
        } else {
            try {
                this.props.navigation.navigate('Profile');
            } catch (error) {
                
            }
        }
        
    };
    renderPost = post => {
        //console.log(post)
        return(
            <View key={post.uid} style={styles.feedItem}>
                <TouchableOpacity onPress={() => this.onNavP(post.uid)}>
                    {postsAvatar.map(res => {
                        //console.log(res)
                        if(res.id == post.uid){
                            return <Image source={{uri: res.avatar}} style={styles.avatar}/>
                        }
                    })}
                </TouchableOpacity>
                
                <View style={{flex: 1}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                        <View>
                            {postsAvatar.map(res => {
                                //console.log(res)
                                if(res.id == post.uid){
                                    return <Text style={styles.name}>{res.name}</Text>
                                }
                            })}
                            <Text style={styles.timestamp}>{moment(post.timestamp).locale('pt-br').fromNow()}</Text>
                        </View>
                        <Ionicons style={{marginRight: 10}} name='ios-more' size={24} color='#73788B'/>
                    </View>
                    <Text style={styles.post}>{post.text}</Text>
                    {post.image ? <Image source={{uri: post.image}} style={styles.postImage} resizeMode='cover'/>:<Text></Text>}
                    <View style={{flexDirection: 'row'}}>
                        
                                <TouchableOpacity onPress={() => this.handleLike(post.idPost)}>
                                    <Ionicons name='ios-heart-empty' size={24} color='#73788B' style={{marginRight: 16}}/>
                                </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.onLearnMore(post.idPost)}>
                            <Ionicons name='ios-chatboxes' size={24} color='#73788B'/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
    
    render(){
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        Feed
                    </Text>
                </View>

                <FlatList 
                    style={styles.feed}
                    data={posts}
                    renderItem={({item}) => this.renderPost(item)}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFECF4'
    },
    header:{
        paddingTop: 44,
        paddingBottom: 16,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#EBECF4',
        shadowColor: '#454D65',
        shadowOffset: {height: 5},
        shadowRadius: 15,
        shadowOpacity: 0.2,
        zIndex: 10
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '500'
    },
    feed: {
        marginHorizontal: 16
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
});