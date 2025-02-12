const mongoose = require('mongoose');
const {ApolloServer, gql} = require('apollo-server');

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

//GraphQL Type Definitions
const typeDefs = gql`
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
`;


//resolvers
const resolvers = {
    Query: {
        user: async (_, { email }) => {
            try {
                const user = await User.findOne({ email }).exec();
                return user;
            } catch (error) {
                console.error("Error finding user by email:", error.message);
                throw error;
            }
        },
    },
    Mutation: {
        createUser: async (_, { email, password }) => {
            try {
                const user = new User({ email, password });
                await user.save();
                console.log("User saved successfully:", user);
                return user;
            } catch (error) {
                console.error("Error saving user:", error.message);
                throw error;
            }
        },
    },
};

// Apollo Server Setup
const server = new ApolloServer({ typeDefs, resolvers });

// Start the server
server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});

//#region
//old code
// Save User Function
// async function saveUser(userData) {
//     try {
//         const user = new User(userData);
//         await user.save();
//         console.log("User saved successfully:", user);
//     } catch (error) {
//         console.error("Error saving user:", error.message);
//     }
// }

// // Find User by Email
// async function findUserByEmail(email) {
//     try {
//         const user = await User.findOne({ email }).exec(); 
//         return user;
//     } catch (error) {
//         console.error("Error finding user by email:", error.message);
//         throw error; // Propagate the error
//     }
// }

// // Export functions
// module.exports = {
//     saveUser,
//     findUserByEmail,
// };
//#endregion
