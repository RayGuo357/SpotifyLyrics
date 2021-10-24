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

app.get('/update', function (req, res) {

  var currentlyPlaying = {
    url: 'https://api.spotify.com/v1/me/player/currently-playing',
    headers: { 'Authorization': 'Bearer ' + req.query.access_token },
    json: true
  };

  request.get(currentlyPlaying, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var title = body.item.name;
      artists = artistCompiler(body.item.artists),
      album_cover = body.item.album.images[0].url,
      href = body.item.href,
      duration = body.item.duration_ms,
      is_playing = body.is_playing;
      progress = body.progress_ms,
      main_artist = body.item.artists[0].name;

      var seek_value = (body.progress_ms / body.item.duration_ms * 100).toFixed(2) * 100;

      res.json({
        'status_code': response.statusCode,
        title: title,
        artists: artists,
        // album_cover: album_cover,
        duration: duration,
        song_href: href,
        progress: progress,
        is_playing: is_playing,
        main_artist: main_artist
      });
    } else {
      res.send({
        'status_code': response.statusCode
      });
    }
  });
});

app.get('/refresh_token', function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'status_code': response.statusCode,
        'access_token': access_token
      });
    } else {
      res.send({
        'status_code': response.statusCode
      });
    }
  });
});

app.get('/pause', function (req, res) {
  var pause = {
    url: 'https://api.spotify.com/v1/me/player/pause',
    headers: { 'Authorization': 'Bearer ' + req.query.access_token },
  };

  request.put(pause, function (error, response, body) {
    if (!error && response.statusCode === 204) {
      res.send({
        'status_code': response.statusCode
      });
    } else {
      console.log('request failed')
      console.log(error)
      console.log(response.statusCode)
      res.send({
        'status_code': response.statusCode
      });
    }
  });

});

app.get('/play', function (req, res) {
  var pause = {
    url: 'https://api.spotify.com/v1/me/player/play',
    headers: { 'Authorization': 'Bearer ' + req.query.access_token },
  };

  request.put(pause, function (error, response, body) {
    if (!error && response.statusCode === 204) {
      res.send({
        'status_code': response.statusCode
      });
    } else {
      res.send({
        'status_code': response.statusCode
      });
    }
  });
});

app.get('/next', function (req, res) {
  var next = {
    url: 'https://api.spotify.com/v1/me/player/next',
    headers: { 'Authorization': 'Bearer ' + req.query.access_token },
  };

  request.post(next, function (error, response, body) {
    if (!error && response.statusCode === 204) {
      res.send({
        'status_code': response.statusCode
      });
    } else {
      res.send({
        'status_code': response.statusCode
      });
    }
  });
});

app.get('/previous', function (req, res) {
  var previous = {
    url: 'https://api.spotify.com/v1/me/player/previous',
    headers: { 'Authorization': 'Bearer ' + req.query.access_token },
  };

  request.post(previous, function (error, response, body) {
    if (!error && response.statusCode === 204) {
      res.send({
        'status_code': response.statusCode
      });
    } else {
      res.send({
        'status_code': response.statusCode
      });
    }
  });
});

app.get("/lyrics", (req, res) => {
  const spawn = require("child_process").spawnSync;
  const ls = spawn('python', ["./server/lyrics.py", req.query.title, req.query.artist], {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'pipe',
    encoding: 'utf-8'
  });
  
  setTimeout(() => {
    let output = ls.stdout;
    console.log(`Output is: ${output}`)
    output = output.split("Done.")
  
    res.send({
      'lyrics': output[2]
    })
  }, 2000)
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