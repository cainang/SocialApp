import firebase from 'firebase';
require('firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyA1Ff0YxZ7pv6NKPfPz9d31P7eNFpdAvoo",
    authDomain: "socialapp-6c4f0.firebaseapp.com",
    databaseURL: "https://socialapp-6c4f0.firebaseio.com",
    projectId: "socialapp-6c4f0",
    storageBucket: "socialapp-6c4f0.appspot.com",
    messagingSenderId: "1083746092217",
    appId: "1:1083746092217:web:4f5bce1bb50006cb538768",
    measurementId: "G-XPVHK71KCK"
  };

class Fire{
    constructor(){
        if  ( ! firebase . apps . length )  { 
            firebase.initializeApp(firebaseConfig);
          }
    }

    addPost = async ({text, localUri}) => {
        const remoteUri = await this.uploadPhotoAsync(localUri, `photos/${this.uid}/${Date.now()}`);
        const idPost = `${this.uid}-${this.timestamp}`;

        return new Promise((res, rej) => {
            this.firestore.collection('posts').add({
                text,
                uid: this.uid,
                timestamp: this.timestamp,
                image: remoteUri,
                likes: 0,
                idPost: idPost,
                comments: []
            })
            .then(ref => {
                res(ref);
            })
            .catch(err => {
                rej(err);
            })
        })
    }

    addPostComment = async ({text, user, id}) => {
        const idPostComment = `${this.uid}-${this.timestamp}`;
        console.log(id)
        const data = {
            text,
            name: user.name,
            uid: this.uid,
            timestamp: this.timestamp,
            idPost: idPostComment
        }

        return new Promise((res, rej) => {
            this.firestore.collection('posts').doc(id).update({
                comments: firebase.firestore.FieldValue.arrayUnion(data)
            })
            .then(ref => {
                res(ref);
            })
            .catch(err => {
                rej(err);
            })
        })
    }

    addFollow = async ({user, id}) => {
        const idFollow = `${this.uid}-${this.timestamp}`;
        //console.log(id)
        const data = {
            name: user.name,
            uid: this.uid,
            timestamp: this.timestamp,
            _id: idFollow
        }

        const dataMe = {
            uid: id,
            timestamp: this.timestamp,
            _id: idFollow
        }

        return new Promise((res, rej) => {
            this.firestore.collection('users').doc(id).update({
                seguidores: firebase.firestore.FieldValue.arrayUnion(data)
            })
            .then(ref => {
                res(ref);
            })
            .catch(err => {
                rej(err);
            })
            this.firestore.collection('users').doc(this.uid).update({
                seguindo: firebase.firestore.FieldValue.arrayUnion(dataMe)
            })
            .then(ref => {
                res(ref);
            })
            .catch(err => {
                rej(err);
            })
        })
    }

    removeFollow = async ({user, id}) => {
        const idFollow = `${this.uid}-${this.timestamp}`;
        //console.log(id)
        const data = {
            name: user.name,
            uid: this.uid,
            timestamp: this.timestamp,
            _id: idFollow
        }

        const dataMe = {
            uid: id,
            timestamp: this.timestamp,
            _id: idFollow
        }

        return new Promise((res, rej) => {
            this.firestore.collection('users').doc(id).update({
                seguidores: firebase.firestore.FieldValue.arrayRemove(data)
            })
            .then(ref => {
                res(ref);
            })
            .catch(err => {
                rej(err);
            })
            this.firestore.collection('users').doc(this.uid).update({
                seguindo: firebase.firestore.FieldValue.arrayRemove(dataMe)
            })
            .then(ref => {
                res(ref);
            })
            .catch(err => {
                rej(err);
            })
        })
    }

    uploadPhotoAsync = async (uri, filename) => {
        return new Promise(async (res, rej) => {
            const response = await fetch(uri);
            const file = await response.blob();

            let upload = firebase.storage().ref(filename).put(file);

            upload.on("state_changed", snapshot => {}, err => {rej(err);}, 
            async () => {
                const url = await upload.snapshot.ref.getDownloadURL();
                res(url);
            })
        })
    }

    createUser = async user => {
        let remoteUri = null;

        try{
            await firebase.auth().createUserWithEmailAndPassword(user.email, user.senha);

            let db = this.firestore.collection('users').doc(this.uid);

            db.set({
                name: user.name,
                email: user.email,
                avatar: null,
                seguidores: [],
                seguindo: []
            })

            if(user.avatar){
                remoteUri = await this.uploadPhotoAsync(user.avatar, `avatars/${this.uid}`);

                db.set({avatar: remoteUri}, {merge: true});
            }
        } 
        catch(err){
            alert("Error: ", err);
        }
    }

    get firestore(){
        return firebase.firestore();
    }

    get uid(){
        return (firebase.auth().currentUser || {}).uid;
    }

    get timestamp(){
        return Date.now();
    }
}

Fire.shared = new Fire();
export default Fire;