


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
const secretKey = 'your_secret_key'; // Change this to a secure key

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
  }

  type Mutation {
    signup(user: UserSignup!): String
    login(email: String!, password: String!): String
    submitReview(movieId: ID!, rating: Int!, review: String!): String
    deleteReview(reviewId: ID!): String
    deleteUser(userId: ID!): String
  }
`;


const resolvers = {
  Query: {
    movie: async (_, { id }) => {
      try {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
        return res.data;
      } catch (error) {
        console.error("Failed to fetch movie details:", error.message);
        throw new Error("Failed to fetch movie details");
      }
    },
    searchMovies: async (_, { query }) => {
      try {
        console.log(`Searching movies with query: ${query}`);
        const res = await axios.get(`https://api.themoviedb.org/3/search/movie`, { params: { api_key: apiKey, query } });
        console.log("Search API Response:", res.data);
        return res.data.results;
      } catch (error) {
        console.error("Failed to fetch movies:", error.message);
        throw new Error("Failed to fetch movies");
      }
    },


    reviews: async (_, { movieId }) => {
      throw new Error("Not implemented");
    }
  },
  Mutation: {
    signup: async (_, { user }) => {
      const { email, password } = user;
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
          throw new Error("User already exists");
        }
        await createUser(email, password);
        return "User registered successfully";
      } catch (error) {
        console.error("Signup error:", error);
        throw new Error("Failed to register user");
      }
    },
    login: async (_, { email, password }) => {
      try {
        const user = await findUserByEmail(email);
        if (!user) throw new Error("User not found");
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new Error("Invalid credentials");
        const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
        return token;
      } catch (error) {
        throw new Error("Login failed");
      }
    },
    submitReview: async (_, { movieId, rating, review }, context) => {
      if (!context.user) throw new Error("Unauthorized");
      throw new Error("Not implemented");
    },
    deleteReview: async (_, { reviewId }, context) => {
      if (!context.user || !context.user.isAdmin) throw new Error("Unauthorized");
      throw new Error("Not implemented");
    },
    deleteUser: async (_, { userId }, context) => {
      if (!context.user || !context.user.isAdmin) throw new Error("Unauthorized");
      throw new Error("Not implemented");
    }
  }
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
  }
});

server.start().then(() => {
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(port, () => {
    console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
  });
});

//#region
//old code 
// const { rootRes } = require('./dal');
// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// // const { saveUser, findUserByEmail, saveReview, getReviewsByMovie, deleteReview, deleteUser } = require('./dal');
// // Export the root resolver

// // const {createUser, User} = require('./dal');
// const { buildSchema } = require('graphql');
// const { graphqlHTTP } = require('express-graphql');

// const app = express();
// const port = 3000;
// const apiKey = '320b4a81527cb06be689a396ecc7be50';
// const secretKey = 'your_secret_key'; // Change this to a secure key

// app.use(cors({ origin: '*' }));
// app.use(bodyParser.json());

// // GraphQL Schema
// const schema = buildSchema(`
//   type Movie {
//     id: ID!
//     title: String!
//     overview: String!
//     release_date: String!
//     poster_path: String
//   }

//   type Review {
//     id: ID!
//     movieId: ID!
//     userId: ID!
//     rating: Int!
//     review: String!
//   }

//   type User {
//     id: ID!
//     email: String!
//   }

//   input UserSignup {
//   email: String!
//   password: String!
// }
    

//   type Query {
//     movie(id: ID!): Movie
//     searchMovies(query: String!): [Movie]
//     reviews(movieId: ID!): [Review]
//   }

//   type Mutation {
//     signup(user: UserSignup!): String
//     login(email: String!, password: String!): String
//     submitReview(movieId: ID!, rating: Int!, review: String!): String
//     deleteReview(reviewId: ID!): String
//     deleteUser(userId: ID!): String
//   }
// `);

// // Root Resolver
// const functions = {
//   movie: async ({ id }) => {
//     try {
//       console.log(`Fetching movie with ID: ${id}`);
//       const res = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}`);
//       console.log("Movie API Response:", res.data);
//       return res.data;
//     } catch (error) {
//       console.error("Failed to fetch movie details:", error.message);
//       throw new Error("Failed to fetch movie details");
//     }
//   },

//   searchMovies: async ({ query }) => {
//     try {
//       console.log(`Searching movies with query: ${query}`);
//       const res = await axios.get(`https://api.themoviedb.org/3/search/movie`, { params: { api_key: apiKey, query } });
//       console.log("Search API Response:", res.data);
//       return res.data.results;
//     } catch (error) {
//       console.error("Failed to fetch movies:", error.message);
//       throw new Error("Failed to fetch movies");
//     }
//   },

  

//   signup: async ({ user }) => {
//     const { email, password } = user;
//     if (!email || !password) {
//         throw new Error("Email and password are required");
//     }
//     try {
//         const existingUser = await findUserByEmail(email);
//         if (existingUser) {
//             throw new Error("User already exists");
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = { email, password: hashedPassword };
//         const rootRes = await createUser(newUser);
//         return "User registered successfully";
//     } catch (error) {
//         console.error("Signup error:", error);
//         throw new Error("Failed to register user");
//     }
// },


  

//   // signup: async ({ email, password }) => {
//   //   try {
//   //     const hashedPassword = await bcrypt.hash(password, 10);
//   //     const user = { email, password: hashedPassword };
//   //     await saveUser(user);
//   //     return 'User registered successfully';
//   //   } catch (error) {
//   //     throw new Error("Failed to register user");
//   //   }
//   // },

//   login: async ({ email, password }) => {
//     try {
//       const user = await findUserByEmail(email);
//       if (!user) throw new Error("User not found");
//       const validPassword = await bcrypt.compare(password, user.password);
//       if (!validPassword) throw new Error("Invalid credentials");
//       const token = jwt.sign({ userId: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
//       return token;
//     } catch (error) {
//       throw new Error("Login failed");
//     }
//   },

//   submitReview: async ({ movieId, rating, review }, context) => {
//     if (!context.user) throw new Error("Unauthorized");
//     try {
//       await saveReview({ movieId, userId: context.user.userId, rating, review });
//       return "Review submitted successfully";
//     } catch (error) {
//       throw new Error("Failed to submit review");
//     }
//   },

//   reviews: async ({ movieId }) => {
//     try {
//       return await getReviewsByMovie(movieId);
//     } catch (error) {
//       throw new Error("Failed to fetch reviews");
//     }
//   },

//   deleteReview: async ({ reviewId }, context) => {
//     if (!context.user || !context.user.isAdmin) throw new Error("Unauthorized");
//     try {
//       await deleteReview(reviewId);
//       return "Review deleted successfully";
//     } catch (error) {
//       throw new Error("Failed to delete review");
//     }
//   },

//   deleteUser: async ({ userId }, context) => {
//     if (!context.user || !context.user.isAdmin) throw new Error("Unauthorized");
//     try {
//       await deleteUser(userId);
//       return "User deleted successfully";
//     } catch (error) {
//       throw new Error("Failed to delete user");
//     }
//   }
// };

// // Authentication Middleware
// const authenticateToken = (req, res, next) => {
//   const token = req.header('Authorization');
//   if (!token) return next();

//   jwt.verify(token, secretKey, (err, user) => {
//     if (err) return next();
//     req.user = user;
//     next();
//   });
// };

// // GraphQL Endpoint
// app.use('/graphql', authenticateToken, graphqlHTTP((req) => ({
//   schema: schema,
//   rootValue: functions,
//   // context: { user: req.user },
//   graphiql: true // Enable GraphiQL for testing
// })));


// const PORT = 4000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
// });


// // Start the Server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
//#endregion
