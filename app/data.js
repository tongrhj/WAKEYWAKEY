import mongoose from 'mongoose'

mongoose.connect('mongodb://admin:password@ds047950.mongolab.com:47950/iwult-app', function (err, res) {
  if (err) {
    console.log('ERROR connecting to Mongolabs' + err)
  } else {
    console.log('Connected to Mongolabs')
  }
})

const Photo = mongoose.model('Pictures', {
  name: String,
  id: Number
})

// mongoose.connect('mongodb://' + process.env.MONGODB_USER + ':' + process.env.MONGODB_PASSWORD + '@ds061954.mongolab.com:61954/wdi-sg-playground')
//
// const PlayerScore = mongoose.model('Picture', {
//   name: String
// })

module.exports = Photo
