import { combineEpics, ofType } from 'redux-observable'
import { LINES_DELETE, sendBoardUpdate } from '../actions/board'
import { INDESTRUCTIBLE_LINES_ADD, PLAYER_END } from '../../server/tools/constants'
import { TETRIMINO_REMOVE, TETRIMINO_SEAL } from '../actions/tetrimino'
import { map } from 'rxjs/operators'
import { GAME_OVER, permanentylPause, winGame, sendPlayerEnd, getGame } from '../actions/game';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import * as R from 'ramda'

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
            dispatch(sendBoardUpdate())
            dispatch(sendPlayerEnd())
        }
    })
)

const onPlayerEnd = (action$, state$) => action$.pipe(
    ofType(
        PLAYER_END
    ),
    map((action) => {
        return (dispatch, getState) => {
            if (action.game_finished && !R.has('victorious', getGame(getState()))) {
                dispatch(permanentylPause())
                dispatch(winGame())
            }
        }
    })
)

export const rootEpic = combineEpics(
    sendBoardEpic,
    onGameOver,
    onPlayerEnd,
)