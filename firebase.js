import firebase from 'firebase';


const firebaseConfig = {
    apiKey: "AIzaSyDivK7lnb128UdidoA5i4jhigu70WB9cbI",
    authDomain: "clone-e993b.firebaseapp.com",
    projectId: "clone-e993b",
    storageBucket: "clone-e993b.appspot.com",
    messagingSenderId: "1024579259882",
    appId: "1:1024579259882:web:55db65743937e6c3feb693",
    measurementId: "G-677BRZF5XN"
  };


const app = !firebase.apps.length
   ? firebase.initializeApp(firebaseConfig)
   : firebase.app();

const db = app.firestore();


export default db;
