const Book = require("../models/book.model");
const User = require("../models/user.model");



const getAll = async (req, res) => {
    try {
        const userId = req.user.id; 
        console.log("User ID:", userId);
        const posts = await Book.find()
            .populate('user', 'username')
            .populate('likes')
            .lean();

        posts.forEach(post => {
            post.likeCount = post.likes.length;
            post.isLikedByUser = post.likes.some(like => like.toString() === userId);
            delete post.likes;

            const author = post.user;
            
            if (author.following) {
                post.isFollowingAuthor = author.following.some(follower => follower === userId);
            } else {
                post.isFollowingAuthor = false;
            }
            delete post.user.following;
        });

        res.send(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while fetching posts.' });
    }
}

module.exports = {
    createBook,
    getAll
};