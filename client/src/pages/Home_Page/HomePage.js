// Styling
import './HomePage.css';

// Components
import Header from '../../components/Header/Header.js';
import NewStatusBar from '../../components/New_Status_Bar/NewStatusBar.js';
import PostContainer from '../../components/Posts/PostContainer.js';
import FriendRequestContainer from '../../components/Friend_Requests/FriendRequestContainer.js';
import FriendsListContainer from '../../components/Friends_List/Regular/FriendsListContainer';
import UserCard from '../../components/User_Card/UserCard.js';

// Context
import { useContext, useState, useEffect } from 'react';
import { CurrentUserContext } from '../../context/CurrentUserContext';

const HomePage = () => {

    // State Hooks
    const [homePagePosts, setHomePagePosts] = useState([]);
    const [friendsList, setFriendsList] = useState([]);
    const [inboundFriends, setInboundFriends] = useState([]);

    // Deconstructed from context
    const { currentUser, token, getFriendsList, getInboundFriendRequests, getUsersPosts, getUsersFriendsPosts, getBasicUserInfo } = useContext(CurrentUserContext);
    

    // Lifecycle hooks
    useEffect(() => {
        // Get the current user's id from localStorage
        const cUser = JSON.parse(localStorage.getItem('currentUser'));
        if (cUser) {
            const cUID = cUser._id;
            
            // Get the user's posts
            (async () => {
                const uPosts = await getUsersPosts(cUID);
                const basicInfo = await getBasicUserInfo(cUID);
                const pfp = basicInfo.profile_picture;
                uPosts.forEach((post) => {
                    // console.log(post.username.username)
                    const id = post._id;
                    const fullName = post.username.first_name + ' ' + post.username.last_name;
                    
                    const utcDateString = post.date;
                    const timestamp = new Date(post.date).toLocaleString([], { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        
                    const text = post.text;
        
                    const comments = post.comments;
        
                    const likes = post.likes;
    
                    const usernameID = post.username._id;

                    if (post.image) {
                        const image = post.image;
                        setHomePagePosts(homePagePosts => homePagePosts.concat([{ id, fullName, pfp, utcDateString, timestamp, text, comments, likes, usernameID, image }]));
                    } else {
                        // Add to homePagePosts state
                        setHomePagePosts(homePagePosts => homePagePosts.concat([{ id, fullName, pfp, utcDateString, timestamp, text, comments, likes, usernameID }]));
                    }
        
                });
            })();
            
            // Get the user's friends posts
            (async () => {
                const fPosts = await getUsersFriendsPosts(cUID);
                // Loop through posts array and add values to homePagePosts
                fPosts.forEach((post) => {
                    const id = post._id;
                    const fullName = post.username.first_name + ' ' + post.username.last_name;
    
                    const utcDateString = post.date;
                    const timestamp = new Date(post.date).toLocaleString([], { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                    
                    const text = post.text;
    
                    const comments = post.comments;
    
                    const likes = post.likes;
    
                    const usernameID = post.username._id;

                    const pfp = post.username.profile_picture;
    
                    if (post.image) {
                        const image = post.image;
                        setHomePagePosts(homePagePosts => homePagePosts.concat([{ id, fullName, pfp, utcDateString, timestamp, text, comments, likes, usernameID, image }]));
                    } else {
                        // Add to homePagePosts state
                        setHomePagePosts(homePagePosts => homePagePosts.concat([{ id, fullName, pfp, utcDateString, timestamp, text, comments, likes, usernameID }]));
                    }
                });
            })();
    
            // Get the current user's friends list and assign the array to friendsList
            (async () => {
                const list = await getFriendsList(cUID);
                setFriendsList(friendsList => friendsList.concat(list));
            })();
            
            // Get the current user's inbound friend requests and assign the array to inboundFriends
            (async () => {
                const list = await getInboundFriendRequests(cUID);
                setInboundFriends(inboundFriends => inboundFriends.concat(list));
            })();
        }

    }, []);

    if (currentUser) {
        return (
            <div className='home-page'>
                {/* Header component */}
                <Header />
    
                {/* Page Body */}
                <div className='home-page-body'>
    
                    <div className='hp-user-card'>
                        {/* User card */}
                        <UserCard />
                    </div>
    
                    <div className="hp-posts">
                        {/* New status bar */}
                        <NewStatusBar />
                        <PostContainer posts={ homePagePosts } />
                    </div>
    
                    <div className='hp-friends-lists'>
                        {/* Friends IF there are any */}
                        {friendsList.length !== 0 &&
                            <div>
                                <h6>Friends</h6>
                                <FriendsListContainer friendsList={friendsList} />
                            </div>
                        }
                    </div>
    
                </div>
    
            </div>
        )
    } else {
        return null;
    }
}

export default HomePage;