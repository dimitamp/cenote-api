import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import identity from 'ramda/src/identity';

export default class UserDropdown extends Component {
	static propTypes = {
		user: PropTypes.object.isRequired,
		open: PropTypes.bool.isRequired,
		closeDropdown: PropTypes.func.isRequired,
		attemptLogout: PropTypes.func.isRequired,
	};

	constructor(props) {
		super(props);
		this.props = props;
	}

	componentDidMount() {
		window.addEventListener('click', this.dropdownListener);
		window.addEventListener('touchend', this.dropdownListener);
	}

	componentWillUnmount() {
		window.removeEventListener('click', this.dropdownListener);
		window.removeEventListener('touchend', this.dropdownListener);
	}

	dropdownListener = (e) => {
		const { closeDropdown } = this.props;
		return !e.path.includes(this.dropdown) && closeDropdown();
	}

	logout = () => {
		const { closeDropdown, attemptLogout } = this.props;
		closeDropdown();
		attemptLogout().catch(identity);
	}


	render() {
		const { user, closeDropdown, open } = this.props;

		return open && (
			<div className="dropdown box" ref={(el) => { this.dropdown = el; }}>
				<ul className="dropdown-list">
					<li className="dropdown-header">
						{user.usernameCase}
					</li>
					<hr className="dropdown-separator" />
					<li className="dropdown-item">
						<Link to="/todo" onClick={closeDropdown}>Todo List</Link>
					</li>
					<li className="dropdown-item">
						<Link to="/settings" onClick={closeDropdown}>Settings</Link>
					</li>
					<hr className="dropdown-separator" />
					<li className="dropdown-item">
						<button onClick={this.logout} type="button" onKeyPress={this.logout}>Logout</button>
					</li>
				</ul>
			</div>
		);
	}
}
