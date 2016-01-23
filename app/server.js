const app = require('./api.js')
const port = process.env.PORT || 5000
app.listen(port)
console.log(`Ready on port ${ port }`)
