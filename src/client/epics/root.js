import { combineEpics, ofType } from 'redux-observable'
import { LINES_DELETE, sendBoardUpdate } from '../actions/board'
import { INDESTRUCTIBLE_LINES_ADD, PLAYER_END, GAME_ERROR } from '../../server/tools/constants'
import { TETRIMINO_REMOVE, TETRIMINO_SEAL } from '../actions/tetrimino'
import { map, filter, first, delay } from 'rxjs/operators'
import { GAME_OVER, permanentylPause, winGame, sendPlayerEnd, getGame, GAME_STOP, resetGame, stopGame, WAIT_GAME_END } from '../actions/game';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import * as R from 'ramda'
import { ROOM_JOIN, readyPlayerAsync, joinRoomAsync, leaveRoom } from '../actions/room';
import { SOCKET_DISCONNECTED, SOCKET_CONNECTED } from '../actions/socket';
import { history } from '../containers/app';
import { popAlert, depopAlert } from '../actions/alert';
import { pipe } from 'rxjs';

const sendBoardEpic = (action$, state$) => action$.pipe(
    ofType(
        LINES_DELETE,
        INDESTRUCTIBLE_LINES_ADD,
        TETRIMINO_SEAL,
    ),
    // filter(() => state$.value.counter % 2 === 1),
    map(() => sendBoardUpdate())
)

const onGameOver = (action$, state$) => action$.pipe(
    ofType(
        GAME_OVER
    ),
    map(() => {
        return (dispatch, getState) => {
            dispatch(permanentylPause())
            if (!R.isEmpty(getState().room)) {
                dispatch(sendBoardUpdate())
                dispatch(sendPlayerEnd())
            }
        }
    })
)

const onGameStop = (action$, state$) => action$.pipe(
    ofType(
        GAME_STOP
    ),
    map(() => {
        return (dispatch, getState) => {
            dispatch(resetGame())
            if (!R.isEmpty(getState().room))
                dispatch(readyPlayerAsync())
        }
    })
)

const onPlayerEnd = (action$, state$) => action$.pipe(
    ofType(
        PLAYER_END
    ),
    map((action) => {
        return (dispatch, getState) => {
            if (getState().game.started && action.game_finished && !R.has('victorious', getGame(getState()))) {
                dispatch(permanentylPause())
                dispatch(winGame())
            } else if (!getState().game.started && !R.isEmpty(getState().room)) {
                dispatch(readyPlayerAsync())
            }
        }
    })
)

const onRoomJoin = (action$, state$) => action$.pipe(
    ofType(
        ROOM_JOIN
    ),
    map((action) => {
        return (dispatch, getState) => {
            dispatch(readyPlayerAsync())
        }
    })
)

const onDisconnected = (action$, state$) => action$.pipe(
    ofType(
        SOCKET_DISCONNECTED
    ),
    map((action) => {
        return (dispatch, getState) => {
            if (getState().game.started) {
                dispatch(permanentylPause())
                dispatch(stopGame())
                const reconnectionEvent = action$.pipe(
                    ofType(SOCKET_CONNECTED),
                    first()
                )
                reconnectionEvent.subscribe(() => {
                    if (!R.isEmpty(getState().room) && !getState().room.solo)
                        dispatch(joinRoomAsync(getState().room.name))
                    if (getState().room.solo)
                        dispatch(leaveRoom())
                })
            }
        }
    })
)

const onGameError = (action$, state$) => action$.pipe(
    ofType(
        GAME_ERROR
    ),
    map((action) => {
        return (dispatch, getState) => {
            console.log('action:', action)
            dispatch(popAlert(action))
            of(null).pipe(delay(5000)).subscribe(() => dispatch(depopAlert()))
            if (R.propEq('message', 'game already started')(action))
                history.push('/rooms')
        }
    })
)

const onWaitGameEnd = (action$, state$) => action$.pipe(
    ofType(
        WAIT_GAME_END
    ),
    map((action) => {
        return (dispatch, getState) => {
            state$.pipe(
                map(state => state.game.finished),
                filter(v => v),
                first()
            ).subscribe(() => {
                console.log('stopGame from waitGameEndAsync store observer')
                dispatch(stopGame())
                console.log('stopGame end from waitGameEndAsync store observer')
            })
        }
    })
)

export const rootEpic = combineEpics(
    sendBoardEpic,
    onGameOver,
    onPlayerEnd,
    onGameStop,
    onRoomJoin,
    onDisconnected,
    onGameError,
    onWaitGameEnd
)