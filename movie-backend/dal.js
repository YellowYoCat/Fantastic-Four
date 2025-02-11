const mongoose = require('mongoose');

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

// Save User Function
async function saveUser(userData) {
    try {
        const user = new User(userData);
        await user.save();
        console.log("User saved successfully:", user);
    } catch (error) {
        console.error("Error saving user:", error.message);
    }
}

// Find User by Email
async function findUserByEmail(email) {
    try {
        const user = await User.findOne({ email }).exec(); 
        return user;
    } catch (error) {
        console.error("Error finding user by email:", error.message);
        throw error; // Propagate the error
    }
}

// Export functions
module.exports = {
    saveUser,
    findUserByEmail,
};
