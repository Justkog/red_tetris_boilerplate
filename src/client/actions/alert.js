import * as R from 'ramda'
import { PLAYER_ERROR } from "../../server/tools/constants";
import { of, pipe } from "rxjs";
import { delay } from "rxjs/operators";
import { history } from "../containers/app";

export const ALERT_POP = 'ALERT_POP'
export const ALERT_DEPOP = 'ALERT_DEPOP'

export const popAlert = ({message}) => {
  return {
    type: ALERT_POP,
    message
  }
}

export const depopAlert = () => {
  return {
    type: ALERT_DEPOP,
  }
}

export const registerPlayerError = (socket, dispatch, getState) => {
	console.log('registerPlayerError')
	socket.off(PLAYER_ERROR)
	socket.on(PLAYER_ERROR, (data) => {
		console.log('Listening PLAYER_ERROR: ', data);
    dispatch(popAlert(data))
    of(null).pipe(delay(5000)).subscribe(() => dispatch(depopAlert()))
    console.dir(data)
    if (R.propEq('message', 'name already taken')(data))
      history.push('/login')
	})
}