import { combineEpics, ofType } from 'redux-observable';
import { LINES_DELETE, sendBoardUpdate } from '../actions/board';
import { INDESTRUCTIBLE_LINES_ADD } from '../../server/tools/constants';
import { TETRIMINO_REMOVE, TETRIMINO_SEAL } from '../actions/tetrimino';
import { map } from '../../../node_modules/rxjs/operators';

const sendBoardEpic = (action$, state$) => action$.pipe(
    ofType(
        LINES_DELETE,
        INDESTRUCTIBLE_LINES_ADD,
        TETRIMINO_SEAL,
    ),
    // filter(() => state$.value.counter % 2 === 1),
    map(() => sendBoardUpdate())
);

export const rootEpic = combineEpics(
    sendBoardEpic,
);