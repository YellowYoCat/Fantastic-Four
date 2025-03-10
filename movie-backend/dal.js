
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const DB_URI = "mongodb+srv://mmitchell:Tuff12top@cluster0.fm4mkz2.mongodb.net/MovieReview";


mongoose.connect(DB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, 
});

const reviewSchema = new mongoose.Schema({
    movieId: { type: String, ref: 'Movie', required: true },
    userId: { type: String, ref: 'User', required: true },
    rating: { type: Number, required: true },
    review: { type: String, required: true },
});

const User = mongoose.model("Users", userSchema);
const Review = mongoose.model("Reviews", reviewSchema);

module.exports = {
    User,
    Review,
    findUserByEmail: async (email) => {
        return await User.findOne({ email }).exec();
    },
    createUser: async (email, password) => {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        return user;
    },
    createAdminUser: async (email, password) => { 
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, isAdmin: true });
        await user.save();
        return user;
    },
    createReview: async (movieId, userId, rating, review) => {
        const newReview = new Review({ movieId, userId, rating, review });
        await newReview.save();
        return newReview;
    },
    getReviewsByMovie: async (movieId) => {
        return await Review.find({ movieId }).populate('userId', 'email').exec();
    },
    deleteReview: async (reviewId, userId) => {
        const review = await Review.findOne({ _id: reviewId, userId }).exec();
        if (!review) throw new Error("Review not found or unauthorized");
        await Review.deleteOne({ _id: reviewId });
        return "Review deleted successfully";
    },
    promoteToAdmin: async (userId) => { 
        return await User.findByIdAndUpdate(userId, { isAdmin: true }, { new: true });
    }
};