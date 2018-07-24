export const BOARD_UPDATE = 'BOARD_UPDATE'
export const LINE_DELETE = 'LINE_DELETE'

export const updateBoard = (prevActiveTetrimino, currentActiveTetrimino) => {
	return {
		type: BOARD_UPDATE,
		prevActiveTetrimino,
		currentActiveTetrimino
	}
}

export const deleteLine = (lines) => {
	return {
		type: LINE_DELETE,
		lines: lines,
	}
}
