// Styling
import "./Header.css";

// Context
import { CurrentUserContext } from "../../context/CurrentUserContext.js";
import { useState, useEffect, useContext } from "react";

//
import { Link } from "react-router-dom";

const Header = () => {
  // State Hooks
  const { currentUser, logOut } = useContext(CurrentUserContext);

  return (
    <nav className="navbar navbar-expand-md fixed-top navbar-light header-container">
      <div className="container-fluid">
        <a className="navbar-brand logo-container" href="/home">
          <i class="fas fa-dog"></i>
          <span className="header-nav">Milo</span>
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {currentUser && (
          <div className="collapse navbar-collapse ms-auto" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link
                  to={"/profile/" + currentUser._id}
                  style={{ textDecoration: "none" }}
                >
                  <button className="btn account-button-container">
                    <i className="bi bi-person-circle header-profile-button"></i>
                    <span className="users-name">
                      {currentUser.first_name + " " + currentUser.last_name}
                    </span>
                  </button>
                </Link>
              </li>
              <li className="nav-item nav-friend-button">
                <Link to={"/friends"} style={{ textDecoration: "none" }}>
                  <button className="btn account-button-container">
                    <i className="bi bi-person-hearts header-profile-button"></i>
                    <span className="users-name">Friends</span>
                  </button>
                </Link>
              </li>
              <li className="nav-item log-out-button-container">
                <div className="account-button-container">
                  <button
                    onClick={logOut}
                    type="button"
                    className="btn btn-secondary log-out-button"
                  >
                    Log out
                  </button>
                </div>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
