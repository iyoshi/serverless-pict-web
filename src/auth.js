import { AuthenticationDetails, CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js'

import config from './config'

export default {

  signup: function (username, email, password) {
    const userPool = new CognitoUserPool({
      UserPoolId: config.COGNITO_USER_POOL_ID,
      ClientId: config.COGNITO_USER_CLIENT_ID
    })

    let attributeEmail = new CognitoUserAttribute({
      Name: 'email',
      Value: email
    })

    let attributeList = []
    attributeList.push(attributeEmail)

    return new Promise((resolve, reject) => {
      userPool.signUp(username, password, attributeList, null, (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          console.log('username is ' + result.user.getUsername())
          resolve(result)
        }
      })
    })
  },

  confirm: function (username, confirmationNumber) {
    // let _this = this

    const userPool = new CognitoUserPool({
      UserPoolId: config.COGNITO_USER_POOL_ID,
      ClientId: config.COGNITO_USER_CLIENT_ID
    })

    let cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool
    })

    return new Promise((resolve, reject) => {
      cognitoUser.confirmRegistration(confirmationNumber, true, (err, result) => {
        if (err) {
          console.log(err)

          reject(err)
        }

        console.log('Call result: ' + result)

        // _this.onChange(true)
        resolve(result)
      })
    })
  },

  authenticate: function (email, password) {
    // let _this = this

    let authenticationDetails = new AuthenticationDetails({
      Username: email,
      Password: password
    })

    const userPool = new CognitoUserPool({
      UserPoolId: config.COGNITO_USER_POOL_ID,
      ClientId: config.COGNITO_USER_CLIENT_ID
    })

    let cognitoUser = new CognitoUser({
      Username: email,
      Pool: userPool
    })

    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
          console.log('access_token: ' + result.getAccessToken().getJwtToken())
          console.log('id_token: ' + result.getIdToken().getJwtToken())
          console.log('Successfully logged in')

          // _this.onChange(true)
          resolve(result)
        },
        onFailure: function (err) {
          console.log(err)

          // _this.onChange(false)
          reject(err)
        },
        newPasswordRequired: function (userAttributes, requiredAttributes) {
          let attributeData = {
            name: email
          }
          cognitoUser.completeNewPasswordChallenge('Password1', attributeData, this)
        }
      })
    })
  },

  loggedIn: function () {
    const userPool = new CognitoUserPool({
      UserPoolId: config.COGNITO_USER_POOL_ID,
      ClientId: config.COGNITO_USER_CLIENT_ID
    })
    let cognitoUser = userPool.getCurrentUser()

    if (cognitoUser != null) {
      cognitoUser.getSession(function (err, session) {
        if (err) {
          console.log(err)

          return false
        }
        console.log('session validity: ' + session.isValid())
        cognitoUser.getUserAttributes(function (err, attributes) {
          if (err) {
            console.log(err)

            return false
          } else {
            for (const attribute in attributes) {
              if (attribute.getName() === 'email') {
                console.log('Login user is ' + attribute.getValue())
              }
            }
          }
        })
      })
      return true
    } else {
      return false
    }
  },

  logout: function () {
    let userPool = new CognitoUserPool({
      UserPoolId: config.COGNITO_USER_POOL_ID,
      ClientId: config.COGNITO_USER_CLIENT_ID
    })

    userPool.getCurrentUser().signOut()
    // this.onChange(false)
    console.log('Successfully logged out')
  },

  getIdToken: function () {
    let userPool = new CognitoUserPool({
      UserPoolId: config.COGNITO_USER_POOL_ID,
      ClientId: config.COGNITO_USER_CLIENT_ID
    })

    let idToken = ''
    let currentUser = userPool.getCurrentUser()
    currentUser.getSession(function (err, result) {
      if (err) {
        console.log(err)
        return idToken
      }
      idToken = result.getIdToken().getJwtToken()
    })

    return idToken
  }
}
