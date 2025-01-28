const mongoose = require('mongoose');

// MongoDB Connection
const DB_URI = "mongodb+srv://mmitchell:Tuff12top@cluster0.fm4mkz2.mongodb.net/";
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Save User Function
async function saveUser(userData) {
    const user = new User(userData);
    await user.save();
}

// Export functions
module.exports = {
    saveUser,
};
