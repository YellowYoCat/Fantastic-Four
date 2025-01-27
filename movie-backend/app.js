// Movie api key
// 320b4a81527cb06be689a396ecc7be50
// Movie API key
const MOVIE_API_KEY = "320b4a81527cb06be689a396ecc7be50";

console.log("is this working?");

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // for parsing JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // for parsing form submissions

// Routes

// Test the server
app.get('/', (req, res) => {
    res.send("Welcome to the Review Everything! Movie API");
});

app.listen(PORT, (e) => {
    if (e) {
        console.log("error");
    } else {
        console.log(`server is running on port ${PORT}`);
    }
});

app.get('')

 

