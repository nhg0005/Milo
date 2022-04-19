// Styling
import "./FriendsListContainer.css";

// Components
import FriendItem from "./Friends_List_Item/FriendItem";

const FriendsListContainer = ({ friendsList }) => {
  const friendItems = friendsList.map((friend) => (
    <FriendItem friend={friend} key={friend._id} _id={friend._id} />
  ));

  return (
    <div className="container-sm  p-2 bg-body rounded regular-fl-container">
      {friendItems}
    </div>
  );
};

export default FriendsListContainer;
