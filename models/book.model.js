const mongoose = require("mongoose");
const Schema = mongoose.Schema

const BookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        index: true,
        required: true
    },
    genre: {
        type: String,
        index: true,
    },
    review: {
        type: String,
        index: true,
    },
    picture: {
        type: String,
    },
    
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model("Book", BookSchema);