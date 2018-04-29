import { CognitoUserPool, CognitoUserAttribute, CognitoUser } from 'amazon-cognito-identity-js'

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
  }
}
