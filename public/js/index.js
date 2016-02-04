'use strict'

/* global Audio fetch Request localStorage FB userProfile */

const width = 600    // We will scale the photo width to this
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

  const aboutbutton = document.querySelector('#about-icon')

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
        const vendorURL = window.URL || window.webkitURL
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

  aboutbutton.addEventListener('click', (e) => {
    document.querySelector('#about').classList.toggle('hidden')
  })

  document.querySelector('.close').addEventListener('click', (e) => {
    document.querySelector('#about').classList.toggle('hidden')
  })

  clearphoto()
}

function clearphoto () {
  const context = canvas.getContext('2d')
  context.fillStyle = '#FFF'
  context.fillRect(0, 0, canvas.width, canvas.height)
  const data = canvas.toDataURL('image/png')
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

function uploadToMongo (dataURL) {
  const mongoRequest = new Request('/gallery', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('userToken'),
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      name: userProfile.given_name,
      url: dataURL
    }),
    cache: false
  })
  fetch(mongoRequest)
  .catch((error) => {
    console.log('There has been a problem with your fetch operation: ' + error.message)
  })
}

function uploadToIMGUR (base64image) {
  const imgurRequest = new Request('https://api.imgur.com/3/image', {
    headers: {
      'Authorization': 'Client-ID 4b24a6a46e6bea7',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      image: base64image,
      type: 'base64',
      description: 'Generated from WAKEYWAKEY Alarm Clock Webapp'
    }),
    cache: true
  })
  fetch(imgurRequest)
  .then(checkStatus)
  .then(parseJSON)
  .then((res) => {
    const imageURL = res.data.link
    uploadToMongo(imageURL)
    FB.login(() => {
      FB.api('/me/feed', 'POST', {
        name: 'I Did Not Wake Up On Time',
        link: 'https://wakey2.herokuapp.com/',
        caption: 'WakeyWakey Alarm Clock Webapp',
        picture: imageURL,
        description: 'I failed to wake up this morning and this is my punishment. Shame! Shame! Shame!'
      }, (response) => {
        if (response && !response.error) {
          console.log('http://facebook.com/jaredtongrh/posts/' + response.json().id)
        }
      })
    }, {scope: 'publish_actions'})
  }).catch((error) => {
    console.log('Upload to IMGUR Failed: ' + error.message)
  })
}

function checkStatus (res) {
  if (res.status >= 200 && res.status < 300) {
    return res
  } else {
    const error = new Error(res.statusText)
    error.res = res
    throw error
  }
}

function parseJSON (res) {
  return res.json()
}

function takepicture () {
  const context = canvas.getContext('2d')
  if (width && height) {
    canvas.width = width
    canvas.height = height
    context.drawImage(video, 0, 0, width, height)
    const dataURL = canvas.toDataURL('image/png')
    photo.setAttribute('src', dataURL)
    const base64image = dataURL.toString().substring(22, dataURL.toString().length)
    uploadToIMGUR(base64image)
  } else {
    clearphoto()
  }
}

function retrievePictures () {
  fetch('/gallery', {
    headers: {
      'Authorization': 'Bearer ' + localStorage.getItem('userToken')
    },
    method: 'GET',
    cache: false
  })
    .then(checkStatus)
    .then(parseJSON)
    .then((res) => {
      res.forEach((doc) => {
        const photoPost = document.createElement('img')
        photoPost.src = doc.url
        document.querySelector('#capture-gallery').appendChild(photoPost)
      })
    })
}

window.addEventListener('load', startup)
