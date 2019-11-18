export const getters = {
  isAuthenticated(state) {
    return state.auth.token
  },

  loggedInUser(state) {
    return state.auth.user
  }
}
