// Styling
import "./PostContainer.css";

// Components
import PostItem from "./PostItem";

const PostContainer = ({ posts }) => {
  // Fill in PostItem components
  const postItems = posts
    .sort((a, b) =>
      a.timestamp > b.timestamp ? -1 : b.timestamp > a.timestamp ? 1 : 0
    )
    .map((post) => (
      <PostItem
        post={post}
        key={post.id}
        name={post.fullName}
        timestamp={post.timestamp}
      />
    ));

  return <div className="container-fluid post-container">{postItems}</div>;
};

export default PostContainer;
