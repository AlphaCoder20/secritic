import "../styles/Profile.css";
import MyAccount from "../components/MyAccount";
import MyRatings from "../components/MyRatings";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../analytics";
import { useRef, useState, useEffect } from "react";

export default function Profile() {
  const [profileContent, setProfileContent] = useState("my_account");
  const accountContentRef = useRef(null);
  const ratingsContentRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userData"));

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {
      // Send logout attempt event to Google Analytics
      trackEvent("User", "Attempted Logout", user.email);
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userData");
      navigate("/login");
    }
  };

  const changeContent = (e) => {
    setProfileContent(e.target.id);
  };

  useEffect(() => {
    if (profileContent === "my_account") {
      accountContentRef.current.classList.add("active");
      ratingsContentRef.current.classList.remove("active");
    } else if (profileContent === "my_ratings") {
      ratingsContentRef.current.classList.add("active");
      accountContentRef.current.classList.remove("active");
    }
  }, [profileContent]);

  return (
    <>
      <div className="profile-page">
        <div className="profile-menu">
          <h2>My Profile</h2>
          <ul>
            <li id="my_account" onClick={changeContent} ref={accountContentRef}>
              My Account
            </li>
            <li id="my_ratings" onClick={changeContent} ref={ratingsContentRef}>
              My Ratings & Reviews
            </li>
            <li onClick={handleLogout}>Log Out</li>
          </ul>
        </div>
        <div className="profile-content">
          {profileContent === "my_account" && <MyAccount />}
          {profileContent === "my_ratings" && <MyRatings />}
        </div>
      </div>
    </>
  );
}
