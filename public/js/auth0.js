var lock = new Auth0Lock('LRPGy0n09P5sE8FbmWlUQhXRUCY2EI2H', 'tongrhj.auth0.com')

var userProfile

document.querySelector('#btn-login').addEventListener('click', () => {
  lock.show({ authParams: { scope: 'openid' } }, function (err, profile, token) {
    if (err) {
      // Error callback
      console.error("Something went wrong: ", err)
      alert("Something went wrong, check the Console errors")
    } else {
      // Success calback
      console.log("Hey dude", profile)

      // Save the JWT token.
      var hash = lock.parseHash(window.location.hash)
      if (hash) {
        if (hash.error) {
          console.log("There was an error logging in", hash.error)
          alert('There was an error: ' + hash.error + '\n' + hash.error_description)
        } else {
          //save the token in the session:
          localStorage.setItem('userToken', hash.id_token)
        }
      }

      // Save the profile
      userProfile = profile
      document.getElementById('name').textContent = profile.given_name

      //Display Step 2
      document.getElementById('captureBox').classList.remove('hidden')
      document.getElementById('captureBox').classList.add('visible')
    }
  })

})
