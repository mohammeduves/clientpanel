import { createStore, combineReducers, compose } from "redux";
import firebase from "firebase";
import "firebase/firestore";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
import notifyReducer from "./reducers/notifyReducer";
import settingsReducer from "./reducers/settingsReducer"; //Reducers
//@todo

const firebaseConfig = {
  apiKey: "AIzaSyCjMjKYLZ_-iF5if9vVy9U3IvU55xLq2M8",
  authDomain: "reactclientpanel-83b43.firebaseapp.com",
  databaseURL: "https://reactclientpanel-83b43.firebaseio.com",
  projectId: "reactclientpanel-83b43",
  storageBucket: "reactclientpanel-83b43.appspot.com",
  messagingSenderId: "948496536348"
};

//react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true //Firestore for Profile instead of Realtime DB
};

//Init firebase instance
firebase.initializeApp(firebaseConfig);
//Init firestore
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase) // <- needed if using firestore
)(createStore);

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
  notify: notifyReducer,
  settings: settingsReducer
});

//Check For Settings in Local Storage
if (localStorage.getItem("settings") == null) {
  //Default Settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };

  //Set to localstorage
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

//Create initial state
const initialState = {
  settings: JSON.parse(localStorage.getItem("settings"))
};

//Create store
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
