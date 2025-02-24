
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const DB_URI = "mongodb+srv://mmitchell:Tuff12top@cluster0.fm4mkz2.mongodb.net/MovieReview";
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));


const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

const User = mongoose.model("Users", userSchema);


module.exports = {
    User,
    findUserByEmail: async (email) => {
        return await User.findOne({ email }).exec();
    },
    createUser: async (email, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        return user;
    }
};


