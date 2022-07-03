
export default function sessions(state = {
  isAuthentication : false,
  currentUser : ''}, action){

  switch(action.type){
    case 'login':
      state.isAuthentication = true
      state.currentUser = action.username || ''
      state.realname = action.realname || ''

      return state
 
    case 'logout':
      state.isAuthentication = false
      state.currentUser = ''
      state.realname = ''
      return state

    default:
        return state
  }
}