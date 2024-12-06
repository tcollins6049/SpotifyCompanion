import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, browserLocalPersistence, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
    apiKey: 'AIzaSyBXz0ljt0Sa62rCK9It_UlDlZwoSXTaQZU',
    authDomain: "spotify-clone-ceac3.firebaseapp.com",
    projectId: "spotify-clone-ceac3",
    storageBucket: "spotify-clone-ceac3.appspot.com",
    messagingSenderId: "334962620499",
    appId: "1:334962620499:android:79f3d0ad0ae9e1a450aea6"
}


const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
const firestore = getFirestore(app);

export { app, firestore, auth };
