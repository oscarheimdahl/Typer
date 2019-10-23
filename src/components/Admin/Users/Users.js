import React, { Component } from 'react';
import './Users.css';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import Navbar from '../AdminNav/AdminNav';

export class Users extends Component {
	state = {
		redirect: false,
		users: []
	};

	componentDidMount() {
		const { cookies } = this.props;
		if (cookies.get('loggedin') === 'false') {
			this.setState({ redirect: true });
		}

		this.authenticateUser(this.getUsers);
	}

	authenticateUser = thenAction => {
		const { cookies } = this.props;
		axios
			.post(
				localStorage.getItem('API') + 'api/users/admin/authenticate',
				{
					token: cookies.get('token', { path: '/' })
				}
			)
			.then(thenAction())
			.catch(err => {
				console.log(err);
				cookies.set('loggedin', false);
				this.setState({ redirect: true });
			});
	};

	getUsers = () => {
		axios.get(localStorage.getItem('API') + 'api/users/get').then(res => {
			this.setState({
				users: res.data
			});
		});
	};

	renderRedirect = () => {
		if (this.state.redirect) return <Redirect to="/admin/login" />;
	};

	renderUsers = () => {
		return this.state.users ? (
			this.state.users.map(u => {
				return (
					<div key={u._id} className="user">
						{u.username}
						<button>Edit</button>
						<button>Delete</button>
					</div>
				);
			})
		) : (
			<p>Getting users...</p>
		);
	};

	render() {
		return (
			<div className="admin-users">
				{this.renderRedirect()}
				<Navbar cookies={this.props.cookies} />
				<div className="admin-users-container">
					<h1>Users</h1>
					<div className="users">{this.renderUsers()}</div>
				</div>
			</div>
		);
	}
}

export default Users;
