require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
// Retrieve an access token
spotifyApi
.clientCredentialsGrant()
.then(data => spotifyApi.setAccessToken(data.body['access_token']))
.catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
// Homepage
app.get("/", (req, res) => {
    // console.log("Homepage");
    res.render("home")
})

// Artists results page:
app.get("/artist-search", (req, res) => {
    // console.log(req.query);
    spotifyApi
        .searchArtists(req.query.theArtistName)
        .then(data => {
            // data.body.artists.items.forEach(el => {
            //     console.log("The received data from the API: ", el.images);
            // })
            
            res.render("artist-search-results.hbs", {artists: data.body.artists.items});
        })
        .catch(error => console.log("The error while searching artists ocurred: ", error));
})

app.get("/albums/:artistId", (req, res, next)=> {
    console.log(req.params);
    spotifyApi
        .getArtistAlbums(req.params.artistId)
        .then(data => {
            // console.log(data.body.items)
            res.render("albums.hbs", {albums: data.body.items})
        })
        .catch(error => console.log(error));
})

app.get("/tracks/:trackId", (req, res, nex) => {
    spotifyApi
        .getAlbumTracks(req.params.trackId)
        .then(data => {
            // console.log(data.body.items);
            res.render("tracks.hbs", {tracks: data.body.items})
        })
        .catch(error => console.log(error))
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
