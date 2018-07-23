export const BOARD_UPDATE = 'BOARD_UPDATE'

export const updateBoard = (prevActiveTetrimino, currentActiveTetrimino) => {
	return {
		type: BOARD_UPDATE,
		prevActiveTetrimino,
		currentActiveTetrimino
	}
}

