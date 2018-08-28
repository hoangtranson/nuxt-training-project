const { Nuxt, Builder } = require('nuxt');

const app = require('express')();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');

const isProd = (process.env.NODE_ENV === 'production');
const port = process.env.PORT || 3000;

const articleModel = require("./api/models/article");
const articleRoute = require("./api/routes/article")(articleModel);

let db;

if(process.env.ENV == 'Test'){
    db = mongoose.connect("mongodb://0.0.0.0:27017/bbs-api-test");
} else {
    db = mongoose.connect("mongodb://0.0.0.0:27017/bbs-api");
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const allowedOrigins = ['http://localhost:3000', 'http://localhost:8000'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use("/api", articleRoute);

// We instantiate Nuxt.js with the options
const config = require('./nuxt.config.js');
config.dev = !isProd;
const nuxt = new Nuxt(config);

// Render every route with Nuxt.js
app.use(nuxt.render);

// Build only in dev mode with hot-reloading
if (config.dev) {
  new Builder(nuxt).build()
  .then(listen)
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
else {
  listen();
}

function listen() {
  // Listen the server
  app.listen(port, '0.0.0.0')
  console.log('Server listening on `localhost:' + port + '`.')
}