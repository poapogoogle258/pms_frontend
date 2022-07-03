import { combineReducers } from 'redux'

import sessions from './state_user.js'
import components from './state_components'


export default combineReducers({
  sessions,
  components
})