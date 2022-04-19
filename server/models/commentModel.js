// Model: Comments, ./models/commentModel.js
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CommentSchema = new Schema(
  {
    username: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now() },
    post: { type: Schema.Types.ObjectId, ref: 'Posts', required: true }
  },
);

// Virtual for comment's url
CommentSchema
  .virtual('url')
  .get(function () {
    return '/posts/' + this.post._id + '/commments/' + this._id;
  });

// Export model
module.exports = mongoose.model('Comments', CommentSchema);