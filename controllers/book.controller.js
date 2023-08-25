const Book = require("../models/book.model");
const User = require("../models/user.model");


const createBook = async (req, res) => {

    const { title, author, genre, review, image} = req.body;
    // let name = 'book 2';
    // let author = 'mhmd';
    // let image = 'mhmd.jpg';
    // let review = 'nice book';
    // let genre = 'novel' 
    // let user = '64e5f438edcb4c17bfe2e04b';
    const user = await User.findById(req.user.id);

    image = 'omar'
    
    const post = new Book({ title, author, genre, review, image, user });

    console.log(post);
    try {
        const savedPost = await post.save();
        await user.updateOne({
            $push: {
                posts: savedPost._id
            }
        });
        return res.status(201).json(savedPost);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred.' });
    }
}

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
            post.isLikedByUser = post.likes.includes(userId);
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

const unlikeBook = async (req, res) => {
    const { bookId } = req.params;
    const currentUser = req.user; 
  
    try {
      const book = await Book.findById(bookId);
  
      book.likes = book.likes.filter(id => id.toString() !== currentUser._id.toString());
      await book.save();
  
      res.status(200).json({ message: 'Book unliked successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while unliking the book.' });
    }
};

  
const likeBook = async (req, res) => {
    try {
        const post = await Book.findById(req.params.bookId)

        if (!post.likes.includes(req.user.id)) {
            await post.updateOne({
                $push: {
                    likes: req.user.id
                }
            });
            res
                .status(200)
                .json("You just liked the post");
        } else {
            await post.updateOne({
                $pull: {
                    likes: req.user.id
                }
            });
            res
                .status(200)
                .json("You just disliked the post");
        }
    } catch (error) {
        res
            .status(500)
            .json(error)
    }
}


module.exports = {
    createBook,
    getAll,
    unlikeBook,
    likeBook
};