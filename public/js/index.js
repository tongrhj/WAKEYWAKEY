'use strict'
/* global Audio fetch Request localStorage FB userProfile */

const width = 320    // We will scale the photo width to this
let height = 0       // This will be computed based on the input stream

let streaming = false

let video = null
let canvas = null
let photo = null
let startbutton = null

let alarm
let captureCountdown
let cancelbutton

const imgurClientID = '4b24a6a46e6bea7'

function startup () {
  video = document.getElementById('capture-video')
  canvas = document.getElementById('capture-canvas')
  photo = document.getElementById('capture-photo')
  startbutton = document.getElementById('capture-startbtn')
  cancelbutton = document.getElementById('capture-cancelbtn')

  navigator.getMedia = (navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia)

  navigator.getMedia(
    {video: true, audio: false},
    (stream) => {
      if (navigator.mozGetUserMedia) {
        video.mozSrcObject = stream
      } else {
        var vendorURL = window.URL || window.webkitURL
        video.src = vendorURL.createObjectURL(stream)
      }
      video.play()
    },
    (err) => console.log('An error occured! ' + err)
  )

  video.addEventListener('canplay', () => {
    if (!streaming) {
      height = video.videoHeight / (video.videoWidth / width)

      if (isNaN(height)) height = width / (4 / 3)

      video.setAttribute('width', width)
      video.setAttribute('height', height)
      canvas.setAttribute('width', width)
      canvas.setAttribute('height', height)
      streaming = true
    }
  }, false)

  startbutton.addEventListener('click', (e) => {
    startCountdown(8000)
    cancelbutton.classList.remove('hidden')
    cancelbutton.classList.add('visible')
    cancelbutton.addEventListener('click', (e) => {
      e.preventDefault()
      cancelCountdown()
    })
    e.preventDefault()
  }, false)

  clearphoto()
}

function clearphoto () {
  var context = canvas.getContext('2d')
  context.fillStyle = '#FFF'
  context.fillRect(0, 0, canvas.width, canvas.height)

  var data = canvas.toDataURL('image/png')
  photo.setAttribute('src', data)
}

function startCountdown (time) {
  alarm = new Audio('sound/alarm.mp3')
  alarm.play()
  captureCountdown = setTimeout(takepicture, time)
}

function cancelCountdown () {
  window.clearTimeout(captureCountdown)
  alarm.pause()
  alarm.currentTime = 0
  cancelbutton.classList.remove('visible')
  cancelbutton.classList.add('hidden')
}

function takepicture () {
  const context = canvas.getContext('2d')
  if (width && height) {
    canvas.width = width
    canvas.height = height
    context.drawImage(video, 0, 0, width, height)
    var dataURL = canvas.toDataURL('image/png')
    photo.setAttribute('src', dataURL)

    const base64image = dataURL.toString().substring(22, dataURL.toString().length)

    const mongoRequest = new Request('/gallery', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('userToken'),
        'Content-Type': 'application/json; charset=UTF-8'
      },
      method: 'POST',
      body: JSON.stringify({
        name: userProfile.given_name,
        url: dataURL
      }),
      cache: false
    })

    const imgurRequest = new Request('https://api.imgur.com/3/image', {
      headers: {
        'Authorization': 'Client-ID 4b24a6a46e6bea7',
        'Content-Type': 'application/json'
      },
      method: 'post',
      body: JSON.stringify({
        image: base64image,
        type: 'base64',
        description: 'Generated from WAKEYWAKEY Alarm Clock Webapp'
      }),
      cache: true
    })

    function checkStatus (response) {
      if (response.status >= 200 && response.status < 300) {
        return response
      } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
      }
    }

    function parseJSON (response) {
      return response.json()
    }

    // Try Posting to IMGUR
    // process.env.WAKEY_IMGUR_CLIENT_ID
    // process.env.WAKEY_IMGUR_CLIENT_SECRET
    fetch(imgurRequest)
    .then(checkStatus)
    .then(parseJSON)
    .then((res) => {
      var imageURL = res.data.link

      FB.ui({
        method: 'feed',
        name: 'I Did Not Wake Up On Time',
        link: 'https://wakey2.herokuapp.com/',
        caption: 'WakeyWakey Alarm Clock Webapp',
        picture: imageURL,
        description: 'I failed to wake up this morning and this is my punishment. Shame! Shame! Shame!'
      }, (res) => { console.log(res) })

    }).catch((error) => {
      console.log('Upload to IMGUR Failed: ' + error.message)
    })

    // Try Posting to Facebook
    // FB.ui({
    //   method: 'feed',
    //   name: 'I Did Not Wake Up On Time',
    //   link: 'https://wakey2.herokuapp.com/',
    //   caption: 'WakeyWakey Alarm Clock Webapp',
    //   picture: 'https://wakey2.herokuapp.com/img/wakeywakey.png',
    //   description: 'I failed to wake up this morning and this is my punishment. Shame! Shame! Shame!'
    // }, (res) => { console.log(res) })

    fetch(mongoRequest)
    .then(() => {
      retrievePictures()
    })
    .catch((error) => {
      console.log('There has been a problem with your fetch operation: ' + error.message)
    })
  } else {
    clearphoto()
  }
}

function retrievePictures () {
  // Fetch the pictures so user is shamed since they didnt wake in time
  fetch('/gallery', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('userToken')
    },
    method: 'GET',
    cache: true
  })
    .then((res) => res.json())
    .then((res) => {
      res.forEach((doc) => {
        const photoPost = document.createElement('img')
        photoPost.src = doc.url
        document.querySelector('#scoreboard').appendChild(photoPost)
      })
    })
}

window.addEventListener('load', startup)
