const {model,Schema} = require('mongoose');

const postSchema = new Schema({
    body: String,
    username: String,
    createdAt: String,
    test: String,
    comments: [
        {
            body: String,
            username: String,
            createdAt: String,
replies: [String]
        }
    ],

    likes: [
        {
            username: String,
            createdAt: String
        }
    ],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
});

module.exports = model('Post', postSchema);
