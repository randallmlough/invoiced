import actions from '../actions'

export const entitiesReducer = (state = {}, action) => {
  Object.freeze(state)
  switch (action.type) {
    case actions.RECEIVE_USER:
      return Object.assign({}, state, { [action.user.id]: action.user })
    default:
      return state
  }
}
