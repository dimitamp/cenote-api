import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import { hot } from 'react-hot-loader';
import Notifications from 'react-notification-system-redux';
import { pick } from 'ramda';

import { WelcomePage, RegisterPage, LoginPage, HomePage, NotFoundPage, ProjectPage, RecoveryPage, SettingsPage, ProjectInfoPage } from './pages';
import Navigation from './Navigation';
import Footer from './Footer';

// eslint-disable-next-line
class App extends React.Component {

	static propTypes = {
		location: PropTypes.shape({ pathname: PropTypes.string }).isRequired,
		alerts: PropTypes.array.isRequired,
	}

	render() {
		const { location, alerts } = this.props;
		return (
			<div className="has-navbar-fixed-top">
				<Notifications notifications={alerts} />
				<Navigation pathname={location.pathname} />
				<div className="main">
					<Switch>
						<Route exact path="/" component={WelcomePage} />
						<Route path="/login" component={LoginPage} />
						<Route path="/register" component={RegisterPage} />
						<Route path="/home" component={HomePage} />
						<Route path="/projects" exact component={ProjectPage} />
						<Route path="/projects/:id" component={ProjectInfoPage} />
						<Route path="/settings" component={SettingsPage} />
						<Route path="/recovery" component={RecoveryPage} />
						<Route path="*" component={NotFoundPage} />
					</Switch>
				</div>
				<Footer />
			</div>
		);
	}
}
const mapStateToProps = pick(['alerts']);

export default hot(module)(withRouter(connect(mapStateToProps)(App)));