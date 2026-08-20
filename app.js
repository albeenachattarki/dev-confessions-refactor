require('dotenv').config()
const express = require('express')
const confessionRoutes = require('./routes/confessionRoutes')

const app = express()
const port = Number(process.env.PORT) || 3000

app.use(express.json())
app.use('/api/v1/confessions', confessionRoutes)

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Dev Confessions listening on port ${port}`)
  })
}

module.exports = app
