import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import './SignIn.css';
import Navbar from '../Navbar/Navbar';

export class SignIn extends Component {
	state = {
		username: '',
		email: '',
		password1: '',
		password2: ''
	};

	handleTextinput = e => {
		this.setState({
			[e.target.name]: [e.target.value]
		});
	};

	renderRedirect = () => {
		if (this.state.redirect) {
			return <Redirect to="/login" />;
		}
	};

	handleCancel = e => {
		e.preventDefault();
		this.setState({ redirect: true });
		console.log('cancel');
	};

	isPasswordsEqual = (password1, password2) => {
		console.log(password1);
		console.log(password2);
		if (password1[0] !== password2[0]) {
			this.setState({
				password1error: 'The passwords are not equal',
				password2error: 'The passwords are not equal'
			});
			return false;
		}
		return true;
	};

	validate = () => {
		let { username, email, password1, password2 } = this.state;

		let usernameerror = '';
		let emailerror = '';
		let password1error = '';
		let password2error = '';

		if (username.toString().length < 1) {
			usernameerror = 'This field is required';
		} else if (username.toString().length < 3) {
			usernameerror = 'Username must be atleast 3 characters long';
		}

		if (email.toString().length < 1) {
			emailerror = 'This field is required';
		} else if (!email.toString().includes('@')) {
			emailerror = 'Not a valid email: must contain @';
		}

		if (password1.toString().length < 1) {
			password1error = 'This field is required';
		} else if (password1.toString().length < 8) {
			password1error = 'The password must be 8 characters long';
		} else if (!/\d/.test(password1.toString())) {
			password1error = 'The password must contain a number';
		}

		if (password2.toString().length < 1) {
			password2error = 'This field is required';
		}

		this.setState({
			usernameerror,
			emailerror,
			password1error,
			password2error
		});
		if (usernameerror || emailerror || password1error || password2error) {
			return false;
		}
		return true;
	};

	handleSignin = e => {
		e.preventDefault();
		if (this.validate()) {
			const { password1, password2, username, email } = this.state;
			if (this.isPasswordsEqual(password1, password2)) {
				axios
					.post(localStorage.getItem('API') + 'api/users/sign_in', {
						username: username[0],
						email: email[0],
						password: password1[0]
					})
					.then(res => {
						console.log(res);
						this.setState({ redirect: true });
					})
					.catch(err => {
						console.log(err);
						console.log(err.response);
						this.setState({
							usernameerror: err.response.data.usernameerror,
							errormsg: err.response.data.error
						});
					});
			}
		}
	};

	render() {
		return (
			<>
				<Navbar cookies={this.props.cookies} />
				<div className="loginwallpaper">
					{this.renderRedirect()}
					<div className="signinbox">
						<h1>Sign In</h1>
						<form
							className="signininfo"
							onSubmit={this.handleSignin}
						>
							<div className="inputContainer">
								<label>Username</label>
								<input
									onChange={this.handleTextinput}
									className="username"
									name="username"
									type="text"
								/>
								<label className="errorlabel">
									{this.state.usernameerror}
								</label>
							</div>
							<div className="inputContainer">
								<label>E-mail</label>
								<input
									onChange={this.handleTextinput}
									className="email"
									name="email"
									type="text"
								/>
								<label className="errorlabel">
									{this.state.emailerror}
								</label>
							</div>
							<div className="inputContainer">
								<label>Password</label>
								<input
									onChange={this.handleTextinput}
									className="password"
									name="password1"
									type="password"
								/>
								<label className="errorlabel">
									{this.state.password1error}
								</label>
							</div>
							<div className="inputContainer">
								<label>Password</label>
								<input
									onChange={this.handleTextinput}
									className="password"
									name="password2"
									type="password"
								/>
								<label className="errorlabel">
									{this.state.password2error}
								</label>
							</div>
							<label className="errormsg">
								{this.state.errormsg}
							</label>
							<div className="signinButtonContainer">
								<button
									onClick={this.handleCancel}
									className="button"
									id="cancel"
								>
									Cancel
								</button>
								<button type="submit" className="button">
									Sign in
								</button>
							</div>
						</form>
					</div>
				</div>
			</>
		);
	}
}

export default SignIn;
