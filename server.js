const { Nuxt, Builder } = require("nuxt")

const app = require("express")()
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const isProd = process.env.NODE_ENV === "production"
const port = process.env.PORT || 3000

const articleModel = require("./api/models/article")
const articleRoute = require("./api/routes/article")(articleModel)

if (process.env.ENV == "Test") {
  mongoose.connect("mongodb://0.0.0.0:27017/bbs-api-test")
} else {
  mongoose.connect("mongodb://0.0.0.0:27017/bbs-api")
}

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use("/api", articleRoute)

// We instantiate Nuxt.js with the options
const config = require("./nuxt.config.js")
config.dev = !isProd
const nuxt = new Nuxt(config)

// Render every route with Nuxt.js
app.use(nuxt.render)

// Build only in dev mode with hot-reloading
if (config.dev) {
  new Builder(nuxt)
    .build()
    .then(listen)
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
} else {
  listen()
}

function listen() {
  // Listen the server
  app.listen(port, "0.0.0.0")
  console.log("Server listening on `localhost:" + port + "`.")
}
