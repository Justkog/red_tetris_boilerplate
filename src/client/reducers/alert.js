import { ALERT_POP, ALERT_DEPOP } from '../actions/alert'
import * as R from 'ramda'

const reducer = (state = [] , action) => {
  switch(action.type){
    case ALERT_POP:
      return R.append({ message: action.message }, state)
    case ALERT_DEPOP:
      return R.tail(state)
    default: 
      return state
  }
}

export default reducer

