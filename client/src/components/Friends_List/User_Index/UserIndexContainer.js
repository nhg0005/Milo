// Components
import UserIndexItem from "./UserIndexItem";

const UserIndexContainer = ({ userIndexList }) => {
  const userIndexItems = userIndexList.map((person) => (
    <UserIndexItem person={person} key={person._id} _id={person._id} />
  ));

  return (
    <div className="container-sm  p-2 bg-body rounded regular-fl-container">
      {userIndexItems}
    </div>
  );
};

export default UserIndexContainer;
