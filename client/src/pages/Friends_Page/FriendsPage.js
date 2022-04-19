// Styling
import './FriendsPage.css';

// Components
import Header from '../../components/Header/Header';
import FriendRequestContainer from '../../components/Friend_Requests/FriendRequestContainer';
import FriendsListContainer from '../../components/Friends_List/Regular/FriendsListContainer';
import UserIndexContainer from '../../components/Friends_List/User_Index/UserIndexContainer';
import UserCard from '../../components/User_Card/UserCard';

// Context
import { useContext, useState, useEffect } from 'react';
import { CurrentUserContext } from '../../context/CurrentUserContext';

const FriendsPage = () => {

    // State Hooks
    const [friendsList, setFriendsList] = useState([]);
    const [inboundFriends, setInboundFriends] = useState([]);
    const [userIndexList, setUserIndexList] = useState([]);

    // Deconstructed from context
    const { currentUser, token, getFriendsList, getInboundFriendRequests, getOutboundFriendRequests, getAllUsersList } = useContext(CurrentUserContext);
    
    // Lifecycle hooks
    useEffect(() => {
        // Get the current user's id from localStorage
        const cUser = JSON.parse(localStorage.getItem('currentUser'));
        if (cUser) {
            // return <h4>You must be logged in to view this page.</h4>
            const cUID = cUser._id;
    
            (async () => {
                // Get the current user's friends list and assign the array to friendsList
                const fList = await getFriendsList(cUID);
                setFriendsList(friendsList => friendsList.concat(fList));
    
                // Get the current user's inbound friend requests and assign the array to inboundFriends
                const iFRList = await getInboundFriendRequests(cUID);
                setInboundFriends(inboundFriends => inboundFriends.concat(iFRList));
    
                // Get a list of all of the users on the site and outbound friend requests for the User Index section
                const allList = await getAllUsersList();
                const oFRList = await getOutboundFriendRequests(cUID);
                // Remove the current user from the list
                let firstFilter = allList.filter((obj) => { return obj._id !== cUID;});
                // Remove the current user's friends
                let secondFilter = firstFilter.filter((obj) => !fList.find(({ _id }) => obj._id === _id));
                // Remove the current user's inbound friends
                let thirdFilter = secondFilter.filter((obj) => !iFRList.find(({ _id }) => obj._id === _id));
                // Finally, remove the current user's outbound friends
                let finalFilter = thirdFilter.filter((obj) => !oFRList.find(({ _id }) => obj._id === _id));
                // Assign the completely filtered array to userIndexList
                setUserIndexList(userIndexList => userIndexList.concat(finalFilter));
            })();
        }

    }, []);

    if (currentUser) {
        return (
            <div className='friends-page'>
                <Header />
    
                <div className="container fp-body">
                    {/* User card */}
                    <div className="fp-user-card">
                        <UserCard />
                    </div>
    
                    <div className='fp-lists'>
                        {/* Friend requests, IF they exist */}
                        {inboundFriends.length !== 0 &&
                            <div>
                                <h6>Friend Requests</h6>
                                <FriendRequestContainer inboundFriends={ inboundFriends }/>
                            </div>
                        }
    
                        {/* Friends IF there are any */}
                        {friendsList.length !== 0 &&
                            <div>
                                <h6>Friends</h6>
                                <FriendsListContainer friendsList={friendsList} />
                            </div>
                        }
    
                        {/* User Index if the user friends with everyone */}
                        {userIndexList.length !== 0 &&
                            <div>
                                <h6>User Index</h6>
                                <UserIndexContainer userIndexList={userIndexList} />
                            </div>
                        }
                    </div>
    
    
                </div>
    
            </div>
        )
    } else {
        // return <h4>You must be logged in to view this page.</h4>
        return null;
    } 
};

export default FriendsPage;