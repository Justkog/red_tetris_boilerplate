import * as R from 'ramda';

export const ROOMS_LIST_SHOW = 'ROOMS_LIST_SHOW';
export const ROOM_CREATE = 'ROOM_CREATE';
export const ROOM_SHOW = 'ROOM_SHOW';
export const ROOM_UPDATE = 'ROOM_UPDATE';

export const GAME_CREATION = 'GAME_CREATION';
export const GAME_CREATION_SOLO = 'GAME_CREATION_SOLO';
export const REQUEST_GAME_START = 'REQUEST_GAME_START';
export const GAME_START = 'GAME_START';
export const GAME_JOIN = 'GAME_JOIN';

export const NEXT_TETRI_REQUEST = 'NEXT_TETRI_REQUEST';
export const NEXT_TETRI = 'NEXT_TETRI';

export const LINE_DELETE = 'LINE_DELETE';
export const USER_LINE_DELETE = 'USER_LINE_DELETE';
export const INDESTRUCTIBLE_LINE_ADD = 'INDESTRUCTIBLE_LINE_ADD';

export const BOARD_UPDATE = 'BOARD_UPDATE';
export const SPECTRUM_UPDATE = 'SPECTRUM_UPDATE';

export const UPDATE_SCORE = 'UPDATE_SCORE';

export const PLAYER_END = 'PLAYER_END';

export const GAME_ERROR = 'GAME_ERROR';
export const PLAYER_ERROR = 'PLAYER_ERROR';

export const emptyRowN = (columns) => R.map((n) => 0, R.unfold((n) => n > columns - 1 ? false : [n, n + 1], 0))
export const emptyBoardN = (rows, columns) => R.map((n) => emptyRowN(columns), R.unfold((n) => n > rows - 1 ? false : [n, n + 1], 0))