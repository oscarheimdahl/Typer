import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Navbar from '../AdminNav/AdminNav';

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
			axios
				.post(localStorage.getItem('API') + 'api/users/admin/login', {
					username: this.state.username,
					password: this.state.password
				})
				.then(res => {
					const { cookies } = this.props;
					cookies.set('token', res.data.token);
					cookies.set('username', this.state.username);
					cookies.set('guest', false);
					cookies.set('loggedin', true);
					this.setState({ redirect: true });
				})
				.catch(err => {
					if (!err.response) {
						this.setState({
							errormsg: 'Oh oh. Something bad happened.'
						});
						console.log(err);
					} else if (err.response.status === 401) {
						console.log(err.response.data.message);
						this.setState({
							errormsg: err.response.data.message
						});
					} else {
						this.setState({
							errormsg:
								'Wrong ip? - Response timed out, probably, maybe, kanske, vi tror det i alla fall'
						});
					}
				});
		}
	};

	renderRedirect = () => {
		if (this.state.redirect) {
			return <Redirect to="/admin/users" />;
		}
	};

	render() {
		return (
			<>
				{this.renderRedirect()}
				<Navbar cookies={this.props.cookies} />
				<div className="loginwallpaper">
					<div className="loginbox">
						<h1>Typer</h1>
						<div className="logininfo">
							<label>Username</label>
							<label className="errorlabel">
								{this.state.usernameerror}
							</label>
							<input
								onChange={this.handleUsername}
								className="username"
								type="text"
							/>
							<label>Password</label>
							<label className="errorlabel">
								{this.state.passworderror}
							</label>
							<input
								onChange={this.handlePassword}
								className="password"
								type="password"
							/>
							<label className="errormsg">
								{this.state.errormsg}
							</label>
						</div>
						<button onClick={this.handleLogin} className="button">
							Login
						</button>
					</div>
				</div>
			</>
		);
	}
}

export default Login;
