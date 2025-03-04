const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, findUserByEmail, createUser } = require('./dal');

const app = express();
const port = 5000;
const apiKey = '320b4a81527cb06be689a396ecc7be50';
const secretKey = 'your_secret_key'; 

app.use(cors({ origin: '*' }));
app.use(express.json());

// ✅ Move reviews array here (top-level scope)
const reviews = []; // Temporary in-memory storage

const typeDefs = gql`
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

  input UserSignup {
    email: String!
    password: String!
  }

  type Query {
    movie(id: ID!): Movie
    searchMovies(query: String!): [Movie]
    reviews(movieId: ID!): [Review]
    getUser: User
  }

  type Mutation {
    signup(user: UserSignup!): String
    login(email: String!, password: String!): String
    updateUser(email: String!, password: String!): String
    submitReview(movieId: ID!, rating: Int!, review: String!): String
    deleteReview(reviewId: ID!): String
    deleteUser(userId: ID!): String
  }
`;

const resolvers = {
  Query: {
    getUser: async (_, __, context) => {
      if (!context.user) throw new Error("Unauthorized"); 
      try {
        const user = await User.findOne({ email: context.user.email }).exec();
        if (!user) throw new Error("User not found");
        return user; 
      } catch (error) {
        console.error("Error fetching user:", error.message);
        throw new Error("Failed to fetch user data");
      }
    },
    movie: async (_, { id }) => {
      try {
        const res = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`
        );
        return res.data;
      } catch (error) {
        console.error('Failed to fetch movie details:', error.message);
        throw new Error('Failed to fetch movie details');
      }
    },
    searchMovies: async (_, { query }) => {
      try {
        console.log(`Searching movies with query: ${query}`);
        const res = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
          params: { api_key: apiKey, query },
        });
        console.log('Search API Response:', res.data);
        return res.data.results;
      } catch (error) {
        console.error('Failed to fetch movies:', error.message);
        throw new Error('Failed to fetch movies');
      }
    },
    reviews: async (_, { movieId }) => {
      // Return reviews for the specific movie
      return reviews.filter((review) => review.movieId === movieId);
    },
  },

  Mutation: {
    signup: async (_, { user }) => {
      const { email, password } = user;
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          throw new Error('User already exists');
        }
        await createUser(email, password);
        return 'User registered successfully';
      } catch (error) {
        console.error('Signup error:', error);
        throw new Error('Failed to register user');
      }
    },
    login: async (_, { email, password }) => {
      try {
        const user = await findUserByEmail(email);
        if (!user) throw new Error('User not found');
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new Error('Invalid credentials');
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          secretKey,
          { expiresIn: '1h' }
        );
        return token;
      } catch (error) {
        throw new Error('Login failed');
      }
    },
    submitReview: async (_, { movieId, rating, review }, context) => {
      if (!context.user) throw new Error('Unauthorized');

      try {
        const newReview = {
          id: reviews.length + 1, // Temporary unique ID
          movieId,
          userId: context.user.userId,
          rating,
          review,
        };

        reviews.push(newReview);
        console.log('New review added:', newReview);

        return 'Review submitted successfully';
      } catch (error) {
        console.error('Error submitting review:', error.message);
        throw new Error('Failed to submit review');
      }
    },
    deleteReview: async (_, { reviewId }, context) => {
      if (!context.user || !context.user.isAdmin) throw new Error('Unauthorized');

      const index = reviews.findIndex((r) => r.id === reviewId);
      if (index === -1) throw new Error('Review not found');

      reviews.splice(index, 1);
      return 'Review deleted successfully';
    },
    deleteUser: async (_, { userId }, context) => {
      if (!context.user || !context.user.isAdmin) throw new Error('Unauthorized');
      throw new Error('Not implemented');
    },
    updateUser: async (_, { email, password }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      try {
        const user = await User.findOne({ email: context.user.email }).exec();
        if (!user) throw new Error('User not found');

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        return 'Profile updated successfully';
      } catch (error) {
        console.error('Error updating profile:', error.message);
        throw new Error('Failed to update profile');
      }
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    try {
      const user = jwt.verify(token, secretKey);
      return { user };
    } catch (error) {
      return { user: null };
    }
  },
});

server.start().then(() => {
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
});
