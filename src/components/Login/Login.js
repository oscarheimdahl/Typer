import React, { Component } from 'react';
import './Login.css';
import Navbar from '../Navbar/Navbar';
import { Redirect } from 'react-router-dom';

export class Login extends Component {
	state = {};

	handleUsername = e => {
		this.setState({ username: e.target.value });
	};

	handlePassword = e => {
		this.setState({ password: e.target.value });
	};

	handleLogin = e => {
		this.setState({
			errormsg: ''
		});
		let emptyfields = false;
		if (!this.state.username) {
			this.setState({ usernameerror: ' *' });
			emptyfields = true;
		}
		if (!this.state.password) {
			this.setState({ passworderror: ' *' });
			emptyfields = true;
		}
		if (!emptyfields) {
			this.props.signIn(this.state.username, this.state.password);

			// console.log(localStorage.getItem('API') + 'api/users/login');
			// axios
			// 	.post(localStorage.getItem('API') + 'api/users/login', {
			// 		//http://130.239.236.226:4000/api/users/login/', {
			// 		username: this.state.username,
			// 		password: this.state.password
			// 	})
			// 	.then(res => {
			// 		// this.props.setLoginAttributes(res.data.token, this.state.username);
			// 		const { cookies } = this.props;
			// 		cookies.set('token', res.data.token, { path: '/' });
			// 		cookies.set('username', this.state.username, { path: '/' });
			// 		cookies.set('guest', false);
			// 		cookies.set('loggedin', true);
			// 		this.setState({ redirectPlay: true });
			// 	})
			// 	.catch(err => {
			// 		if (!err.response) {
			// 			this.setState({
			// 				errormsg: 'Oh oh. Something bad happened.'
			// 			});
			// 			console.log(err);
			// 		} else if (err.response.status === 401) {
			// 			this.setState({
			// 				errormsg: 'Wrong username or password.'
			// 			});
			// 		} else {
			// 			this.setState({
			// 				errormsg:
			// 					'Wrong ip? - Response timed out, probably, maybe, kanske, vi tror det i alla fall'
			// 			});
			// 		}
			// 	});
		}
	};

	renderRedirectPlay = () => {
		if (this.state.redirectPlay) {
			return <Redirect to="/play" />;
		}
	};

	handleSignIn = () => {
		this.setState({
			redirectSign: true
		});
	};

	renderRedirectSignIn = () => {
		if (this.state.redirectSign) {
			return <Redirect to="/signin" />;
		}
	};

	render() {
		return (
			<>
				<Navbar cookies={this.props.cookies} />
				{this.renderRedirectPlay()}
				{this.renderRedirectSignIn()}
				<div className="loginwallpaper">
					<div className="loginbox">
						<h1>Typer</h1>
						<div className="logininfo">
							<label>Username</label>
							<label className="errorlabel">{this.state.usernameerror}</label>
							<input
								onChange={this.handleUsername}
								className="username"
								type="text"
							/>
							<label>Password</label>
							<label className="errorlabel">{this.state.passworderror}</label>
							<input
								onChange={this.handlePassword}
								className="password"
								type="password"
							/>
							<label className="errormsg">{this.state.errormsg}</label>
						</div>
						<button onClick={this.handleLogin} className="button">
							Login
						</button>
						<p onClick={this.handleSignIn}>Sign in</p>
					</div>
				</div>
			</>
		);
	}
}

export default Login;
