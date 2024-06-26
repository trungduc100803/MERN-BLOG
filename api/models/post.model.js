import mongoose from "mongoose";

const postModel = mongoose.Schema({
    userID: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    title: {
        type: String,
        require: true,
        unique: true
    },
    image: {
        type: String,
        default: 'https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png'
    },
    category: {
        type: String,
        default: 'uncategorized'
    },
    slug: {
        type: String,
        require: true,
        unique: true
    },
}, {timestamps: true})

const Post = mongoose.model('Post', postModel)
export default Post