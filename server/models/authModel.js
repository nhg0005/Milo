// Model: Auth, ./models/authModel.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AuthSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    // Will be url from Firebase
    profile_picture: { type: String },
    // Will be url from Firebase
    cover_image: { type: String },
    // An array of Posts
    posts: [{ type: Schema.Types.ObjectId, ref: 'Posts' }],
    // An array of other Users
    friends_list: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    inbound_friend_requests: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    outbound_friend_requests: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    liked_posts: [{type: Schema.Types.ObjectId, ref: 'Posts'}]
    
  },
);

// Export model
module.exports = mongoose.model('Users', AuthSchema);