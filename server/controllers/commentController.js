// Controller: Commment, /controllers/commentController.js

const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const { body,validationResult } = require('express-validator');

// Create a comment
exports.create_comment = [ 
    // Sanitize/Validate
    body('comment_text', 'No text was given').trim().isLength({ min: 1 }).escape(),
    
    (req, res, next) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.json({ errors });
        } else {
            Comment.create(
                {
                    username: req.body.username,
                    text: req.body.comment_text,
                    post: req.params.postID
                },
                (err, comment) => {
                    // If theres an error
                    if (err) return res.json(err);

                    // Otherwise
                    // Add the comment to the corresponding post
                    Post.findByIdAndUpdate({ _id: req.params.postID }, { "$push": { "comments": comment._id } }, (err, result) => {
                    if (err) {
                        res.send(err);
                    } else {
                        console.log('Success')
                    }
                    });

                    return res.json({ comment });
                }
            );
            
        }
    }
]

// Get all comments on a post
exports.get_all_comments = (req, res, next) => {
    // Get all comments on a post in general
    Comment.find()
        // Mongoose's populate() fills in the Schema type field with the post that matched the ObjectID
        .populate('post')
        .exec((err, data) => {
            // If theres an error, return the error
            if (err) return res.json(err);

            // Filter out only the ones that belong to a specific post using the Mongo .equals() method
            let comments = data.filter((comment) => comment.post._id.equals(req.params.postID));

            return res.json({ comments });
        });

};

// Get a specific comment
exports.get_specific_comment = (req, res, next) => {
    Comment.findById(req.params.commentID)
        .exec((err, comment) => {
            if (err) return res.json(err);

        return res.json({ comment });
        });
};

// Delete a comment
exports.delete_comment = (req, res, next) => {
    // Verify jsonwebtoken
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        // If there's an error
        if (err) {
            res.sendStatus(403);
        } else {
            // Find the post and remove it using Mongoose's findByIdAndDelete method
            Comment.findByIdAndDelete(req.params.commentID, (err) => {
                // If there is an error
                if (err) return res.json(err);
        
                // Otherwise
                res.json({
                    message: "Post removed from database.",
                    authData
                });
            });
        }
    });

    
};