const path = require('path');
const express = require('express');
const request = require('request');
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');

const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 8080;

var client_id = process.env.SPOTIFY_ID;
var client_secret = process.env.SPOTIFY_SECRET;
var redirect_uri = process.env.REDIRECT

var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

function artistCompiler(artists) {
  var artist_list = '';
  if (artists.length === 1) {
      artist_list = artists[0].name;
      return artist_list;
  } else {
      for (var a of artists) {
          if (artist_list === '') {
              artist_list = a.name;
          } else {
              artist_list = artist_list + ', ' + a.name;
          }
      }

      return artist_list;
  }
}

var stateKey = 'spotify_auth_state';

const app = express();

app.use(express.static(path.resolve(__dirname, '../client/build'))).use(cookieParser());
app.use(cors());
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});


app.get("/login", (req, res) => {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope = 'user-read-private ' +
    'user-read-email ' +
    'playlist-read-private ' +
    'user-read-currently-playing ' +
    'user-read-playback-state ' +
    'user-modify-playback-state ' +
    'playlist-read-collaborative ' +
    'user-read-recently-played ' +
    'user-library-read';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', function (req, res) {
  console.log("Got into callback")

  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#/currently-playing/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#/currently-playing/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

// app.get('/currently-playing', (req, res) => {
//   console.log("in currently playing")
// })

app.get('/update', function(req, res) {

  var currentlyPlaying = {
      url: 'https://api.spotify.com/v1/me/player/currently-playing',
      headers: { 'Authorization' : 'Bearer ' + req.query.access_token },
      json: true
  };

  request.get(currentlyPlaying, function(error, response, body) {
    console.log("Requesting")
      if (!error && response.statusCode === 200) {
        console.log("inside")
              var title = body.item.name;
              artists = artistCompiler(body.item.artists),
              album_cover = body.item.album.images[0].url,
              // duration = millisToMinutesAndSeconds(body.item.duration_ms),
              href = body.item.href,
              // progress_seek = millisToMinutesAndSeconds(body.progress_ms),
              is_playing = body.is_playing;
              // multiple_artists = body.item.artists.length > 1,
              // main_artist = body.item.artists[0].name;
          // console.log(body);

          var seek_value = (body.progress_ms / body.item.duration_ms * 100).toFixed(2) * 100;

          res.json({
              // message: "Hello from server!"
              title: title,
              artists: artists,
              // album_cover: album_cover,
              // 'duration_seek': duration,
              // song_href: href,
              // 'progress_seek': progress_seek,
              // 'seek_value': seek_value,
              // is_playing: is_playing,
              // 'multiple_artists': multiple_artists,
              // 'main_artist': main_artist
          });
      } else {
        console.log(error)
        console.log(response.statusCode)
      }
  });
});

app.get("/test", (req, res) => {
  console.log("success");
  console.log(req.query)
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});