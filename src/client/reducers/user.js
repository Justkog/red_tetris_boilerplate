import { LOGIN_SET } from "../actions/user";
import * as R from 'ramda'

export const getUser = R.path(['user'])

export default (state = {}, action) => {
	switch (action.type) {
		case LOGIN_SET:
			return Object.assign({}, state, { login: action.login })
			default:
			return state
	}
}