const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: String,
    username: String,
    likes: [],
    comments: []
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;