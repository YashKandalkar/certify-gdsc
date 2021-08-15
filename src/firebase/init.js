import firebase from "firebase/app";

// These imports load individual services into the firebase namespace.
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNNhMeMP5xDeS4cu-EgbfwOPbsH2JoBoM",
  authDomain: "certify-gdsc.firebaseapp.com",
  projectId: "certify-gdsc",
  storageBucket: "certify-gdsc.appspot.com",
  messagingSenderId: "363283581333",
  appId: "1:363283581333:web:203a20e4958244186f0e9c",
  databaseURL:
    "https://certify-gdsc-default-rtdb.asia-southeast1.firebasedatabase.app/",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

export { firebaseApp };
