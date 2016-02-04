'use strict'

/* global Auth0Lock localStorage */

const lock = new Auth0Lock('LRPGy0n09P5sE8FbmWlUQhXRUCY2EI2H', 'tongrhj.auth0.com')

let userProfile = null

document.querySelector('#btn-login').addEventListener('click', () => {
  lock.show({ authParams: { scope: 'openid' } }, function (err, profile, token) {
    if (err) {
      // Error callback
      console.error('Something went wrong: ', err)
    } else {
      // Success calback
      console.log('Hey dude', profile)

      // Save the JWT token.
      const hash = lock.parseHash(window.location.hash)
      if (hash) {
        if (hash.error) {
          console.log('There was an error: ' + hash.error + '\n' + hash.error_description)
        } else {
          localStorage.setItem('userToken', hash.id_token)
        }
      }

      // Save the fb Access Token
      localStorage.setItem('fbAccessToken', profile.identities[0].access_token)

      // Save the profile
      userProfile = profile
      const profilePic = document.createElement('img')
      profilePic.src = userProfile.picture
      document.getElementById('profile-picture').appendChild(profilePic)
      document.getElementById('profile-name').textContent = userProfile.given_name

      // Display Step 2
      document.getElementById('captureBox').classList.remove('hidden')
      document.getElementById('captureBox').classList.add('visible')
    }
  })
})
