import React, { Component } from 'react';
import Play from './Play/Play';
import Home from './Home/Home';

import firebase from '../config/fbConfig.js';
import withFirebaseAuth from 'react-with-firebase-auth';
import 'firebase/auth';

import { BrowserRouter, Route } from 'react-router-dom';

import triangle from './Resources/triangle3.svg';
import Login from './Login/Login';

export class Typer extends Component {
	state = {
		loggedin: false,
		color: 'black',
		username: ''
	};

	componentDidMount() {}

	componentDidUpdate(prevProps) {
		if (this.props.user && !this.state.username) {
			console.log('USER LOGGED IN');
			firebase
				.firestore()
				.collection('users')
				.doc(this.props.user.uid)
				.get()
				.then(doc => {
					this.setState({
						username: doc.data().username,
						color: doc.data().color
					});
				});
		}
	}

	render() {
		let { user, signOut, signInWithEmailAndPassword } = this.props;
		let guest = { uid: 'Guest' + Math.floor(Math.random() * 100000000) };
		return (
			<div>
				<div className="overflower">
					<img src={triangle} className="stretch" alt="aa" />
				</div>
				<BrowserRouter>
					<Route exact path="/" render={() => <Home />} />
					{console.log('USERNAME: ' + this.state.username)}
					<Route
						path="/play"
						render={() => (
							<Play
								user={user ? user : guest}
								username={this.state.username}
								color={this.state.color}
							/>
						)}
					/>
					<Route
						path="/login"
						render={() => <Login signIn={signInWithEmailAndPassword} />}
					/>
				</BrowserRouter>
				<button
					onClick={() => {
						firebase
							.firestore()
							.collection('games')
							.doc('pKNCH6nuyoCNPi5M2qgQ')
							.get()
							.then(doc => {
								console.log('player keys: ');
								console.log(Object.keys(doc.data().players).length);

								// this.setState({ text: doc.data().text });
							});
					}}
				>
					Debuginator
				</button>
				<button
					onClick={() =>
						signInWithEmailAndPassword('o.heimdahl@gmail.com', 'password')
					}
				>
					Logga in
				</button>
				<button onClick={() => signOut()}>Logga ut</button>
				<div style={{ color: 'white' }}>{user ? user.uid : 'user null'}</div>
			</div>
		);
	}
}

// const mapStateToProps = state => {
// 	return {
// 		password: state.firebase.password
// 	};
// };

// const mapDispatchToProps = dispatch => {
// 	return {
// 		createPost: data => dispatch(createPost(data))
// 	};
// };

const firebaseAppAuth = firebase.auth();
const providers = {
	googleProvider: new firebase.auth.GoogleAuthProvider()
};

export default withFirebaseAuth({
	providers,
	firebaseAppAuth
})(Typer);

// export default withCookies(Typer);
