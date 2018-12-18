import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { identity, pick } from 'ramda';

import { attemptLogout } from '../actions/organization';

class OrganizationDropdown extends Component {
	static propTypes = {
		organization: PropTypes.object.isRequired,
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
		const { closeDropdown, attemptLogout: attemptlogout } = this.props;
		closeDropdown();
		attemptlogout().catch(identity);
	}


	render() {
		const { organization, closeDropdown, open } = this.props;

		return open && (
			<div className="dropdown box sm" ref={(el) => { this.dropdown = el; }}>
				<ul className="dropdown-list">
					<li className="dropdown-header">
						{organization.usernameCase}
					</li>
					<hr className="dropdown-separator" />
					<li className="dropdown-item has-text-centered">
						<Link to="/home" onClick={closeDropdown}>Home</Link>
					</li>
					<li className="dropdown-item has-text-centered">
						<Link to="/projects" onClick={closeDropdown}>Project List</Link>
					</li>
					<li className="dropdown-item has-text-centered">
						<Link to="/settings" onClick={closeDropdown}>Settings</Link>
					</li>
					<hr className="dropdown-separator" />
					<li className="dropdown-item">
						<button className="button is-danger" onClick={this.logout} type="button" onKeyPress={this.logout}>Logout</button>
					</li>
				</ul>
			</div>
		);
	}
}

const mapStateToProps = pick(['organization']);
const mapDispatchToProps = dispatch => ({ attemptLogout: () => dispatch(attemptLogout()) });
export default connect(mapStateToProps, mapDispatchToProps)(OrganizationDropdown);