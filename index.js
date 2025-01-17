require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
let store = [];

function isValidURL(string) {
  try {
    const url = new URL(string); // Attempt to construct a URL object
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (err) {
    return false; // If an error is thrown, it's not a valid URL
  }
}
app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.use('/api/shorturl', bodyParser.urlencoded({ extended: false }))
app.post('/api/shorturl', function (req, res) {
  console.log(req.body.url);
  let obj = {};
  if (isValidURL(req.body.url)) {
    obj = {
      original_url: req.body.url,
      short_url: "jaap" + store.length
    }
    store.push(obj);
  } else {
    obj = { error: 'invalid url' };
  }
  res.json(obj);
});

app.get('/api/shorturl/:short_url', function (req, res) {
  console.log(store);
  obj = store.filter(({ original_url, short_url }) => short_url === req.params.short_url);
  console.log(obj);
  //  res.json(obj[0]);
  res.redirect(obj[0].original_url);
});



app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
