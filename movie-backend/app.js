// Movie API Key
// 320b4a81527cb06be689a396ecc7be50

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { saveUser, findUserByEmail, saveReview, getReviewsByMovie, deleteReview, deleteUser } = require('./dal'); 

const app = express();
const port = 3000;
const apiKey = '320b4a81527cb06be689a396ecc7be50';
const secretKey = 'your_secret_key'; // Change this to a secure key

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access denied' });

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Movie Details by ID
app.get('/api/movie/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching movie details:", error.message);
        res.status(500).json({ error: "Failed to fetch movie details" });
    }
});

// Search Movies
app.get('/api/movies/search', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ error: "Query parameter is required" });

    try {
        const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, { params: { api_key: apiKey, query } });
        res.json(response.data.results);
    } catch (error) {
        console.error("Error fetching movies:", error.message);
        res.status(500).json({ error: "Failed to fetch movies" });
    }
});

// User Registration
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = { email, password: hashedPassword };
        await saveUser(user);
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("User registration error:", error.message);
        res.status(500).json({ error: "Failed to register user" });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(404).json({ error: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ userId: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ error: "Login failed" });
    }
});

// Submit Review
app.post('/api/reviews', authenticateToken, async (req, res) => {
    const { movieId, rating, review } = req.body;
    if (!movieId || !rating || !review) return res.status(400).json({ error: "All fields are required" });

    try {
        await saveReview({ movieId, userId: req.user.userId, rating, review });
        res.status(201).json({ message: "Review submitted successfully!" });
    } catch (error) {
        console.error("Error submitting review:", error.message);
        res.status(500).json({ error: "Failed to submit review" });
    }
});

// Fetch Reviews for a Movie
app.get('/api/reviews/:movieId', async (req, res) => {
    try {
        const reviews = await getReviewsByMovie(req.params.movieId);
        res.json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error.message);
        res.status(500).json({ error: "Failed to fetch reviews" });
    }
});

// Admin - Delete Review
app.delete('/api/reviews/:reviewId', authenticateToken, async (req, res) => {
    try {
        if (!req.user.isAdmin) return res.status(403).json({ error: "Unauthorized" });
        await deleteReview(req.params.reviewId);
        res.json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error.message);
        res.status(500).json({ error: "Failed to delete review" });
    }
});

// Admin - Delete User
app.delete('/api/users/:userId', authenticateToken, async (req, res) => {
    try {
        if (!req.user.isAdmin) return res.status(403).json({ error: "Unauthorized" });
        await deleteUser(req.params.userId);
        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));

