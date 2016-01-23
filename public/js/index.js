'use strict'

const width = 320    // We will scale the photo width to this
let height = 0       // This will be computed based on the input stream

let streaming = false

let video = null
let canvas = null
let photo = null
let startbutton = null

function startup () {
  video = document.getElementById('video')
  canvas = document.getElementById('canvas')
  photo = document.getElementById('photo')
  startbutton = document.getElementById('startbutton')

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
    takepicture()
    e.preventDefault()
  }, false)

  clearphoto()
}

function clearphoto () {
  var context = canvas.getContext('2d')
  context.fillStyle = '#AAA'
  context.fillRect(0, 0, canvas.width, canvas.height)

  var data = canvas.toDataURL('image/png')
  photo.setAttribute('src', data)
}

function takepicture () {
  var context = canvas.getContext('2d')
  if (width && height) {
    canvas.width = width
    canvas.height = height
    context.drawImage(video, 0, 0, width, height)
    var data = canvas.toDataURL('image/png')
    photo.setAttribute('src', data)
  } else {
    clearphoto()
  }
}

window.addEventListener('load', startup)
