// Styling
import "./UserIndexItem.css";

// Context
import { useState, useEffect, useContext } from "react";
import { CurrentUserContext } from "../../../context/CurrentUserContext";
import { Link } from "react-router-dom";
import $ from "jquery";

const UserIndexItem = ({ person }) => {
  // State Hooks
  const { token } = useContext(CurrentUserContext);

  // Lifecycle hooks
  useEffect(() => {
    // Get the current user's id from localStorage
    // const cUser = JSON.parse(localStorage.getItem('currentUser'));
    // const cUID = cUser._id;
  }, []);

  // Functions
  // Get a user's friends list
  const makeFriendRequest = async (personID) => {
    const cUser = JSON.parse(localStorage.getItem("currentUser"));
    const userID = cUser._id;
    // const bearerToken = 'Bearer ' + token;

    // Form the proper API uri
    const uri =
      process.env.REACT_APP_API_URL +
      "/users/" +
      userID +
      "/friends/requests/" +
      personID;

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
  const handleRequestButton = (e) => {
    // Prevent default button action
    e.preventDefault();

    // Get the decision and friendID from the element
    const personID = person._id;

    // Handle the friend request exchange
    makeFriendRequest(personID);

    e.target.textContent = "Requested";
    e.target.disabled = true;
  };

  return (
    <div className="user-index-item">
      <Link
        to={"/profile/" + person._id}
        style={{ textDecoration: "none", color: "initial" }}
      >
        <div className="user-index-friend">
          {/* Link to their own page when click on name */}
          <p>{person.first_name + " " + person.last_name}</p>
        </div>
      </Link>
      <div className="user-index-buttons">
        <button
          onClick={handleRequestButton}
          className="btn btn-secondary request-button"
        >
          Request
        </button>
      </div>
    </div>
  );
};

export default UserIndexItem;
