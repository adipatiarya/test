import firebase from 'firebase'

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyCYrWcxgGrkYx-z-Eml-LBtk2fGZDfxhBI',
  authDomain: 'pendaftaran-fdc46.firebaseapp.com',
  databaseURL: 'https://pendaftaran-fdc46.firebaseio.com',
  projectId: 'pendaftaran-fdc46',
  storageBucket: 'pendaftaran-fdc46.appspot.com',
  messagingSenderId: '1099342269167'
};

firebase.initializeApp(config);
const auth = firebase.auth();

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();
const twitterAuthProvider = new firebase.auth.TwitterAuthProvider();

const database = firebase.database();

export {
  auth,
  database,
  googleAuthProvider,
  githubAuthProvider,
  facebookAuthProvider,
  twitterAuthProvider
};

