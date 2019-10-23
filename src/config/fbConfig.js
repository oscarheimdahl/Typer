import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/functions';

var config = {
	apiKey: 'AIzaSyBWqYSow7bPDykJf_sLeOGVBfHc6DcD1w8',
	authDomain: 'typer-14eb6.firebaseapp.com',
	databaseURL: 'https://typer-14eb6.firebaseio.com',
	projectId: 'typer-14eb6',
	storageBucket: 'typer-14eb6.appspot.com',
	messagingSenderId: '100028943652',
	appId: '1:100028943652:web:fec9cef437a92c38c4b7b1'
};
firebase.initializeApp(config);
// firebase.firestore().settings({
// 	timestampsInSnapshots: true
// });

// class Firebase {
// 	constructor() {
// 		firebase.initializeApp(config);
// 		firebase.firestore().settings({
// 			timestampsInSnapshots: true
// 		});
// 		this.auth = firebase.auth();
// 		this.db = firebase.firestore();
// 	}

// 	login(email, password) {
// 		return this.auth.signInWithEmailAndPassword(email, password);
// 	}

// 	logout() {
// 		return this.auth.signOut();
// 	}

// 	getUser() {
// 		return this.auth.onAuthStateChanged();
// 	}
// }

export default firebase; //new Firebase();
