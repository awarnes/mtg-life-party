import * as firebase from 'firebase/app';
import 'firebase/firestore';

import firebaseConfig from './firebaseSecrets';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export { db };
