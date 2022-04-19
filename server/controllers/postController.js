// Controller: Post, /controllers/postController.js
// Will also be used only by me
// Consider doing all of these async-ly

const Post = require('../models/postModel');
const Auth = require('../models/authModel');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { default: mongoose } = require('mongoose');

// Create a status post
exports.create_status_post = [ 
    // Sanitize/Validate
    body('post_text', 'No text was given').trim().isLength({ min: 1 }),
    
    (req, res, next) => {
        // Verify jsonwebtoken
        jwt.verify(req.token, 'secretKey', (err, authData) => {
            // If there's an error
            if (err) {
                res.sendStatus(403);
            } else {
                const errors = validationResult(req);

                // Create a payload based on whether or not an image is present
                let payload;
                if (req.body.image) {
                    payload = {
                        username: req.body.username,
                        text: req.body.post_text,
                        image: req.body.image
                    }
                } else {
                    payload = {
                        username: req.body.username,
                        text: req.body.post_text,
                    }
                }

                // If there are validation errors, return them.
                // Otherwise create the post and add its ObjectID to the authors 'posts'
                if (!errors.isEmpty()) {
                    res.json({ errors });
                } else {
                    Post.create(
                        payload,
                        (err, post) => {
                            // If theres an error
                            if (err) return res.json(err);
                
                            // Otherwise
                            // Add the post to the user's posts
                            Auth.findByIdAndUpdate({ _id: req.body.username }, { "$push": { "posts": post._id } }, (err, result) => {
                                if (err) {
                                    res.send(err);
                                } else {
                                    console.log('Success')
                                }
                                });

                            return res.json({
                                post
                            });
                        }
                    )
                }
            }
        });
    }
]

// Get all status posts
exports.get_all_posts = (req, res, next) => {
    // Use the Mongoose find() method on Post
    Post.find()
        .exec((err, posts) => {
            // If theres an error return the error
            if (err) return res.json(err);

            // Otherwise return all posts
            return res.json({ posts });
            });
};

// Get the current user's posts
exports.get_users_posts = (req, res, next) => {
    // Find posts by the user's ID passed in through the Params
    Post.find({ username: req.params.userID })
        .populate('username')
        .populate({
            path: 'comments',
            // Get usernames of comments
            populate: { path: 'username', select: 'first_name last_name' }
        })
        .exec((err, posts) => {
            // If theres an error return the error
            if (err) return res.json(err);

            return res.json({ posts });
        });
};

// Get the current user's friend's posts
exports.get_friends_posts = async (req, res, next) => {
    try {
        // Perform a search on Auth to find the user's friends list
        const friendsListObj = await Auth.findById(req.params.userID)
            .select('friends_list -_id') // Stops _id from being returned
            .exec();
    
        // Grab the array from the object
        const friendsListArr = friendsListObj['friends_list'];

        // Perform a search on Post to find posts by all of the user's friends
        const friendsPosts = await Post.find({
            'username': {
                $in: friendsListArr.map(function (friendID) { return mongoose.Types.ObjectId(friendID); })
            }
        })
            .populate('username', 'first_name last_name _id, profile_picture') // Populate the username field and return the first_name and last_name only
            .populate({
                path: 'comments',
                // Get usernames of comments
                populate: { path: 'username', select: 'first_name last_name _id' }
            });
        
    
        return res.json(friendsPosts);
    } catch (err) {
        return res.json(err);
    }
};

// Get a specific status post
exports.get_specific_post =  (req, res, next) => {
    Post.findById(req.params.postID)
        .exec((err, post) => {
            if (err) return res.json(err);

        return res.json({ post });
        });
};

// Delete a status post
exports.delete_status_post = (req, res, next) => {
    // Verify jsonwebtoken
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        // If there's an error
        if (err) {
            res.sendStatus(403);
        } else {
            // Find the post and remove it using Mongoose's findByIdAndDelete method
            Post.findByIdAndDelete(req.params.postID, (err) => {
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

// Like or unlike a status post
exports.like_unlike_post = (req, res, next) => {
    const postID = req.params.postID;
    const userID = req.params.userID;
    const action = req.params.action;

    // If the action is 'like'
    if (action === 'like') {
        // Add the user to the "likes" array of the post
        Post.findByIdAndUpdate({ _id: postID }, { "$push": { "likes": userID } }, (err, result) => {
            if (err) {
                res.send(err);
            } else {

            }
        });

        // Add the post to the user's "liked_posts" array
        Auth.findByIdAndUpdate({ _id: userID }, { "$push": { "liked_posts": postID } }, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json({message: "Like successful."})
            }
        });
    } else if (action === 'unlike') {
        // Remove the user from the "likes" array of the post
        Post.findByIdAndUpdate({ _id: postID }, { "$pull": { "likes": userID } }, (err, result) => {
            if (err) {
                res.send(err);
            } else {

            }
        });

        // Remove the post from the user's "liked_posts" array
        Auth.findByIdAndUpdate({ _id: userID }, { "$pull": { "liked_posts": postID } }, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json({message: "Unlike successful."})
            }
        });
    }
}