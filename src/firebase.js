
import firebase from 'firebase';

const firebaseApp=firebase.initializeApp({
    apiKey: "AIzaSyBVCQZc-HtmBm3cPWZjN_wO8i4JKQCD1LM",
    authDomain: "foodies-ba608.firebaseapp.com",
    projectId: "foodies-ba608",
    storageBucket: "foodies-ba608.appspot.com",
    messagingSenderId: "29052208982",
    appId: "1:29052208982:web:3b0d73d26cda2422c9b8f7",
});

const db=firebaseApp.firestore(); //firetore is a database
const auth=firebase.auth();//auth is for handling user
const storage=firebase.storage();

export { db,auth,storage };