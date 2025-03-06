const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, findUserByEmail, createUser, Review } = require('./dal');

const app = express();
const port = 5000;
const apiKey = '320b4a81527cb06be689a396ecc7be50';
const secretKey = 'your_secret_key'; 

app.use(cors({ origin: '*' }));
app.use(express.json());

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
    password: String!
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
      return await User.findOne({ email: context.user.email });
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
        const res = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
          params: { api_key: apiKey, query },
        });
        return res.data.results;
      } catch (error) {
        console.error('Failed to fetch movies:', error.message);
        throw new Error('Failed to fetch movies');
      }
    },
    reviews: async (_, { movieId }) => {
      return await Review.find({ movieId }).exec();
    },
  },

  Mutation: {
    signup: async (_, { user }) => {
      const { email, password } = user;
      if (!email || !password) throw new Error('Email and password are required');
      const existingUser = await findUserByEmail(email);
      if (existingUser) throw new Error('User already exists');
      await createUser(email, password);
      return 'User registered successfully';
    },
    login: async (_, { email, password }) => {
      const user = await findUserByEmail(email);
      if (!user) throw new Error('User not found');
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) throw new Error('Invalid credentials');
      return jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
    },
    submitReview: async (_, { movieId, rating, review }) => {
      console.log('Review Data:', { movieId, rating, review });
  
      if (!rating || !review) throw new Error('Rating and review are required');
      if (rating < 1 || rating > 5) throw new Error('Rating must be between 1 and 5');
  
      // For now, we'll just set a dummy userId
      const dummyUserId = "1"; // Replace with any userId or leave static for testing
  
      // Log the review object before saving
      const newReview = new Review({
          movieId,
          userId: dummyUserId, // Use the dummy userId here
          rating,
          review,
      });
  
      try {
          const savedReview = await newReview.save();
          console.log('Review saved:', savedReview); // Log the saved review
          return 'Review submitted successfully';
      } catch (error) {
          console.error('Error saving review:', error);
          throw new Error('Error saving review');
      }
  },
    deleteReview: async (_, { reviewId }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      const review = await Review.findById(reviewId);
      if (!review) throw new Error('Review not found');
      if (review.userId !== context.user.userId) throw new Error('Not authorized to delete this review');
      await review.deleteOne();
      return 'Review deleted successfully';
    },
    deleteUser: async () => {
      throw new Error('Not implemented');
    },
    updateUser: async (_, { email, password }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      const user = await User.findOne({ email: context.user.email });
      if (!user) throw new Error('User not found');
      user.password = await bcrypt.hash(password, 10);
      await user.save();
      return 'Profile updated successfully';
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';  // Extract token from headers
    try {
      const user = jwt.verify(token, secretKey);  // Verify the token
      return { user };  // Attach user data to context
    } catch (error) {
      return { user: null };  // If token is invalid, set user as null
    }
  },
});

server.start().then(() => {
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
});
