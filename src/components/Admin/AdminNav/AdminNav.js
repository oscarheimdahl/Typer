import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './AdminNav.css';

export class AdminNav extends Component {
	logout = () => {
		const { cookies } = this.props;
		cookies.set('token', '');
		cookies.set('username', '');
		cookies.set('loggedin', false);
	};

	renderLoginout = () => {
		return this.props.cookies.get('loggedin') === 'true' ? (
			<NavLink to="/admin/login">
				<li onClick={this.logout}>
					Logout
					<span className="usernameprofile">
						{' ' + this.props.cookies.get('username')}
					</span>
				</li>
			</NavLink>
		) : (
			<NavLink to="/admin/login">
				<li>Login</li>
			</NavLink>
		);
	};
	render() {
		return (
			<nav className="admin-navbar">
				<h1>Admin page</h1>
				<ul>
					<NavLink to="../admin/users">
						<li>Users</li>
					</NavLink>
					<NavLink to="../admin/">
						<li>Admin</li>
					</NavLink>
					{this.renderLoginout()}
				</ul>
				<hr />
			</nav>
		);
	}
}

export default AdminNav;
