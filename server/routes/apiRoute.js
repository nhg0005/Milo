// Route: API, routes/apiRoute.js

const express = require('express');
const auth_controller = require('../controllers/authController');
const post_controller = require('../controllers/postController');
const comment_controller = require('../controllers/commentController');

const router = express.Router();
const cors = require('cors');

// Add CORS to all routes
router.use(cors());

// API route
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

// Auth Methods

// Create an account
router.post('/signup', auth_controller.sign_up);

// Log user into site
router.post('/login', auth_controller.log_in);

// Log user out of site
router.post('/logout', auth_controller.log_out);

// Get the names of every user on the site
router.get('/users', auth_controller.get_all_users);

// Get a user's basic info - first_name, last_name, _id
router.get('/users/:userID', auth_controller.get_basic_user_info)

// Update a users arrays
router.put('/users/:field', auth_controller.update_user);

// Make a friend request exchange
router.put('/users/:userID/friends/requests/:friendID', auth_controller.friend_request_exchange);

// Accept or Decline a friend request
router.put('/users/:userID/friends/requests/:friendID/:decision', auth_controller.decide_friend_request);

// Get a user's friend's list, populated with their name and id
router.get('/users/:userID/friends', auth_controller.get_friends_list);

// Get a user's inbound friend requests, populated with their name and id
router.get('/users/:userID/friends/inbound', auth_controller.get_inbound_friend_requests);

// Get a user's outbound friend requests, populated with their name and id
router.get('/users/:userID/friends/outbound', auth_controller.get_outbound_friend_requests);

// End Auth Methods

/* ##################################################################### */

// Status Posting Methods

// Create a status post
router.post('/posts', verifyToken, post_controller.create_status_post);

// Get all status posts
router.get('/posts', verifyToken, post_controller.get_all_posts);

// Get a user's posts
router.get('/posts/:userID', verifyToken, post_controller.get_users_posts);

// Get a user's friend's posts
router.get('/posts/friends/:userID', verifyToken, post_controller.get_friends_posts);

// Get a specific status post
router.get('/posts/:postID', verifyToken, post_controller.get_specific_post);

// Delete a status post
router.delete('/posts/:postID', verifyToken, post_controller.delete_status_post);

// Like or unlike a post
router.put('/posts/:postID/likes/:userID/:action', verifyToken, post_controller.like_unlike_post);

// TODO: Consider adding an update post PUT method

// End Status Posting Methods

/* ##################################################################### */

// Comment Posting Methods

// Create a comment
router.post('/posts/:postID/comments', verifyToken, comment_controller.create_comment);

// Get all comments on a post
router.get('/posts/:postID/comments', verifyToken, comment_controller.get_all_comments);

// Get a specific commment on a specific post
router.get('/posts/:postID/comments/:commentID', verifyToken, comment_controller.get_specific_comment);

// Delete a comment
router.delete('/posts/:postID/comments/:commentID', verifyToken, comment_controller.delete_comment);

// End Comment Posting Methods

// Functions

// FORMAT OF TOKEN - Authorization: Bearer <access_token>
// Verify token
function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403);
    }
};

module.exports = router;