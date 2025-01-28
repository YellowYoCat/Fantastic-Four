// Movie API Key
// 320b4a81527cb06be689a396ecc7be50

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const { saveUser } = require('./dal'); 

const app = express();
const port = 3000;
const apiKey = '320b4a81527cb06be689a396ecc7be50';

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());




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

app.get('/movie/search', async (req, res) => {
    const { query } = req.query; // ?query=movieTitle
    if (!query) {
        return res.status(400).send({ error: "Query parameter is required" });
    }
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie`, //?api_keys${apiKey}
            {
                params: {
                    api_key:apiKey,
                    query, 
                },
            }
        );
        const movies = response.data.results; 
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        res.status(500).send({ error: "Failed to fetch movies from TMDb API" });
    }
});


app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        
        const user = { email, password: hashedPassword };
        await saveUser(user);

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error during user registration:", error.message);
        res.status(500).json({ error: "Failed to register user" });
    }
});


app.listen(port, (e) => {
    if (e) {
        console.log("error");
    } else {
        console.log(`Server is running on port ${port}`);
    }
});
