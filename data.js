var mongoose = require('mongoose')

mongoose.connect('mongodb://' + process.env.WAKEY_MONGODB_USER + ':' + process.env.WAKEY_MONGODB_PASSWORD + '@ds047950.mongolab.com:47950/iwult-app', function (err, res) {
  if (err) {
    console.log('ERROR connecting to Mongolabs' + err)
  } else {
    console.log('Connected to Mongolabs')
  }
})

const Photo = mongoose.model('Pictures', {
  name: String,
  url: String
})

module.exports = Photo
