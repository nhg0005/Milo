// Style
import "./ProfileCover.css";

const ProfileCover = ({ fullName, coverImage, profilePicture }) => {
  return (
    <div className="container-sm profile-cover">
      {/* Cover Image */}
      <div className="cover-image">
        {coverImage ? (
          <img src={coverImage} alt="" />
        ) : (
          <img
            src="https://wetime.io/assets/default_profile_banner-9fbacaab28bb852316e960722bfd15deb0fdb1866de4564178916c8f2a3d83c1.png"
            alt=""
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="profile-info">
        {/* Profile picture */}
        {profilePicture ? (
          <img src={profilePicture} alt="" />
        ) : (
          <img
            src="https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg"
            alt=""
          />
        )}

        <h2>{fullName}</h2>
      </div>
    </div>
  );
};

export default ProfileCover;
