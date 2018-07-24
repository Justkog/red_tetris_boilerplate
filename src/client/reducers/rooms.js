import { ROOMS_LIST_SHOW } from "../../server/tools/constants"


export default (state = {}, action) => {
	switch (action.type) {
		case ROOMS_LIST_SHOW:
			return action.rooms
		default:
			return state
	}
}