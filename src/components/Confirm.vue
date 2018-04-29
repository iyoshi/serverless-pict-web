<template>
    <div id="confirm" >

      <h2>Confirm</h2>

      <p>We sent confirm code to {{ email }}. Enter it below to activate our account.</p>
      <form v-on:submit.prevent="confirm" class="pure-form pure-form-stacked" >
        <label>
          <input v-model="confirmation_code" placeholder="Confirmation code" />
        </label>
        <button type="submit" class="pure-button pure-button-primary" >Register</button>
        <p v-if="error" class="error" >Failed to signup</p>
      </form>

    </div>
</template>

<script>
import auth from '../auth'
import store from '../credential_store'

export default {

  data: function () {
    return {
      username: '',
      email: '',
      error: false,
      confirmation_code: '',
      state: store.state
    }
  },

  created: function () {
    console.log(this.state.email)
    this.email = this.state.email
    this.username = this.state.username
  },

  methods: {

    confirm: function () {
      let _this = this
      auth.confirm(this.username, this.confirmation_code)
        .then((res) => {
          console.log(res)

          _this.$router.replace('/home')
        })
        .catch((err) => {
          console.log(err)

          _this.error = true
        })
    },

    changeEmail: function (email) {
      this.$data.email = email
    }
  }
}
</script>

<style>
  #confirm {
    padding: .5em 1em;
  }

</style>
