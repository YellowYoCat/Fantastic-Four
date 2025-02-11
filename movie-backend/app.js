// Movie API Key
// 320b4a81527cb06be689a396ecc7be50

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { saveUser, findUserByEmail, saveReview, getReviewsByMovie, deleteReview, deleteUser } = require('./dal'); 
const { buildSchema } = require('graphql');

const app = express();
const port = 3000;
const apiKey = '320b4a81527cb06be689a396ecc7be50';
const secretKey = 'your_secret_key'; // Change this to a secure key

app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

const Schema = buildSchema(`
    type Movie {
    id: ID!
    title: String!
    overview: String!
    release_date: String!
    poster_path: String
  }

  type Review {
    id: ID!
    movieId: ID!
    userId: ID!
    rating: Int!
    review: String!
  }

  type User {
    id: ID!
    email: String!
  }

  type Query {
    movie(id: ID!): Movie
    searchMovies(query: String!): [Movie]
    reviews(movieId: ID!): [Review]
  }

  type Mutation {
    signup(email: String!, password: String!): String
    login(email: String!, password: String!): String
    submitReview(movieId: ID!, rating: Int!, review: String!): String
    deleteReview(reviewId: ID!): String
    deleteUser(userId: ID!): String
  }
    `);


    const root = {
        movie: async ({ id }) => {
            try{
                const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
                return res.data;

            } catch(err){
                throw new err("failed to fetch movie details")
            }
        },

        searchMovies: async ({query}) => {
            try {
                const res = await axios.get(`https://api.themoviedb.org/3/search/movie`, { params: { api_key: apiKey, query } });
                return res.data.results
            } catch (err) {
                throw new err('failed to fetch movies')
            }
        },

        signup: async ({query}) => {
            try {
                
            } catch (err) {
                throw new err("failed to register user")
            }
        },

        login: async ({email, password}) => {
            try {
                
            } catch (err) {
                throw new err("Login failed")
            }
        },

        submitReview: async ({movieId, rating, review}, context) => {
            if(!context.user) throw new err("unauthorized")
                {
                try {
                    
                } catch (err) {
                    throw new err("failed to submit")
                }
            };
        },

        reviews: async ({movieId}) => {
            try {
                
            } catch (err) {
                throw new err("failed to fetch reviews")
            }
        },

        deleteReview: async ({userId}, context) => {
            if(!context.user || !context.user.isAdmin) throw new err("unauthorized")
                {
                try {
                    
                } catch (err) {
                    throw new err("failed to delete user")
                }
            };
        }


    };

    const authenticateToken = (req, res, next) =>{
        const token = req.header('Authorization');
        if (!token) return next();

        jwt.verify(token.secretKey, (err,user) => {
            if (err) return next();
            req.user = user;
            next();

        });
    };

    app.use('/graphql', authenticateToken, graphqlHTTP({
        schema: schema,
        rootValue: root,
        context: ({ req }) => ({ user: req.user }),
        graphiql: true
      }));


//#region
// // Authentication middleware
// const authenticateToken = (req, res, next) => {
//     const token = req.header('Authorization');
//     if (!token) return res.status(401).json({ error: 'Access denied' });

//     jwt.verify(token, secretKey, (err, user) => {
//         if (err) return res.status(403).json({ error: 'Invalid token' });
//         req.user = user;
//         next();
//     });
// };

// // Movie Details by ID
// app.get('/api/movie/:id', async (req, res) => {
//     const id = req.params.id;
//     try {
//         const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
//         res.json(response.data);
//     } catch (error) {
//         console.error("Error fetching movie details:", error.message);
//         res.status(500).json({ error: "Failed to fetch movie details" });
//     }
// });

// // Search Movies
// app.get('/api/movies/search', async (req, res) => {
//     const { query } = req.query;
//     if (!query) return res.status(400).json({ error: "Query parameter is required" });

//     try {
//         const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, { params: { api_key: apiKey, query } });
//         res.json(response.data.results);
//     } catch (error) {
//         console.error("Error fetching movies:", error.message);
//         res.status(500).json({ error: "Failed to fetch movies" });
//     }
// });

// // User Registration
// app.post('/api/signup', async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const user = { email, password: hashedPassword };
//         await saveUser(user);
//         res.status(201).json({ message: "User registered successfully!" });
//     } catch (error) {
//         console.error("User registration error:", error.message);
//         res.status(500).json({ error: "Failed to register user" });
//     }
// });

// // User Login
// app.post('/api/login', async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({ error: "Email and password are required" });
//     }

//     try {
//         // Find the user by email
//         const user = await findUserByEmail(email);

//         if (!user) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         // Validate the password
//         const validPassword = await bcrypt.compare(password, user.password);

//         if (!validPassword) {
//             return res.status(401).json({ error: "Invalid credentials" });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
//         res.json({ token });

//     } catch (error) {
//         console.error("Login error:", error.message);
//         res.status(500).json({ error: "Login failed" });
//     }
// });

// // Submit Review
// app.post('/api/reviews', authenticateToken, async (req, res) => {
//     const { movieId, rating, review } = req.body;
//     if (!movieId || !rating || !review) return res.status(400).json({ error: "All fields are required" });

//     try {
//         await saveReview({ movieId, userId: req.user.userId, rating, review });
//         res.status(201).json({ message: "Review submitted successfully!" });
//     } catch (error) {
//         console.error("Error submitting review:", error.message);
//         res.status(500).json({ error: "Failed to submit review" });
//     }
// });

// // Fetch Reviews for a Movie
// app.get('/api/reviews/:movieId', async (req, res) => {
//     try {
//         const reviews = await getReviewsByMovie(req.params.movieId);
//         res.json(reviews);
//     } catch (error) {
//         console.error("Error fetching reviews:", error.message);
//         res.status(500).json({ error: "Failed to fetch reviews" });
//     }
// });

// // Admin - Delete Review
// app.delete('/api/reviews/:reviewId', authenticateToken, async (req, res) => {
//     try {
//         if (!req.user.isAdmin) return res.status(403).json({ error: "Unauthorized" });
//         await deleteReview(req.params.reviewId);
//         res.json({ message: "Review deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting review:", error.message);
//         res.status(500).json({ error: "Failed to delete review" });
//     }
// });

// // Admin - Delete User
// app.delete('/api/users/:userId', authenticateToken, async (req, res) => {
//     try {
//         if (!req.user.isAdmin) return res.status(403).json({ error: "Unauthorized" });
//         await deleteUser(req.params.userId);
//         res.json({ message: "User deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting user:", error.message);
//         res.status(500).json({ error: "Failed to delete user" });
//     }
// });
//#endregion

app.listen(port, () => console.log(`Server running on port ${port}`));

