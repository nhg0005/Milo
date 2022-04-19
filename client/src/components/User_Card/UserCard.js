
// Styling
import './UserCard.css';

// Context
import { CurrentUserContext } from '../../context/CurrentUserContext';
import { useContext, useState, useEffect } from 'react';

import { Link } from 'react-router-dom';

const UserCard = () => {

    // State Hooks
    const { currentUser, getBasicUserInfo } = useContext(CurrentUserContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userID, setUserID] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    // Lifecycle hooks
    useEffect(() => {
        // Get the current user's name from localStorage
        const cUser = JSON.parse(localStorage.getItem('currentUser'));
        setFirstName(cUser.first_name);
        setLastName(cUser.last_name);
        setUserID(cUser._id);

        // Grab the full name of the owner of the profile
        (async () => {
            const basicInfo = await getBasicUserInfo(userID);
            setProfilePicture(basicInfo.profile_picture);
        })();
    }, [profilePicture]);

    return (
        <div className="card mb-3 user-card">

            {/* UC Header */}
            <div className="card-header uc-header">
                {(profilePicture) &&
                    <img className='uc-profile-picture' src={profilePicture} alt="" />
                }
                <h6>{ firstName + ' ' + lastName }</h6>
            </div>

            {/* UC Buttons */}
            <div className="card-body text-secondary uc-body">
            
                <Link to={'/profile/' + userID} style={{ textDecoration: 'none' }}>
                <button className="btn">
                        <i className="bi bi-person-circle uc-profile-button"></i>
                        <p className="card-text">Profile</p>
                </button>
                </Link>

                <Link to={'/friends'} style={{ textDecoration: 'none' }}>
                    <button className="btn">
                        <i className="bi bi-person-hearts uc-profile-button"></i>
                        <p className="card-text">Friends</p>
                    </button>
                </Link>
                
            </div>
        </div>
    )
};

export default UserCard;