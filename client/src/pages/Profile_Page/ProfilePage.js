// Styling
import './ProfilePage.css';

// Components
import Header from '../../components/Header/Header';
import ProfileCover from '../../components/Profile_Cover/ProfileCover.js';
import FriendsListTiled from '../../components/Friends_List/Tiled/FriendsListTiled.js';
import FriendsListContainer from '../../components/Friends_List/Regular/FriendsListContainer.js';
import PostContainer from '../../components/Posts/PostContainer';

// Context
import { useContext, useState, useEffect } from 'react';
import { CurrentUserContext } from '../../context/CurrentUserContext';
import { useParams } from 'react-router-dom';

import $ from 'jquery';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const ProfilePage = () => {

    // State Hooks
    const [profilePagePosts, setProfilePagePosts] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [fullName, setFullName] = useState('');
    const [isFriends, setIsFriends] = useState(false);
    const [coverImage, setCoverImage] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    const [newCoverImage, setNewCoverImage] = useState(null);
    const [newCoverImageURL, setNewCoverImageURL] = useState(null);

    const [newProfilePicture, setNewProfilePicture] = useState(null);
    const [newProfilePictureURL, setNewProfilePictureURL] = useState(null);

    // Pull userID from React-Router-Dom Link params
    const { userID } = useParams();
    
    // Deconstructed from context
    const { currentUser, token, getUsersPosts, getFriendsList, getBasicUserInfo, updateUser } = useContext(CurrentUserContext);
    
    // Lifecycle Hooks
    useEffect(() => {
        // Get the current user's id from localStorage
        const cUser = JSON.parse(localStorage.getItem('currentUser'));
        if (cUser) {
            const cUID = cUser._id;
            
            
            // Get the owner's info and posts
            (async () => {
                // Grab the full name of the owner of the profile

                const basicInfo = await getBasicUserInfo(userID);
                setFullName(basicInfo.first_name + ' ' + basicInfo.last_name);
                setCoverImage(basicInfo.cover_image);
                setProfilePicture(basicInfo.profile_picture);

                const uPosts = await getUsersPosts(userID);
                uPosts.forEach((post) => {
                    const id = post._id;
                    const fullName = post.username.first_name + ' ' + post.username.last_name;
                    
                    const utcDateString = post.date;
                    const timestamp = new Date(post.date).toLocaleString([], { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        
                    const text = post.text;
        
                    const comments = post.comments;
        
                    const likes = post.likes;

                    const pfp = basicInfo.profile_picture;

                    if (post.image) {
                        const image = post.image;
                        // Add to homePagePosts state
                        setProfilePagePosts(profilePagePosts => profilePagePosts.concat([{ id, fullName, pfp, utcDateString, timestamp, text, comments, likes, image }]));
                    } else {
                        // Add to homePagePosts state
                        setProfilePagePosts(profilePagePosts => profilePagePosts.concat([{ id, fullName, pfp, utcDateString, timestamp, text, comments, likes }]));
                    }
        
                });
            })();
    
    
            // Get the owner's friends list and assign the array to friendsList
            (async () => {
                const list = await getFriendsList(userID);
                setFriendsList(friendsList => friendsList.concat(list));
                // Check to see if the owner of the page is a friend of the current user
                // First make sure the owner of the page isn't the current user
                const currentUsersFL = await getFriendsList(cUID);
                if (cUID !== userID) {
                    // Filter through the current user's friends list to see if the owner is present
                    let friendCheck = currentUsersFL.filter((friend) => {
                        return friend._id === userID;
                    });
                    // If the owner was present, setIsFriends to true
                    if (friendCheck.length !== 0) setIsFriends(true);
                } else {
                    // Since the owner is the current user, simply setIsFriends to true
                    setIsFriends(true);
                }
            })();
        }

    }, []);

    // Functions
    // Upload the image to Firebase Storage and get the URL to store in MongoDB
    const uploadCoverImage = async () => {
        try {
            //////////////// Upload the image ////////////////
            const cUser = JSON.parse(localStorage.getItem('currentUser'));
            const userID = cUser._id;

            if (newCoverImage) {
                // Create the file path and upload the image
                const filePath = `${userID}/${newCoverImage.name}`;
                const newImageRef = ref(getStorage(), filePath);
                const fileSnapshot = await uploadBytesResumable(newImageRef, newCoverImage);

                // Get the public image url from Cloud Storage
                const publicImageUrl = await getDownloadURL(newImageRef);

                console.log(publicImageUrl);

                setNewCoverImageURL(newCoverImageURL => publicImageUrl);

                /////////////// Update the user ////////////////
                await updateUser(userID, 'cover_image', publicImageUrl);
        
            }


        } catch (error) {
            console.log(error);
        } finally {
            window.location.reload();
        }
    }

        // Upload the image to Firebase Storage and get the URL to store in MongoDB
    const uploadProfilePicture = async () => {
        try {
            //////////////// Upload the image ////////////////
            const cUser = JSON.parse(localStorage.getItem('currentUser'));
            const userID = cUser._id;

            if (newProfilePicture) {
                // Create the file path and upload the image
                const filePath = `${userID}/${newProfilePicture.name}`;
                const newImageRef = ref(getStorage(), filePath);
                const fileSnapshot = await uploadBytesResumable(newImageRef, newProfilePicture);

                // Get the public image url from Cloud Storage
                const publicImageUrl = await getDownloadURL(newImageRef);

                console.log(publicImageUrl);

                setNewProfilePictureURL(newProfilePictureURL => publicImageUrl);

                /////////////// Update the user ////////////////
                await updateUser(userID, 'profile_picture', publicImageUrl);
        
            }


        } catch (error) {
            console.log(error);
        } finally {
            window.location.reload();
        }
    }
    
    
    // Handlers
    // Set the image to state if one was uploaded
    const handleCoverUploadButton = (e) => {
        // Prevent default button action
        e.preventDefault();

        $('.upload-button').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>').attr('disabled', true);

        if (newCoverImage === null) {
            alert("No image was selected.")
        } else {
            // setNewPostImage($('#inputGroupFile02').prop('files')[0]);
            $('.change-cover-button').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Loading...').attr('disabled', true);
            uploadCoverImage();
        }
    }

    // Image input on change
    const handleCoverUploadOnChange = (e) => {
        e.preventDefault();
        // Get the file selected by the user
        let imageFile = e.target.files[0];

        // Determine whether or not the file is an image
        if (!imageFile.type.match('image.*')) { // The file is not an image
            console.log("Not an image.")
        } else {    // The file is an image
            console.log("Image selected.");
            // Save the image to state
            setNewCoverImage(newCoverImage => imageFile);
        }
    }

    // Set the image to state if one was uploaded
    const handleProfilePictureUploadButton = (e) => {
        // Prevent default button action
        e.preventDefault();

        $('.upload-button').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>').attr('disabled', true);

        if (newProfilePicture === null) {
            alert("No image was selected.");
        } else {
            $('.change-picture-button').html('<span class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>Loading...').attr('disabled', true);
            uploadProfilePicture();
        }
    }

    // Profile Picture input on change
    const handleProfilePictureUploadOnChange = (e) => {
        e.preventDefault();
        // Get the file selected by the user
        let imageFile = e.target.files[0];

        // Determine whether or not the file is an image
        if (!imageFile.type.match('image.*')) { // The file is not an image
            console.log("Not an image.")
        } else {    // The file is an image
            console.log("Image selected.");
            // Save the image to state
            setNewProfilePicture(newProfilePicture => imageFile);
        }

    }
    
    // If the user is logged in, render the page.
    if (currentUser) {
        return (
          <div className="profile-page">
            <Header />

            <div className="container profile-body">
              {/* Cover */}
              <div className="profile-page-cover">
                <ProfileCover
                  profilePicture={profilePicture}
                  coverImage={coverImage}
                  fullName={fullName}
                />
              </div>

              <div className="row justify-content-center under-cover">

                <div className="col-3 f-l-t">
                  {userID === currentUser._id && (
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#coverImageModal"
                      type="button"
                      className="btn btn-secondary mb-3 change-cover-button"
                    >
                      Change cover image
                    </button>
                  )}
                  {userID === currentUser._id && (
                    <button
                      data-bs-toggle="modal"
                      data-bs-target="#pfpModal"
                      type="button"
                      className="btn btn-secondary mb-3 change-picture-button"
                    >
                      Change profile picture
                    </button>
                  )}
                  <h6>Friends</h6>
                  <FriendsListContainer friendsList={friendsList} />
                </div>

                {/* If the current user is friends with the profile owner */}
                {isFriends ? (
                  <div className="col-6 profile-posts">
                    {userID === currentUser._id && (
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#coverImageModal"
                        type="button"
                        className="btn btn-secondary mb-3 change-cover-button cover-button-mobile"
                      >
                        Change cover image
                      </button>
                    )}
                    {userID === currentUser._id && (
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#pfpModal"
                        type="button"
                        className="btn btn-secondary mb-3 change-picture-button pfp-button-mobile"
                      >
                        Change profile picture
                      </button>
                    )}
                    <PostContainer posts={profilePagePosts} />
                  </div>
                ) : (
                  <div className="col-6">
                    <p>
                      In order to see this user's posts, send them a friend
                      request from the User Index on the Friends page.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Change Modal */}
            <div
              className="modal fade"
              id="coverImageModal"
              tabIndex="-1"
              aria-labelledby="coverImageModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h6 className="modal-title" id="signUpModalLabel">
                      Upload a new cover image
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
                        onChange={handleCoverUploadOnChange}
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
                      onClick={handleCoverUploadButton}
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

            {/* Pfp Change Modal */}
            <div
              className="modal fade"
              id="pfpModal"
              tabIndex="-1"
              aria-labelledby="profilePictureModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h6 className="modal-title" id="signUpModalLabel">
                      Upload a new profile picture
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
                        onChange={handleProfilePictureUploadOnChange}
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
                      onClick={handleProfilePictureUploadButton}
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
    } else {
        return null;
    }
}

export default ProfilePage;
