import { push } from 'connected-react-router';
import { snakeToCamelCase } from 'json-style-converter/es5';
import Notifications from 'react-notification-system-redux';

import { postRegister, postLogin, postLogout } from '../../api/auth';
import { getUser, putUser, putUserPassword } from '../../api/user';

import { handleError, handleLoginError } from './helpers';

export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';
export const UPDATE_USER = 'UPDATE_USER';

// Syncronous Actions

export function login(user) {
	return {
		type: LOGIN_USER,
		user: snakeToCamelCase(user),
	};
}

export function logout() {
	return { type: LOGOUT_USER };
}

export function updateUser(user) {
	return {
		type: UPDATE_USER,
		user: snakeToCamelCase(user),
	};
}

// Asyncronous Actions

export const attemptLogin = user => dispatch => postLogin(user)
	.then((data) => {
		dispatch(login(data.user));
		dispatch(Notifications.success({
			title: 'Success!',
			message: data.message,
			position: 'tr',
			autoDismiss: 3,
		}));
		dispatch(push('/home'));
		return data;
	})
	.catch(handleLoginError(dispatch));

export const attemptRegister = newUser => dispatch => postRegister(newUser)
	.then((data) => {
		dispatch(Notifications.success({
			title: 'Success!',
			message: data.message,
			position: 'tr',
			autoDismiss: 3,
		}));
		return dispatch(attemptLogin(newUser));
	})
	.then(() => dispatch(push('/settings')))
	.catch(handleError(dispatch));

export const attemptLogout = () => dispatch => postLogout()
	.then((data) => {
		dispatch(logout());
		dispatch(Notifications.success({
			title: 'Success!',
			message: data.message,
			position: 'tr',
			autoDismiss: 3,
		}));
		dispatch(push('/login'));
		return data;
	})
	.catch(handleError(dispatch));

export const attemptGetUser = () => dispatch => getUser()
	.then((data) => {
		dispatch(updateUser(data.user));
		return data.user;
	})
	.catch(handleError(dispatch));

export const attemptUpdateUser = updatedUser => dispatch => putUser(updatedUser)
	.then((data) => {
		dispatch(updateUser(data.user));
		dispatch(Notifications.success({
			title: 'Success!',
			message: data.message,
			position: 'tr',
			autoDismiss: 3,
		}));
		return data;
	})
	.catch(handleError(dispatch));

export const attemptUpdatePassword = passwordInfo => dispatch => putUserPassword(passwordInfo)
	.then((data) => {
		dispatch(Notifications.success({
			title: 'Success!',
			message: data.message,
			position: 'tr',
			autoDismiss: 3,
		}));
		return data;
	})
	.catch(handleError(dispatch));
