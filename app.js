const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

const app = express();
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());

// If you don't explicitly name the file you want to
// require, Node will automatically look for the index.js file
const routes = require('./routes');
app.use(`/api/${config.version}`, routes);

app.listen(config.app.port, () => {
  console.log('Coati user server listening on port 3000!');
});
