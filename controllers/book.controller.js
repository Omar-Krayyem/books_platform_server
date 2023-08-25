const Book = require("../models/book.model");
const User = require("../models/user.model");


const createBook = async (req, res) => {
    const { title, author, genre, review} = req.body;
    const user = req.user.id;
    
    const post = new Book({
        title,
        author,
        genre,
        review,
        user
    })
    try {
        const savedBook = await post.save();
        return res.status(201).json(savedBook);
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while posting the book.' });
    }
}

const getAll = async (req, res) => {
    try {
        const userId = req.user.id; 
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

const getBook = async (req, res) => {
    const postId = '64e62921fafd88d85f855093'
    // const { postId } = req.params;
    const userId = req.user.id; 

  try {
    const post = await Book.findById(postId)
            .populate('user', 'username')
            .populate('likes')
            .lean();

        if (!post) {
            return res.status(404).json({ message: 'Book not found.' });
        }

        post.likeCount = post.likes.length;
        post.isLikedByUser = post.likes.some(like => like.toString() === userId.toString()); // Compare as strings
        delete post.likes;

        const author = post.user;
        
        if (author.following) {
            post.isFollowingAuthor = author.following.some(follower => follower.toString() === userId.toString()); // Compare as strings
        } else {
            post.isFollowingAuthor = false;
        }
        delete post.user.following;

        res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching the post.' });
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

const getRecommended = async (req, res) => {
    const currentUser = req.user; 
  
    try {
      const followingIds = currentUser.following;
      const followingBooks = await Book.find({ user: { $in: followingIds } }).populate("user");

      followingBooks.forEach(post => {
        post.likeCount = post.likes.length;
        post.isLikedByUser = post.likes.includes(currentUser._id);
        delete post.likes;

        const author = post.user;
        
        if (author.following) {
            post.isFollowingAuthor = author.following.some(follower => follower === currentUser._id);
        } else {
            post.isFollowingAuthor = false;
        }
        delete post.user.following;
      });


      res.status(200).json(followingBooks);
    } catch (error) {
      res.status(500).json({ message: 'An error occurred while fetching following books.' });
    }
};

const searchBooks = async(req, res) => {
    const currentUser = req.user;
    try {
        const searchingBook = req.params.searching
        let books = await Book.find({
            $or: [
                {
                    author: {
                        $regex: searchingBook,
                        $options: 'i'
                    }
                }, {
                    review: {
                        $regex: searchingBook,
                        $options: 'i'
                    }
                }, {
                    genre: {
                        $regex: searchingBook,
                        $options: 'i'
                    }
                }
            ]
        })

        books.forEach(book => {
            book.likeCount = book.likes.length;
            book.isLikedByUser = book.likes.includes(currentUser);
            delete book.likes;

            // const author = book.user;
            
            // if (author.following) {
            //     book.isFollowingAuthor = author.following.some(follower => follower === currentUser);
            // } else {
            //     book.isFollowingAuthor = false;
            // }
            // delete post.user.following;
        });
        res
            .status(200)
            .json(books)
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
    likeBook,
    getRecommended,
    searchBooks,
    getBook
};