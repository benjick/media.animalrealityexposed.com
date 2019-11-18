export const state = () => ({
  token: null
})

export const mutations = {
  token(state, token) {
    state.token = token
  }
}

export const actions = {
  async init({ commit }) {
    const token = await this.$apolloHelpers.getToken()
    if (token) {
      commit('token', token)
    }
  },
  async logout({ commit }) {
    await this.$apolloHelpers.onLogout()
    commit('token', null)
  },
  async login({ commit }, res) {
    await this.$apolloHelpers.onLogin(res.token, undefined, { expires: 7 })
    const token = await this.$apolloHelpers.getToken()
    commit('token', token)
  }
}
