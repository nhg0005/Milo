// Controller: Auth, /controllers/authController.js

const Auth = require('../models/authModel');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Sign up
exports.sign_up = (req, res, next) => {
    // Hash the password
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        // If there's an error, return it
        if (err) return next(err);

        // Otherwise, grab the password
        const password = hashedPassword;

        // Upon submit, create a new user object from the Auth Model for the database
        const user = new Auth({
            username: req.body.username.toLowerCase(),
            password: password,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
        }).save(err => {
            // If there's an error while saving
            if (err) {
                return next(err);
            }

            // Otherwise
            res.send("User successfully created.");
        });
    });
};

// Log in
exports.log_in = (req, res, next) => {
    // Authenticate using passport
    passport.authenticate('local', { session: false }, (err, user, info) => {
        // If there's an error or no user is found
        if (err || !user) {
            return res.status(400).json({
                message: "An error has occured",
                user: user
            });
        }

        // Otherwise
        req.login(user, { session: false }, (err) => {
            // If there's an error
            if (err) {
                res.send(err);
            }

            // Otherwise, generate a JSON webtoken with the contents of the user(auth) object
            // and return it in the response
            jwt.sign({ user }, 'secretKey', { expiresIn: '2h' }, (err, token) => {  // Secret key can be whatever
                res.json({
                    token,
                    user
                })
            });
        })
    })(req, res);

};

// Update any single user field
exports.update_user = (req, res, next) => {
    const userID = req.body.userID;
    const field = req.params.field;
    const value = req.body.value;

    // Update the posts array field
    if (field == "posts") {
        Auth.findByIdAndUpdate({ _id: userID }, { "$push": { "posts": value } }, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.json({
                    message: "User updated successfully.",
                    result
                });
            }
        });
    } else if (field == 'cover_image') {
        Auth.findByIdAndUpdate({ _id: userID }, { 'cover_image': value }, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.json({
                    message: "User updated successfully.",
                    result
                });
            }
        });
    } else if (field == 'profile_picture') {
        Auth.findByIdAndUpdate({ _id: userID }, { 'profile_picture': value }, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.json({
                    message: "User updated successfully.",
                    result
                });
            }
        });
    } else {
        res.json({ message: "Error: Key does not match any fields in the database." });
    }

};

// Perform a friend requst exchange
// User is added to Friends inbound_friend_requests array
// Friend is added to Users outbound_friend_requests array
exports.friend_request_exchange = (req, res, next) => {
    const userID = req.params.userID;
    const friendID = req.params.friendID;

    // Add the user to the potential friend's inbound_friend_requests 
    Auth.findByIdAndUpdate({ _id: friendID }, { "$push": { "inbound_friend_requests": userID } }, (err, result) => {
            if (err) {
                res.send(err);
            } else {

            }
        })

    // Add the potential friend to the user's outbound_friend_requests
    Auth.findByIdAndUpdate({ _id: userID }, { "$push": { "outbound_friend_requests": friendID } }, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                res.json({message: "Success"})
            }
        })
};

// Make a decision on a friend request. Handles accepting and declining
exports.decide_friend_request = (req, res, next) => {
    const userID = req.params.userID;
    const friendID = req.params.friendID;
    const decision = req.params.decision;

    // Remove the friend from the user's outbound requests
    Auth.findByIdAndUpdate({ _id: friendID }, { "$pull": { "outbound_friend_requests": userID } }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
        }
    })
    
    // Remove the user from the friend's inbound requests
    Auth.findByIdAndUpdate({ _id: userID }, { "$pull": { "inbound_friend_requests": friendID } }, (err, result) => {
        if (err) {
            res.send(err);
        } else {
            // res.json({message: "Success"})
        }
    })

    if (decision == 'accept') {
        // Add user to friend's friend's list
        Auth.findByIdAndUpdate({ _id: friendID }, { "$push": { "friends_list": userID } }, (err, result) => {
            if (err) {
                res.send(err);
            } else {

            }
        })


        // Add friend to user's friend's list
        Auth.findByIdAndUpdate({ _id: userID }, { "$push": { "friends_list": friendID } }, (err, result) => {
            if (err) {
                res.send(err);
            } else {
                return res.json({ message: "Accept successful." })
            }
        })
    } else if (decision == 'decline') {
        return res.json({message: "Decline successful."})
    }

};

// Log out
exports.log_out = (req, res, next) => {

};

// Get user's friend's list
exports.get_friends_list = async (req, res, next) => {
    try {
        const friendsListObj = await Auth.findById(req.params.userID)
            .select('friends_list')
            .populate('friends_list', 'first_name last_name _id profile_picture')
            .exec();
    
        // Grab the array from the object
        const friendsListArr = friendsListObj['friends_list'];

        return res.json(friendsListArr);
    } catch (err) {
        return res.json(err);
    }
};

// Get user's inbound friend_requests
exports.get_inbound_friend_requests = async (req, res, next) => {
    try {
        const inboundRequestsObj = await Auth.findById(req.params.userID)
            .select('inbound_friend_requests')
            .populate('inbound_friend_requests', 'first_name last_name _id profile_picture')
    
        // Grab the array from the object
        const inboundRequestsArr = inboundRequestsObj['inbound_friend_requests'];

        return res.json(inboundRequestsArr);
    } catch (err) {
        return res.json(err);
    }
};

// Get user's outbound friend_requests
exports.get_outbound_friend_requests = async (req, res, next) => {
    try {
        const outboundRequestsObj = await Auth.findById(req.params.userID)
            .select('outbound_friend_requests')
            .populate('outbound_friend_requests', 'first_name last_name _id')
    
        // Grab the array from the object
        const outboundRequestsArr = outboundRequestsObj['outbound_friend_requests'];

        return res.json(outboundRequestsArr);
    } catch (err) {
        return res.json(err);
    }
};

// Get a user's basic info
exports.get_basic_user_info = (req, res, next) => {
    const userID = req.params.userID;

    Auth.findById(userID)
        .select('first_name last_name _id cover_image profile_picture')
        .exec((err, result) => {
            if (err) return next(err);

            res.json(result)
        });
};

// Get a list of all of the user's on the site
exports.get_all_users = (req, res, next) => {
    Auth.find()
        .select('first_name last_name _id')
        .exec((err, result) => {
                if (err) return next(err);

                res.json(result)
        });
    
};