import { useContext, useState, useEffect } from "react";
import $ from "jquery";

// Styling
import "./App.css";

// Context
import { CurrentUserContext } from "./context/CurrentUserContext";

// Components
import Header from "./components/Header/Header";

const App = () => {
  // State Hooks

  const [fields, setFields] = useState({});
  const [errors, setErrors] = useState({});

  const { logIn, signUp } = useContext(CurrentUserContext);

  // Lifecycle Hooks

  // Authentication

  // Functions
  const checkLogInValidity = () => {
    let isInputValid = true;
    let errors = {};

    // Check username
    // If empty
    if (!fields["Username"]) {
      isInputValid = false;
      errors["Username"] = "cannot be empty";
    }
    // If not empty
    if (typeof fields["Username"] !== "undefined") {
      // If it matches regex
      if (!fields["Username"].match(/^[a-zA-Z0-9_]*$/)) {
        isInputValid = false;
        errors["Username"] = "cannot contain spaces";
      }
    }

    // Check password
    // If empty
    if (!fields["Password"]) {
      isInputValid = false;
      errors["Password"] = "cannot be empty";
    }

    // Set errors to state
    setErrors(errors);

    // Create an error alert
    if (JSON.stringify(errors) !== "{}") {
      let errorAlertText = "";
      for (const prop in errors) {
        errorAlertText += `${prop} is not valid: ${errors[prop]}\n`;
      }
      alert(errorAlertText);
    }

    // Return validity
    return isInputValid;
  };

  const checkSignUpValidity = () => {
    let isInputValid = true;
    let errors = {};

    // Check first name
    // If empty
    if (!fields["First name"]) {
      isInputValid = false;
      errors["First name"] = "cannot be empty";
    }
    // If it matches regex
    if (typeof fields["First name"] !== "undefined") {
      if (!fields["First name"].match(/^[a-zA-Z]+$/)) {
        isInputValid = false;
        errors["First name"] = "cannot contain numbers";
      }
    }

    // Check last name
    // If empty
    if (!fields["Last name"]) {
      isInputValid = false;
      errors["Last name"] = "cannot be empty";
    }
    // If it matches regex
    if (typeof fields["Last name"] !== "undefined") {
      if (!fields["Last name"].match(/^[a-zA-Z]+$/)) {
        isInputValid = false;
        errors["Last name"] = "cannot contain numbers";
      }
    }

    // Check new username
    // If empty
    if (!fields["New username"]) {
      isInputValid = false;
      errors["New username"] = "cannot be empty";
    }
    // If not empty
    if (typeof fields["New username"] !== "undefined") {
      // If it matches regex
      if (!fields["New username"].match(/^[a-zA-Z0-9_]*$/)) {
        isInputValid = false;
        errors["New username"] = "cannot contain spaces";
      }
    }

    // Check new password
    // If empty
    if (!fields["New password"]) {
      isInputValid = false;
      errors["New password"] = "cannot be empty";
    }

    // Set errors to state
    setErrors(errors);

    // Create an error alert
    if (JSON.stringify(errors) !== "{}") {
      let errorAlertText = "";
      for (const prop in errors) {
        errorAlertText += `${prop} is not valid: ${errors[prop]}\n`;
      }
      alert(errorAlertText);
    }

    // Return validity
    return isInputValid;
  };

  // Handlers
  // Log In button handler
  const handleLogIn = (e) => {
    // Prevent default button action
    e.preventDefault();

    // Check validity
    if (checkLogInValidity()) {
      $("#logInButton")
        .html(
          '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Logging in...'
        )
        .attr("disabled", true);

      // Handle the log in
      logIn(fields["Username"], fields["Password"]);
    }
  };

  // Sign up button handler
  const handleSignUpButton = (e) => {
    // Prevent default button action
    e.preventDefault();

    // Check validity
    if (checkSignUpValidity()) {
      $("#signUpModalButton")
        .html(
          '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>'
        )
        .attr("disabled", true);

      // Handle the sign up
      signUp(
        fields["New username"],
        fields["New password"],
        fields["First name"],
        fields["Last name"]
      );

      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    }
  };

  // Guest account handler
  const handleGuest = (e) => {
    // Prevent default button action
    e.preventDefault();

    // Animate and disable the button
    $(".guest-button")
      .html(
        '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Logging in...'
      )
      .attr("disabled", true);

    // Handle the log in
    logIn("foobar", "foobar");
  };

  // Input handler
  const inputOnChange = (e) => {
    // Deconstruct the targeted element
    const { name, value } = e.target;
    // Add input's name and value
    setFields({ ...fields, [name]: value });
  };

  return (
    <div className="App">
      <Header />

      <div className="container-sm initial-page-body">
        <div className="hero-container">
          <h3>Milo</h3>
          <p>
            Welcome to Milo. Connect with fellow dog owners all around the
            world.
          </p>
        </div>

        <div className="auth-container">
          <div className="input-group mb-3">
            <input
              name="Username"
              onChange={inputOnChange}
              type="text"
              className="form-control"
              placeholder="Username"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="input-group mb-3">
            <input
              name="Password"
              onChange={inputOnChange}
              type="password"
              className="form-control"
              placeholder="Password"
              aria-label="Password"
              aria-describedby="basic-addon1"
            />
          </div>

          <div className="auth-button-group">
            <button
              onClick={handleLogIn}
              type="button"
              className="btn btn-success"
              id="logInButton"
            >
              Log In
            </button>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#signUpModal"
            >
              Sign Up
            </button>
            <button
              onClick={handleGuest}
              type="button"
              className="btn btn-dark guest-button"
            >
              Browse with a guest account
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="signUpModal"
        tabIndex="-1"
        aria-labelledby="signUpModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="signUpModalLabel">
                Sign up
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p> Sign up for an account here.</p>

              <div className="input-group mb-3">
                <input
                  name="First name"
                  onChange={inputOnChange}
                  type="text"
                  className="form-control"
                  placeholder="First name"
                  aria-label="First name"
                  aria-describedby="basic-addon1"
                />
              </div>

              <div className="input-group mb-3">
                <input
                  name="Last name"
                  onChange={inputOnChange}
                  type="text"
                  className="form-control"
                  placeholder="Last name"
                  aria-label="Last name"
                  aria-describedby="basic-addon1"
                />
              </div>

              <div className="input-group mb-3">
                <input
                  name="New username"
                  onChange={inputOnChange}
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  aria-label="Username"
                  aria-describedby="basic-addon1"
                />
              </div>

              <div className="input-group mb-3">
                <input
                  name="New password"
                  onChange={inputOnChange}
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  aria-label="Password"
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-danger"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                id="signUpModalButton"
                onClick={handleSignUpButton}
                type="button"
                className="btn btn-primary"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
