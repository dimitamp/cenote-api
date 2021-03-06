import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { identity } from 'ramda';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

import { attemptLogin } from '../../actions/organization';
import { Box, FormInput } from '../../components';

class LoginPage extends React.Component {
  static propTypes = { attemptLogin: PropTypes.func.isRequired };

  state = {
    remember: false,
    username: '',
    password: '',
  }

  componentWillMount() {
    const username = localStorage.getItem('username');
    if (username) {
      this.setState({ remember: true, username });
    }
  }

  componentDidMount() {
    window.addEventListener('keypress', this.handleKeyPress);
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeyPress);
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.login();
    }
  }

  login = () => {
    const { username, password, remember } = this.state;
    const { attemptLogin: attemptlogin } = this.props;
    const organizationCredentials = { username, password };

    if (remember) { localStorage.setItem('username', username); }

    attemptlogin(organizationCredentials).catch(identity);
  }

  rememberMe = () => {
    localStorage.removeItem('username');
    this.setState(prevState => ({ remember: !prevState.remember }));
  }

  updateUsername = username => this.setState({ username })

  updatePassword = password => this.setState({ password })

  render() {
    const { username, password } = this.state;

    return (
      <Box className="login">
        <img
          className="profile-img logo"
          src={require('../../assets/images/logo_login.png')}
          alt="cenote"
          style={{ width: '15rem', alignSelf: 'center' }}
        />
        <h2 className="title is-2 has-text-centered" style={{ color: '#264184' }}>Welcome to cenote&apos;s Dashboard</h2>
        <FormInput
          onChange={e => this.updateUsername(e.target.value)}
          placeholder="Username"
          value={username}
          leftIcon={faUser}
        />
        <FormInput
          onChange={e => this.updatePassword(e.target.value)}
          placeholder="Password"
          value={password}
          leftIcon={faLock}
          type="password"
        />
        <p className="control is-clearfix has-text-centered" style={{ margin: '.5rem', width: '100%' }}>
          <button
            type="button"
            className="button"
            onClick={this.login}
            style={{
              backgroundColor: '#264184',
              color: 'white',
              fontWeight: 'bold',
              width: '75%',
              fontSize: '1.2rem',
            }}
          >
            Login
          </button>
        </p>
        <p align="center">
          {'Forgot password?  '}
          <Link to="/recovery" style={{ color: '#264184' }}>Click here!</Link>
        </p>
        <hr style={{
          backgroundColor: '#11183a',
          height: '1px',
          margin: '.5rem',
        }}
        />
        <p align="center">Not registered Yet?</p>
        <p className="control is-clearfix has-text-centered" style={{ margin: '.5rem', width: '100%' }}>
          <Link to="/register">
            <button
              type="button"
              className="button"
              style={{
                borderWidth: '1px',
                borderColor: '#264184',
                color: '#264184',
                fontWeight: 'bold',
                width: '75%',
                fontSize: '1.2rem',
              }}
            >
              Sign Up!
            </button>
          </Link>

        </p>
      </Box>
    );
  }
}

const mapDispatchToProps = dispatch => ({ attemptLogin: organization => dispatch(attemptLogin(organization)) });

export default connect(undefined, mapDispatchToProps)(LoginPage);
