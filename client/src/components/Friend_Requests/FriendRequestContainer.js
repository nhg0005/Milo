// Styling
import './FriendRequestContainer.css';

// Components
import FriendRequestItem from './Friend_Request_Item/FriendRequestItem';

const FriendRequestContainer = ({ inboundFriends }) => {

    const friendRequestItems = inboundFriends.map((friend) => (
        <FriendRequestItem friend={friend} key={friend._id} _id={friend._id} />
    ));

    return (
        <div className='container-sm p-2 bg-body rounded regular-fl-container'>

            {friendRequestItems}
            
        </div>
    )
};

export default FriendRequestContainer;