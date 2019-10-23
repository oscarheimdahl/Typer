import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function(props) {
	// function logout() {}

	function renderLoginout() {
		return (
			<NavLink to="/login">
				<li>Login</li>
			</NavLink>
		);
	}

	return (
		<header className="header">
			<div className="logo">
				<h2>TYPER</h2>
			</div>
			<nav>
				<ul>
					<NavLink to="/">
						<li>Home</li>
					</NavLink>
					<NavLink to="/play">
						<li>Play</li>
					</NavLink>
					{renderLoginout()}
				</ul>
			</nav>
		</header>
	);
}
