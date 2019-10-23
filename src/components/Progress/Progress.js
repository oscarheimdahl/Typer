import React, { Component } from 'react';
import './Progress.css';
let playerColor = 'red';
export class Progress extends Component {
	state = {
		goalPosition: ''
	};

	componentWillUnmount() {
		playerColor = '';
	}

	renderOpponentsProgress = () => {
		if (this.props.opponents) {
			return this.props.opponents.map(o => {
				if (o.username !== this.props.username) {
					return (
						<div key={o.username}>
							<div className="progressUsername">{o.username}</div>
							<div
								className="playerProgress"
								style={{
									width: o.progress * 99 + '%',
									background: o.color
								}}
							/>
						</div>
					);
				} else {
					if (playerColor === '') {
						// playerColor = o.color;
					}
					return <></>;
				}
			});
		}
	};

	renderWaitingForOpponents = () => {
		if (!this.props.startTime) {
			return <div className="opponentspending">Searching for players</div>;
		}
	};

	renderOpponentsWPM = () => {
		if (this.props.opponents) {
			console.log(this.props.opponents);
			return this.props.opponents.map(o => {
				// console.log(o.username);
				if (o.username !== this.props.username) {
					return (
						<div key={o.username} className="wpm">
							{o.wpm === null ? 0 : Math.round(o.wpm)} WPM
						</div>
					);
				} else {
					return <div key={o.username} />;
				}
			});
		}
	};

	renderOpponentsGoalPosition = () => {
		if (this.props.opponents) {
			return this.props.opponents.map(o => {
				if (o.username !== this.props.username) {
					return (
						<div key={o.username} className="goalpos">
							{o.goalPosition ? o.goalPosition : <br />}
						</div>
					);
				} else {
					return <div key={o.username} />;
				}
			});
		}
	};

	render() {
		return (
			<div className="progresscontainer">
				<div className="wpmcontainer">
					<div className="wpm">{Math.round(this.props.wpm)} WPM</div>
					{this.renderOpponentsWPM()}
				</div>
				<div className="racetrack">
					<div className="progressUsername">{this.props.username}</div>
					<div
						className="playerProgress"
						style={{
							width: this.props.playerProgress * 99 + '%',
							// background: playerColor
							background: this.props.playerColor
							// background:
							// 'linear-gradient(to left, ' + this.props.playerColor + ', red)'
						}}
					/>
					{this.renderWaitingForOpponents()}
					{this.renderOpponentsProgress()}
				</div>
				<div className="goalposcontainer">
					<div className="goalpos">
						{this.props.goalPosition ? this.props.goalPosition : <br />}
					</div>
					{this.renderOpponentsGoalPosition()}
				</div>
			</div>
		);
	}
}

export default Progress;
