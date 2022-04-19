// Context
import { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../../../context/CurrentUserContext";
import { Link } from "react-router-dom";

// Styling
import "./FriendRequestItem.css";

const FriendRequestItem = ({ friend }) => {
  // State Hooks
  const { token } = useContext(CurrentUserContext);

  // Lifecycle hooks
  useEffect(() => {
    // Get the current user's id from localStorage
  }, []);

  // Functions
  // Get a user's friends list
  const decideFriendRequest = async (friendID, decision) => {
    const cUser = JSON.parse(localStorage.getItem("currentUser"));
    const userID = cUser._id;
    const bearerToken = "Bearer " + token;

    // Form the proper API uri
    const uri =
      process.env.REACT_APP_API_URL +
      "/users/" +
      userID +
      "/friends/requests/" +
      friendID +
      "/" +
      decision;

    // Perform a fetch POST request to get the login token
    const response = await fetch(uri, {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", //,
        // 'Authorization': bearerToken
      },
    });

    // Convert the data to json
    const data = await response.json();

    if (data) console.log(data);

    return data;
  };

  // Handlers
  const handleDecisionButton = (e) => {
    // Prevent default button action
    e.preventDefault();

    // Get the decision and friendID from the element
    const decision = e.target.textContent.toLowerCase();
    const friendID = friend._id;

    e.target.innerHTML =
      '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>';
    e.target.disabled = true;

    // Handle the post creation
    decideFriendRequest(friendID, decision);

    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  return (
    <div className="friend-request-item">
      <Link
        to={"/profile/" + friend._id}
        style={{ textDecoration: "none", color: "initial" }}
      >
        <div className="fr-friend">
          {friend.profile_picture && (
            <img
              className="fr-profile-picture"
              src={friend.profile_picture}
              alt=""
            />
          )}
          <p>{friend.first_name + " " + friend.last_name}</p>
        </div>
      </Link>
      <div className="fr-buttons">
        <button
          onClick={handleDecisionButton}
          className="btn btn-primary accept-button"
        >
          Accept
        </button>
        <button
          onClick={handleDecisionButton}
          className="btn btn-danger decline-button"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default FriendRequestItem;
