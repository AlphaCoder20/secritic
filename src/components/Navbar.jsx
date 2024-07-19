import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { trackEvent } from "../analytics";
import axios from "axios";
import fullLogo from "../assets/logo/S-Logo-Light.svg";
import logo from "../assets/logo/S-Favicon.svg";
import profileIcon from "../assets/icons/profile.svg";
import powerButton from "../assets/icons/powerButton.svg";
import profileDark from "../assets/icons/profileDark.svg";
import { useAllPost } from "../contexts/AllPostsProvider";
import searchIcon from "../assets/icons/SearchLight.svg";
import xIcon from "../assets/icons/XLight.svg";
import Search from "./Search";
import { API_URL } from "../../config/global";

import "../styles/Navbar.css";

export default function Navbar() {
  const allPost = useAllPost();

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(true);
  const [hideBox, setHideBox] = useState(true);
  const [hideNav, setHideNav] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const burgerRef = useRef(null);
  const navRef = useRef(null);
  const dropBoxRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    // Retrieve user info from localStorage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo && userInfo.token) {
      getData(userInfo.token);
    }
  }, []);

  const getData = async (token) => {
    try {
      const config = {
        headers: {
          Authorization: token,
        },
      };
      const response = await axios.get(`${API_URL}/home`, config);
      if (response.data === "Invalid Token") {
        alert("login again");
      } else if (response.data === "Server Busy") {
        alert("unauthorised access");
      } else if (response?.status) {
        setUser(response.data);
      }
    } catch (e) {
      console.error("Error occured during fetching user data: ", e);
    }
  };

  const handleLogout = () => {
    const isConfirmed = window.confirm("Are you sure you want to log out?");

    if (isConfirmed) {
      // Send logout attempt event to Google Analytics
      trackEvent("User", "Attempted Logout", user.email);

      localStorage.removeItem("userInfo");
      setUser(null);
      navigate("/login");
    }
  };

  const handleClick = (sectionTitle, sectionUrl) => {
    // Send menu item click event to Google Analytics
    trackEvent("Navigation", "Clicked Menu Item", sectionTitle);

    navigate(`/all/${sectionUrl}`);

    burgerRef.current.classList.remove("bx-x");
    navRef.current.classList.remove("open-menu");
  };

  const handleLens = () => {
    setIsSearchVisible(!isSearchVisible);
    setIsLoginVisible(!isLoginVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [screenWidth]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // User is scrolling down
        setShowNavbar(false);
      } else {
        // User is scrolling up
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const iconStyle = {
    marginRight: isSearchVisible ? "-10px" : "-5px",
    paddingLeft: isSearchVisible ? "15px" : "0",
  };

  const handleMenu = () => {
    if (Object.keys(user).length) {
      setHideBox(true);
      dropBoxRef.current.classList.remove("open");
    }

    burgerRef.current.classList.toggle("bx-x");
    navRef.current.classList.toggle("open-menu");
    setHideNav(!hideNav);
  };

  const handleDropBox = () => {
    setHideBox(!hideBox);
    dropBoxRef.current.classList.toggle("open");

    burgerRef.current.classList.remove("bx-x");
    navRef.current.classList.remove("open-menu");
    setHideNav(true);
  };

  const handleProfileClick = () => {
    setHideBox(!hideBox);
    dropBoxRef.current.classList.toggle("open");
    navigate("/profile");
  };

  const handleClickOutside = (event) => {
    if (
      profileRef.current &&
      !profileRef.current.contains(event.target) &&
      dropBoxRef.current &&
      !dropBoxRef.current.contains(event.target)
    ) {
      setHideBox(true);
      dropBoxRef.current.classList.remove("open");
    }
    if (
      burgerRef.current &&
      !burgerRef.current.contains(event.target) &&
      navRef.current &&
      !navRef.current.contains(event.target)
    ) {
      burgerRef.current.classList.remove("bx-x");
      navRef.current.classList.remove("open-menu");
      setHideNav(true);
    }
  };

  useEffect(() => {
    if (!hideBox || !hideNav) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hideBox, hideNav]);

  return (
    <nav
      className={`navbar ${showNavbar ? "navbar-show" : "navbar-hide"} ${
        lastScrollY > 0 ? "fixed-position bg-dark-thin" : ""
      } `}
    >
      <div className="container">
        <div className="n-logo">
          <Link to="/">
            <img
              src={screenWidth > 800 ? fullLogo : logo}
              alt="secritic Logo"
            />
          </Link>
        </div>

        {!isSearchVisible && (
          <div className="menu">
            <ul
              className={`navlist ${
                lastScrollY > 0 && screenWidth <= 800 ? "bg-dark-thin" : ""
              }`}
              ref={navRef}
            >
              {allPost.map((group, index) => (
                <li
                  key={index}
                  onClick={() =>
                    handleClick(group.sectionTitle, group.sectionUrl)
                  }
                >
                  {group.sectionTitle.split(" ")[0]}
                </li>
              ))}
            </ul>

            <div
              className={`bx bx-menu ${lastScrollY > 0 ? "bx-menu" : ""}`}
              id="menu-icon"
              onClick={handleMenu}
              ref={burgerRef}
            ></div>
          </div>
        )}

        <div className="search">
          {(isSearchVisible && <Search />) || (screenWidth > 800 && <Search />)}
          <div className="lens" onClick={handleLens} style={iconStyle}>
            <img src={isSearchVisible ? xIcon : searchIcon} alt="search icon" />
          </div>
        </div>

        {isLoginVisible && (
          <div
            className={`n-login ${
              Object.keys(user).length ? "user-logged-in" : ""
            }`}
          >
            {Object.keys(user).length ? (
              <>
                <div
                  className="profile"
                  onClick={handleDropBox}
                  ref={profileRef}
                >
                  <img src={profileIcon} alt="" id="profile-icon" />
                </div>

                <div
                  className={`drop-box ${
                    lastScrollY > 0 ? "bg-light-thin" : ""
                  }`}
                  ref={dropBoxRef}
                >
                  <ul>
                    <li onClick={handleProfileClick}>
                      {" "}
                      {<img src={profileDark} alt="" />} My Profile
                    </li>
                    <li onClick={handleLogout}>
                      {<img src={powerButton} alt="" id="powerButton" />} Log
                      out
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <Link to="/login">
                <button type="button">Login</button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
