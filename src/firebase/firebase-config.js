// firebase-config.js
import * as firebase from "firebase/app";

import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAqwgV6NgLTbuZyLuERICsLAb3srEVQngI",
  authDomain: "gb-77-8a9cc.firebaseapp.com",
  projectId: "gb-77-8a9cc",
  storageBucket: "gb-77-8a9cc.appspot.com",
  messagingSenderId: "218016810702",
  appId: "1:218016810702:web:5ca404e0d760fe3619f29f",
};

const app = firebase.initializeApp(firebaseConfig);
const firebaseApp = getAuth(app);

export default firebaseApp;
