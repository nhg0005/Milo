import React, { createContext, useState, useEffect } from "react";

export const CurrentUserContext = createContext(null);

const CurrentUserProvider = ({ children }) => {
  // State Hooks for Global Access
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);

  // Lifecycle hook for updating states
  useEffect(() => {
    // Grab the current user from localStorage
    const curUser = JSON.parse(localStorage.getItem("currentUser"));

    // Grab the token from localStorage
    const curToken = localStorage.getItem("token");

    // If there is none, return
    if (!curUser) return;
    if (!curToken) return;

    // Otherwise, set the currentUser state to the user in localStorage
    setCurrentUser(curUser);
    setToken(curToken);
  }, []);

  // Global functions
  // Sign the user in and set their data and token to state and localStorage
  const logIn = async (username, password) => {
    // Create a payload
    let payload = {
      username: username,
      password: password,
    };

    let formContents = [];

    // Go through and encode the payload and add to formContents
    for (let field in payload) {
      // console.log(field)
      let encodedKey = encodeURIComponent(field);
      // console.log(payload[field]);
      let encodedValue = encodeURIComponent(payload[field]);
      formContents.push(encodedKey + "=" + encodedValue);
    }

    // Join the form contents to make it url readable
    formContents = formContents.join("&");

    // Form the proper API uri
    const uri = process.env.REACT_APP_API_URL + "/login";

    // Perform a fetch POST request to get the login token
    const response = await fetch(uri, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formContents,
    });

    // Convert the data to json
    const data = await response.json();

    // If there's an error message present
    if (data["message"]) {
      alert(
        data["message"] +
          ".\nUsername or passsword is not valid.\nRefresh the page and try again."
      );
    } else {
      // Upon successful login
      // Store the data in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      // Store the data in Context
      setCurrentUser(data.user);

      // Send the user to the home page
      setTimeout(() => {
        window.location.href = "/home";
      }, 500);
    }
  };

  // Sign the user in and set their data and token to state and localStorage
  const signUp = async (username, password, first_name, last_name) => {
    // Create a payload
    let payload = {
      username: username,
      password: password,
      first_name: first_name,
      last_name: last_name,
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
    const uri = process.env.REACT_APP_API_URL + "/signup";

    // Perform a fetch POST request to get the login token
    const response = await fetch(uri, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formContents,
    });

    // Convert the data to json
    const data = await response.json();
  };

  // Update the User in the DB
  const updateUser = async (userID, field, value) => {
    // Create a payload
    let payload = {
      userID: userID,
      value: value,
    };

    let formContents = [];

    // Go through and encode the payload and add to formContents
    for (let key in payload) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(payload[key]);
      formContents.push(encodedKey + "=" + encodedValue);
    }

    // Join the form contents to make it url readable
    formContents = formContents.join("&");

    // Form the proper API uri
    const uri = process.env.REACT_APP_API_URL + "/users/" + field;

    // Perform a fetch POST request to get the login token
    const response = await fetch(uri, {
      mode: "cors",
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formContents,
    });

    // Convert the data to json
    const data = await response.json();

    if (data) console.log(data);
  };

  // Get a user's friends list
  const getFriendsList = async (userID) => {
    // Form the proper API uri
    const uri = process.env.REACT_APP_API_URL + "/users/" + userID + "/friends";

    // Perform a fetch POST request to get the login token
    const response = await fetch(uri, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });

    // Convert the data to json
    const data = await response.json();

    // if (data) console.log(data);

    return data;
  };

  // Get a user's inbound friend requests
  const getInboundFriendRequests = async (userID) => {
    // Form the proper API uri
    const uri =
      process.env.REACT_APP_API_URL + "/users/" + userID + "/friends/inbound";

    // Perform a fetch POST request to get the login token
    const response = await fetch(uri, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });

    // Convert the data to json
    const data = await response.json();

    // if (data) console.log(data);

    return data;
  };

  // Get a user's outbound friend requests
  const getOutboundFriendRequests = async (userID) => {
    // Form the proper API uri
    const uri =
      process.env.REACT_APP_API_URL + "/users/" + userID + "/friends/outbound";

    // Perform a fetch POST request to get the login token
    const response = await fetch(uri, {
      mode: "cors",
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });

    // Convert the data to json
    const data = await response.json();

    // if (data) console.log(data);

    return data;
  };

  // Log user out by clearing localStorage, setting currentUser to null, and redirecting to '/'
  const logOut = () => {
    localStorage.clear();
    setCurrentUser(null);
    window.location.href = "/";
  };

  // Get a user's posts
  const getUsersPosts = async (userID) => {
    const bearerToken = "Bearer " + token;

    // Form the proper API uri
    const uri = process.env.REACT_APP_API_URL + "/posts/" + userID;

    // Perform a fetch POST request to get the login token
    const response = await fetch(uri, {
      mode: "cors",
      method: "get",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Authorization: bearerToken,
      },
    });

    // Convert the data to json
    const data = await response.json();

    // if (data) console.log(data['posts']);

    return data["posts"];
  };

  // Get a user's friend's posts
  const getUsersFriendsPosts = async (userID) => {
    // Get the current user's ID
    const bearerToken = "Bearer " + token;

    // Form the proper API uri
    const uri = process.env.REACT_APP_API_URL + "/posts/friends/" + userID;

    // Perform a fetch POST request to get the login token
    const response = await fetch(uri, {
      mode: "cors",
      method: "get",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Authorization: bearerToken,
      },
    });

    // Convert the data to json
    const data = await response.json();

    // if (data) console.log(data);

    return data;
  };

  // Get a user's basic infomation - first, last name, _id
  const getBasicUserInfo = async (userID) => {
    // Form the proper API uri
    const uri = process.env.REACT_APP_API_URL + "/users/" + userID;

    // Perform a fetch POST request to get the login token
    const response = await fetch(uri, {
      mode: "cors",
      method: "get",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });

    // Convert the data to json
    const data = await response.json();

    // if (data) console.log(data);

    return data;
  };

  // Get a list of all users with basic infomation - first, last name, _id
  const getAllUsersList = async () => {
    // Form the proper API uri
    const uri = process.env.REACT_APP_API_URL + "/users";

    // Perform a fetch POST request to get the login token
    const response = await fetch(uri, {
      mode: "cors",
      method: "get",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
    });

    // Convert the data to json
    const data = await response.json();

    // if (data) console.log(data);

    return data;
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        token,
        logIn,
        signUp,
        updateUser,
        getFriendsList,
        getInboundFriendRequests,
        getOutboundFriendRequests,
        logOut,
        getUsersPosts,
        getUsersFriendsPosts,
        getBasicUserInfo,
        getAllUsersList,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;
