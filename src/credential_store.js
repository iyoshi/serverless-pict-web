export default {

  debug: true,
  state: {
    email: '',
    username: ''
  },

  setEmailAction: function (email) {
    if (this.debug) {
      console.log('setEmailAction triggered with', email)
    }

    this.state.email = email
  },

  clearEmailAction: function () {
    if (this.debug) {
      console.log('clearEmailAction triggered')
    }

    this.state.email = ''
  },

  setUsernameAction: function (username) {
    if (this.debug) {
      console.log('setUsernameAction triggered with', username)
    }

    this.state.username = username
  },

  clearUsernameAction: function () {
    if (this.debug) {
      console.log('clearUsernameAction triggered')
    }

    this.state.username = ''
  }
}
