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
const port = 3000;
const apiKey = '320b4a81527cb06be689a396ecc7be50';

app.use(cor());

app.listen(PORT, (e) => {
    if (e) {
        console.log("error");
    }
});




const valAPIKey = (req, res, next) => {
    const apiKey = req.header('api-key');
    if (apiKey === '320b4a81527cb06be689a396ecc7bew50') {
        next();
    } else {
        res.status(401).send({ error: 'Unauthorized' });

    }
}

 

