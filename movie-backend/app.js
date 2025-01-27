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

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is running on port ${port}`);
    }
});


app.use(cors({ origin: '*' }));

app.listen(port, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server is running on port ${port}`);
    }
});


app.get('/movie/:id', async (req, res) => {
    const id = req.params.id;
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });
    }catch{
        console.log("error");
    }
});

app.get('/movies/search', async (req, res) => {
    const { query } = req.query; // ?query=movieTitle
    if (!query) {
        return res.status(400).send({ error: "Query parameter is required" });
    }
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie`,
            {
                params: {
                    api_key: MOVIE_API_KEY,
                    query, // Search query
                },
            }
        );
        const movies = response.data.results; // List of movies
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        res.status(500).send({ error: "Failed to fetch movies from TMDb API" });
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

 

