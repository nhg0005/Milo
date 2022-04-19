// Context
import { useState, useContext } from "react";
import { CurrentUserContext } from "../../context/CurrentUserContext";

// Styling
import "./NewStatusBar.css";

import $ from "jquery";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const NewStatusBar = () => {
  // State Hooks
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState(null);
  const [imageURL, setImageURL] = useState("");
  const { token } = useContext(CurrentUserContext);

  // Functions
  const postNewStatus = async () => {
    const cUser = JSON.parse(localStorage.getItem("currentUser"));
    const userID = cUser._id;
    const bearerToken = "Bearer " + token;

    let payload;

    // If an image was uploaded
    if (imageURL) {
      // Create a payload
      payload = {
        username: userID,
        post_text: newPostText,
        image: imageURL,
      };
    } else {
      // Create a payload
      payload = {
        username: userID,
        post_text: newPostText,
      };
    }

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
    const uri = process.env.REACT_APP_API_URL + "/posts";

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
  };

  // Upload the image to Firebase Storage and get the URL to store in MongoDB
  const uploadImage = async () => {
    try {
      const cUser = JSON.parse(localStorage.getItem("currentUser"));
      const userID = cUser._id;

      if (newPostImage) {
        // Create the file path and upload the image
        const filePath = `${userID}/${newPostImage.name}`;
        const newImageRef = ref(getStorage(), filePath);
        const fileSnapshot = await uploadBytesResumable(
          newImageRef,
          newPostImage
        );

        // Get the public image url from Cloud Storage
        const publicImageUrl = await getDownloadURL(newImageRef);

        console.log(publicImageUrl);

        setImageURL((imageURL) => publicImageUrl);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Handlers
  // Call method for posting the status
  const handlePostButton = (e) => {
    // Prevent default button action
    e.preventDefault();

    $(".nsb-button")
      .html(
        '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>'
      )
      .attr("disabled", true);

    // Handle the post creation
    postNewStatus();

    setTimeout(() => {
      window.location.reload();
    }, 700);
  };

  // Set the image to state if one was uploaded
  const handleUploadButton = (e) => {
    // Prevent default button action
    e.preventDefault();

    $(".upload-button")
      .html(
        '<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>'
      )
      .attr("disabled", true);

    if (newPostImage === null) {
      alert("No image was selected.");
    } else {
      uploadImage();

      $(".image-button").attr("disabled", true);
    }
  };

  // Image input on change
  const handleUploadOnChange = (e) => {
    e.preventDefault();
    // Get the file selected by the user
    var imageFile = e.target.files[0];

    // Determine whether or not the file is an image
    if (!imageFile.type.match("image.*")) {
      // The file is not an image
      console.log("Not an image.");
    } else {
      // The file is an image
      console.log("Image selected.");
      // Save the image to state
      setNewPostImage((newPostImage) => imageFile);
    }
  };

  return (
    <div className="container-sm nsb-container">
      {/* New Status input */}
      <div className="input-group mb-3 shadow-sm p-1 bg-body rounded">
        <input
          onChange={(e) => setNewPostText(e.target.value)}
          type="text"
          className="form-control"
          placeholder="Post a new status"
          aria-label="New status"
          aria-describedby="basic-addon1"
        />
        <button
          data-bs-toggle="modal"
          data-bs-target="#imageModal"
          className="btn btn-secondary image-button"
          type="button"
          id="inputGroupFileAddon03"
        >
          <i className="bi bi-image-alt"></i>
        </button>
        <button
          onClick={handlePostButton}
          className="btn btn-primary nsb-button"
          type="button"
          id="inputGroupFileAddon03"
        >
          Post
        </button>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="imageModal"
        tabIndex="-1"
        aria-labelledby="imageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h6 className="modal-title" id="signUpModalLabel">
                Upload an image
              </h6>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="input-group mb-3">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  id="inputGroupFile02"
                  onChange={handleUploadOnChange}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadButton}
                type="button"
                className="btn btn-success upload-button"
                data-bs-dismiss="modal"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewStatusBar;
