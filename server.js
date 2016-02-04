// const app = require('./app.js')
// const port = process.env.PORT || 5000
// app.listen(port)
// console.log(`Ready on port ${ port }`)

import app from './app.js'
const port = 5000

app.listen(port)

console.log(`Server running at http://localhost:${ port }`)
