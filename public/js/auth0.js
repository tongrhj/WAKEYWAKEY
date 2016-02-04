'use strict'

/* global Auth0Lock localStorage retrievePictures */

const AUTH0_CLIENT_ID = 'LRPGy0n09P5sE8FbmWlUQhXRUCY2EI2H'
const AUTH0_DOMAIN = 'tongrhj.auth0.com'
// var AUTH0_CALLBACK_URL=location.href

const lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN)

let userProfile = null

document.querySelector('#btn-login').addEventListener('click', () => {
  lock.show({ authParams: { scope: 'openid' } }, (err, profile, token) => {
    if (err) {
      // Error callback
      console.error('Something went wrong: ', err)
    } else {
      // Success calback
      console.log('Hey dude', profile)

      // Save the JWT token
      localStorage.setItem('userToken', token)

      // Retrieve user profile
      const userToken = localStorage.getItem('userToken')
      if (userToken) {
        lock.getProfile(userToken, (err, profile) => {
          if (err) {
            return console.log('There was an error geting user profile: ' + err.message)
          }
          localStorage.setItem('fbAccessToken', profile.identities[0].access_token) // Save the fb Access Token
          userProfile = profile // Save user profile
          // Display user profile name and picture
          document.getElementById('profile-name').textContent = userProfile.given_name
          const profilePic = document.createElement('img')
          profilePic.src = userProfile.picture
          document.getElementById('profile-picture').appendChild(profilePic)
        })
      }

      // Display Step 3
      document.getElementById('captureBox').classList.remove('hidden')
      document.getElementById('captureBox').classList.add('visible')

      // Display Photo gallery
      retrievePictures()
    }
  })
})
