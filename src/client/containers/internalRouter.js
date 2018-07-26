import React from 'react'
import { connect } from 'react-redux'
import Board from '../components/board/board'
import Login from '../components/login/login';
import Lobby from '../components/lobby/lobby';
import { withRouter } from 'react-router-dom';
import { setLogin } from '../actions/user';
import { joinRoom, joinRoomAsync } from '../actions/room';
import * as R from 'ramda'

export const hashUrlRegex = RegExp(/^#([^#[\]]*)\[([^#[\]]*)\]$/);

const InternalRouter = ({history, room, login, game}) => {
	console.log('InternalRouter', history.location.hash)
	if (game.started)
		return <Board/>
    else if (login && !R.isEmpty(room)) {
        console.log('Lobby!')
        return <Lobby/>
    } else if (login && !hashUrlRegex.test(history.location.hash)) {
        console.log('rooms!')
        history.push('rooms')
    } else {
        console.log('Login!')
        return <Login/>
    }
    return (null)
}

const mapStateToProps = (state) => {
	return {
        room: state.room,
		login: state.user.login,
		game: state.game,
	}
}

const mapDispatchToProps = dispatch => {
	return {

	}
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InternalRouter))


