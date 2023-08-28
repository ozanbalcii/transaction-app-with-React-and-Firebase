import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyDRhvbDkLP956dSowTQLGIykVo_5ZudzDg",
    authDomain: "mymoney-590a9.firebaseapp.com",
    projectId: "mymoney-590a9",
    storageBucket: "mymoney-590a9.appspot.com",
    messagingSenderId: "870522988754",
    appId: "1:870522988754:web:f338268614bec5b800250b"
  };
  // initialize firebase
  firebase.initializeApp(firebaseConfig)

  // init service
    const projectFirestore = firebase.firestore()
    const projectAuth = firebase.auth()

  // timestamp
  const timestamp = firebase.firestore.Timestamp

    export { projectFirestore, projectAuth, timestamp }