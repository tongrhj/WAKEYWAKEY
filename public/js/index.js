'use strict'
/* global Audio fetch Request localStorage */

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
  var context = canvas.getContext('2d')
  if (width && height) {
    canvas.width = width
    canvas.height = height
    context.drawImage(video, 0, 0, width, height)
    var data = canvas.toDataURL('image/png')
    photo.setAttribute('src', data)

    const requestBody = JSON.stringify({
      name: userProfile.given_name,
      url: data
    })

    var request = new Request('/gallery', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('userToken'),
        'Content-type': 'application/json; charset=UTF-8'
      },
      method: 'POST',
      body: requestBody,
      cache: false
    })
    fetch(request)
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
    cache: false
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
