import { Tetri } from "../components/tetrimino/tetrimino";

export const TETRIMINO_ADD = 'TETRIMINO_ADD'
export const TETRIMINO_REMOVE = 'TETRIMINO_REMOVE'

export const addTetrimino = () => {
  return {
	type: TETRIMINO_ADD,
	formType: Tetri.Types.L,
  }
}

export const removeTetrimino = () => {
	return {
	  type: TETRIMINO_REMOVE,
	}
  }