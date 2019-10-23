import React, { Component } from 'react';
import InputHandler from '../InputHandler/InputHandler';
import Progress from '../Progress/Progress';

import Navbar from '../Navbar/Navbar';

import { Redirect } from 'react-router-dom';
import firebase from '../../config/fbConfig.js';
import './Play.css';

let opponentsInterval = 0;
// let toHome = false;
class Play extends Component {
	state = {
		complete: false,
		wpm: 0,
		time: 0,
		playerProgress: 0,
		opponents: null,
		redirect: false,
		goalPosition: null,
		startTime: null,
		text: ' '
	};

	componentDidMount() {
		this.joinedGame = false;
		this.toHome = false;
		console.log('play: ' + this.props.username);
	}

	componentDidUpdate(prevProps) {
		if (!this.joinedGame) {
			this.joinGame();
			this.joinedGame = true;
		}
	}
	componentWillUnmount() {
		this.joinedGame = false;
		this.toHome = false;
		clearInterval(opponentsInterval);
	}

	emit = data => {
		console.log('Emiting...');
		data.color = this.props.color;
		if (this.state.gameid) {
			let key = 'players.' + this.props.user.uid;
			firebase
				.firestore()
				.collection('games')
				.doc(this.state.gameid)
				.update({
					[key]: data
				});
		}
	};

	setComplete = () => {
		this.setState({ complete: true });
	};

	setProgress = playerProgress => {
		this.setState({ playerProgress });
	};

	setWPM = (wpm, time) => {
		this.setState({ wpm: wpm, time: time });
	};

	renderRedirect = () => {
		if (this.state.redirect) {
			return <Redirect to="/login" />;
		}
	};

	joinGame = () => {
		var fireFunction = firebase
			.app()
			.functions('europe-west1')
			.httpsCallable('getAvailableGame');
		fireFunction({
			uid: this.props.user.uid,
			username: this.props.username,
			color: this.props.color ? this.props.color : 'red'
		})
			.then(result => {
				this.setState({ gameid: result.data });
				this.getGame();
				console.log(result.data);
			})
			.catch(error => console.log(error));
	};

	getGame = () => {
		firebase
			.firestore()
			.collection('games')
			.doc(this.state.gameid)
			.get()
			.then(doc => {
				// console.log('player keys: ');
				// console.log(Object.keys(doc.data().players).length);

				this.setState({ text: doc.data().text });
			});

		firebase
			.firestore()
			.collection('games')
			.doc(this.state.gameid)
			.onSnapshot(doc => {
				let opponents = this.getOpponentData(doc);
				let startTime = doc.data().startTime;
				this.setState({ startTime, opponents });
			});
	};

	getOpponentData = doc => {
		let opponents = [];
		let playerMap = doc.data().players;
		let playersID = Object.keys(playerMap);
		playersID.forEach(playerID => {
			if (playerID !== this.props.user.uid) {
				let player = playerMap[playerID];
				opponents.push({
					wpm: player.wpm,
					progress: player.progress,
					color: player.color,
					username: playerID,
					goalPosition: 2
				});
			}
		});
		return opponents;
	};

	renderInputHandler = () => {
		return (
			<InputHandler
				complete={this.state.complete}
				text={this.state.text}
				emit={this.emit}
				setComplete={this.setComplete}
				setWPM={this.setWPM}
				wpm={this.state.wpm}
				time={this.state.time}
				setProgress={this.setProgress}
				startTime={this.state.startTime}
			/>
		);
	};

	renderProgress = () => {
		return (
			<Progress
				username={'You'}
				startTime={this.state.startTime}
				opponents={this.state.opponents}
				playerProgress={this.state.playerProgress}
				playerColor={this.props.color}
				goalPosition={this.state.goalPosition}
				wpm={this.state.wpm}
			/>
		);
	};

	render() {
		if (!this.props.user) {
			return <Redirect to="/" />;
		} else {
			return (
				<div>
					<Navbar />
					<div className="playcontent">
						{this.renderRedirect()}
						{this.renderProgress()}
						{this.renderInputHandler()}
					</div>
				</div>
			);
		}
	}
}

export default Play;
