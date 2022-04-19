// Styling
import "./PostItem.css";

// Components
import CommentItem from "../Comments/CommentItem";

// Context
import { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext.js";
import { Link } from "react-router-dom";
import $ from "jquery";

const PostItem = ({ post }) => {
  // State Hooks
  const [commentItems, setCommentItems] = useState();
  const [newComment, setNewComment] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const { token } = useContext(CurrentUserContext);
  const { currentUser } = useContext(CurrentUserContext);

  // Lifecycle hooks
  useEffect(() => {
    // Get the current user's id from localStorage
    const cUser = JSON.parse(localStorage.getItem("currentUser"));
    const cUID = cUser._id;

    // If the post has likes, assign the number to state so it can be updated dynamically
    if (post.likes.length !== 0) {
      setLikeCount(post.likes.length);
    }

    // Extract comments here
    if (post.comments.length !== 0) {
      const commentItems = post.comments
        .sort((a, b) =>
          a.timestamp > b.timestamp ? 1 : b.timestamp > a.timestamp ? -1 : 0
        )
        .map((comment) => <CommentItem comment={comment} key={comment._id} />);
      setCommentItems(commentItems);
    }
  }, []);

  // Functions
  const postNewComment = async () => {
    const cUser = JSON.parse(localStorage.getItem("currentUser"));
    const userID = cUser._id;
    const bearerToken = "Bearer " + token;
    const postID = post.id;

    // Create a payload
    let payload = {
      username: userID,
      comment_text: newComment,
      post: post.id,
    };

    let formContents = [];

    // Go through and encode the payload and add to formContents
    for (let field in payload) {
      let encodedKey = encodeURIComponent(field);

      let encodedValue = encodeURIComponent(payload[field]);
      formContents.push(encodedKey + "=" + encodedValue);
    }

    // Join the form contents to make it url readable
    formContents = formContents.join("&");

    // Form the proper API uri
    const uri =
      process.env.REACT_APP_API_URL + "/posts/" + postID + "/comments";

    // Perform a fetch POST request to get the login token
    const response = await fetch(uri, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Authorization: bearerToken,
      },
      body: formContents,
    });

    // Convert the data to json
    const data = await response.json();

    return data;
  };

  const likeOrUnlikePost = async (action) => {
    // Get the current user's ID and token
    const cUser = JSON.parse(localStorage.getItem("currentUser"));
    const userID = cUser._id;
    const bearerToken = "Bearer " + token;

    // Get the ID of the current post
    const postID = post.id;

    // Form the proper API uri
    const uri =
      process.env.REACT_APP_API_URL +
      "/posts/" +
      postID +
      "/likes/" +
      userID +
      "/" +
      action;

    // Perform a fetch POST request to get the login token
    const response = await fetch(uri, {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Authorization: bearerToken,
      },
    });

    // Convert the data to json
    const data = await response.json();

    return data;
  };

  // Handlers
  const handleCommentButton = (e) => {
    // Prevent default button action
    e.preventDefault();

    $(".comment-button")
      .html(
        '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>'
      )
      .attr("disabled", true);

    // Handle the post creation
    postNewComment();

    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  const handleLikeButton = (e) => {
    // Prevent default behavior
    e.preventDefault();

    let action;

    // Handle button filling and action decision
    // If the button is not filled, aka not liked
    if (e.target.classList.contains("bi-hand-thumbs-up")) {
      e.target.classList.remove("bi-hand-thumbs-up");
      e.target.classList.add("bi-hand-thumbs-up-fill");
      action = "like";
      setLikeCount(likeCount + 1);
    } else if (e.target.classList.contains("bi-hand-thumbs-up-fill")) {
      // else, un-fill it, aka unlike the post
      e.target.classList.remove("bi-hand-thumbs-up-fill");
      e.target.classList.add("bi-hand-thumbs-up");
      action = "unlike";
      setLikeCount(likeCount - 1);
    }

    // Handle like in db
    likeOrUnlikePost(action);
  };

  return (
    // Container
    <div className="card card-container">
      {/* Card Header */}
      <div className="card-header card-background post-header">
        {post.pfp && (
          <img className="post-profile-picture" src={post.pfp} alt="" />
        )}
        <Link
          to={"/profile/" + post.usernameID}
          style={{ textDecoration: "none", color: "initial" }}
        >
          <div>
            <p className="post-user-name">{post.fullName}</p>
            <p className="post-timestamp">{post.timestamp}</p>
          </div>
        </Link>
      </div>

      {/* Card Body */}
      <div className="card-body">
        <p className="card-text">{post.text}</p>

        {/* In-line if conditional render based on presence of an image in post */}
        {post.image && (
          <img
            src={post.image}
            alt={"An image posted by " + post.fullName}
            className="post-image"
          />
        )}
      </div>

      {/* Card Footer */}
      <div className="card-footer card-background footer-buttons">
        {/* Like button */}
        {/* Todo: Make this fill when user has liked something */}

        {!post.likes.includes(currentUser._id) ? (
          <button onClick={handleLikeButton} className="btn">
            <i className="bi bi-hand-thumbs-up like-button"></i>
          </button>
        ) : (
          <button onClick={handleLikeButton} className="btn">
            <i className="bi bi-hand-thumbs-up-fill like-button"></i>
          </button>
        )}
      </div>

      {/* Post footer */}
      <div className="card-footer card-background interaction-footer">
        {/* Like Count */}
        {likeCount !== 0 && (
          <p className="post-like-count">
            {likeCount} {likeCount === 1 ? "like" : "likes"}{" "}
          </p>
        )}

        {/* Comment Section */}
        <div className="comments-section">
          {/* New Comment input */}
          <div className="input-group input-group-sm mb-1 p-1 rounded">
            <input
              onChange={(e) => setNewComment(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Post a new comment"
              aria-label="New comment"
              aria-describedby="basic-addon1"
            />
            <button
              onClick={handleCommentButton}
              className="btn btn-primary comment-button"
              type="button"
              id="inputGroupFileAddon03"
            >
              Comment
            </button>
          </div>

          {
            /* Comments IF they exist */
            post.comments.length !== 0 && (
              <div className="comments">{commentItems}</div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default PostItem;
