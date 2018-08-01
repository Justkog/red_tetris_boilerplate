import { ALERT_POP, ALERT_DEPOP } from '../actions/alert'
import * as R from 'ramda'

const reducer = (state = {} , action) => {
  switch(action.type){
    case ALERT_POP:
      return { message: action.message }
    case ALERT_DEPOP:
      return R.dissoc('message', state)
    default: 
      return state
  }
}

export default reducer

