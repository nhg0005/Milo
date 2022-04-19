
// Styling
import './FriendItem.css';

import { Link } from 'react-router-dom';

const FriendItem = ({friend}) => {
    return (
        <div className='friend-item'>
            <Link to={'/profile/' + friend._id} style={{ textDecoration: 'none', color: 'initial' }}>
                <div className='fi-friend'>
                    {(friend.profile_picture) &&
                    <img className='fi-profile-picture' src={friend.profile_picture} alt="" />
                }
                    <p>{friend.first_name + " " + friend.last_name}</p>
                </div>
            </Link>
        </div>
    )
};

export default FriendItem;