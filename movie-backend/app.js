// Movie API Key
const MOVIE_API_KEY = "320b4a81527cb06be689a396ecc7be50";

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { saveUser } = require('./dal'); // Import database abstraction layer functions

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

// Search movies by title
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

// User Sign-Up Route
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        // Hash and salt the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save user to database using DAL
        const user = { email, password: hashedPassword };
        await saveUser(user);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error during user registration:", error.message);
        res.status(500).json({ error: "Failed to register user" });
    }
});

// Start the server
app.listen(PORT, (e) => {
    if (e) {
        console.log("error");
    } else {
        console.log(`Server is running on port ${PORT}`);
    }
});