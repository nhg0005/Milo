// Model: Posts, ./models/postModel.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    username: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    date: { type: Date, default: Date.now() },
    text: { type: String, required: true },
    // Url from Firebase
    image: { type: String },
    published: { type: Boolean, default: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
    
  },
);

// Virtual for post's url
PostSchema
  .virtual('url')
  .get(function () {
    return '/posts/' + this._id;
  });

// Export model
module.exports = mongoose.model('Posts', PostSchema);