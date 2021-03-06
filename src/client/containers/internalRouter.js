import React from 'react'
import { connect } from 'react-redux'
import { GameScreen } from '../components/game_screen/game_screen'
import Lobby from '../components/lobby/lobby';
import { withRouter, Redirect } from 'react-router-dom';
import * as R from 'ramda'
import { Home } from '../components/home/home';

export const hashUrlRegex = RegExp(/^#([^#[\]]*)\[([^#[\]]*)\]$/);

export const InternalRouterComponent = ({history, room, login, game}) => {
	console.log('InternalRouter', history.location.hash)
	if (game.started || room.solo)
		return <GameScreen/>
    else if (!R.isEmpty(room) && login) {
        console.log('Lobby!')
        return <Lobby/>
    } else if (login && !hashUrlRegex.test(history.location.hash)) {
        console.log('rooms!')
        return <Redirect to="/rooms"/>
    } else {
        console.log('Home!')
        return <Home/>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InternalRouterComponent))
