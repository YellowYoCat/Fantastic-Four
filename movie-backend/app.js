
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, findUserByEmail, createUser, Review, createAdminUser, promoteToAdmin } = require('./dal');

const app = express();
const port = 5000;
const apiKey = '320b4a81527cb06be689a396ecc7be50';
const secretKey = 'your_secret_key';

app.use(cors({ origin: '*' }));
app.use(express.json());


app.post('/create-admin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const adminUser = await createAdminUser(email, password);
        res.status(201).json({ message: 'Admin user created successfully', user: adminUser });
    } catch (error) {
        console.error('Error creating admin user:', error);
        res.status(500).json({ message: 'Failed to create admin user' });
    }
});

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
    isAdmin: Boolean!
  }

  input UserSignup {
    email: String!
    password: String!
    isAdmin: Boolean!  # Add isAdmin field
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
    makeAdmin(userId: ID!): String
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
      return await Review.find({ movieId }).exec();
    },
  },

  Mutation: {
    signup: async (_, { user }) => {
      const { email, password, isAdmin } = user; 
      if (!email || !password) {
        throw new Error('Email and password are required');
      }
      try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          throw new Error('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword, isAdmin }); // Include isAdmin
        await newUser.save();
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
          { userId: user._id, email: user.email, isAdmin: user.isAdmin },
          secretKey,
          { expiresIn: '1h' }
        );
        return token;
      } catch (error) {
        throw new Error('Login failed');
      }
    },
    makeAdmin: async (_, { userId }, context) => {
      if (!context.user || !context.user.isAdmin) throw new Error('Unauthorized');
      const user = await promoteToAdmin(userId);
      if (!user) throw new Error('User not found');
      return `User ${user.email} is now an admin`;
    },
    submitReview: async (_, { movieId, rating, review }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      try {
        const newReview = new Review({
          movieId,
          userId: context.user.userId,
          rating,
          review,
        });
        await newReview.save();
        return 'Review submitted successfully';
      } catch (error) {
        console.error('Error submitting review:', error.message);
        throw new Error('Failed to submit review');
      }
    },
    deleteReview: async (_, { reviewId }, context) => {
      if (!context.user) throw new Error('Unauthorized');
      const review = await Review.findById(reviewId);
      if (!review) throw new Error('Review not found');
      if (review.userId !== context.user.userId && !context.user.isAdmin) {
        throw new Error('Unauthorized');
      }
      await review.deleteOne();
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
        user.email = email;
        user.password = await bcrypt.hash(password, 10);
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