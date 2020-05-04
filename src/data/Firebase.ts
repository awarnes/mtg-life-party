import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/analytics';

import firebaseConfig from './firebaseSecrets';

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

export { db };
