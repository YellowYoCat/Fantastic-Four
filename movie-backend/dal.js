const mongoose = require('mongoose');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const bcrypt = require('bcrypt');

// MongoDB Connection
const DB_URI = "mongodb+srv://mmitchell:Tuff12top@cluster0.fm4mkz2.mongodb.net/MovieReview";
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("Users", userSchema);

// GraphQL Schema
const schema = buildSchema(`
    type User {
        id: ID!
        email: String!
        password: String!
    }

    type Query {
        user(email: String!): User
    }

    type Mutation {
        createUser(email: String!, password: String!): User
    }
`);

// Root Resolver
const root = {
    user: async ({ email }) => {
        try {
            const user = await User.findOne({ email }).exec();
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            console.error("Error finding user by email:", error.message);
            throw new Error('Error finding user');
        }
    },
    createUser: async ({ email, password }) => {
        try {
            const existingUser = await User.findOne({ email }).exec();
            if (existingUser) {
                throw new Error('User already exists');
            }
            const user = new User({ email, password });
            await user.save();
            console.log("User saved successfully:", user);
            return user;
        } catch (error) {
            console.error("Error saving user:", error.message);
            throw new Error('Error creating user');
        }
    },
};

// Express App Setup
const app = express();

// GraphQL Middleware
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true, // Enable GraphiQL for testing
}));

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}/graphql`);
});


// //#region
// //old code
// // Save User Function
// // async function saveUser(userData) {
// //     try {
// //         const user = new User(userData);
// //         await user.save();
// //         console.log("User saved successfully:", user);
// //     } catch (error) {
// //         console.error("Error saving user:", error.message);
// //     }
// // }

// // // Find User by Email
// // async function findUserByEmail(email) {
// //     try {
// //         const user = await User.findOne({ email }).exec(); 
// //         return user;
// //     } catch (error) {
// //         console.error("Error finding user by email:", error.message);
// //         throw error; // Propagate the error
// //     }
// // }

// // // Export functions
// // module.exports = {
// //     saveUser,
// //     findUserByEmail,
// // };
// //#endregion
