import update from 'immutability-helper';
import { LOGIN_USER, LOGOUT_USER, UPDATE_USER } from '../constants/actionTypes';

export default function user(state = {}, action) {
	switch (action.type) {
	case (LOGIN_USER):
		return update(state, { $merge: action.user });
	case (LOGOUT_USER):
		return ({});
	case (UPDATE_USER):
		return update(state, { $merge: action.user });
	default:
		return state;
	}
}
