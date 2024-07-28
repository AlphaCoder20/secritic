import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/MyAccount.css";
import { API_URL } from "../../config/global";
import useUser from "../utils/useUser";

export default function MyAccount() {
  const navigate = useNavigate();
  const [formContent, setFormContent] = useState("email_form");

  const emailButtonRef = useRef(null);
  const passwordButtonRef = useRef(null);
  const emailFormRef = useRef(null);
  const passwordFormRef = useRef(null);

  // const [newEmail, setNewEmail] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
  });

  const [emailFormData, setEmailFormData] = useState({
    name: "",
    email: "",
  });

  const [passwordFormData, setPasswordFormData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const { user, isError, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && !isError && user) {
      setUserData({
        ...userData,
        ...user,
      });

      setEmailFormData({
        name: user.name,
        email: user.email,
      });
    } else if (!isLoading) [navigate("/notfound")];
  }, [user, isLoading, isError]);

  const handleEmailChange = (e) => {
    const { name, value } = e.target;
    setEmailFormData({ ...emailFormData, [name]: value });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFormData({ ...passwordFormData, [name]: value });
  };

  // Togle class "change" for button
  useEffect(() => {
    if (formContent === "email_form") {
      if (
        emailFormData.name === userData.name &&
        emailFormData.email === userData.email
      ) {
        emailButtonRef.current.classList.remove("change");
      } else {
        emailButtonRef.current.classList.add("change");
      }
    }

    if (formContent === "password_form") {
      if (
        passwordFormData.new_password.length < 2 ||
        passwordFormData.confirm_password.length < 2
      ) {
        passwordButtonRef.current.classList.remove("change");
      } else {
        passwordButtonRef.current.classList.add("change");
      }
    }
  }, [emailFormData, passwordFormData, userData, formContent]);

  const saveEmailChanges = async () => {
    if (emailButtonRef.current.classList.contains("change")) {
      if (emailFormData.email === userData.email) {
        try {
          const response = await axios.post(
            `${API_URL}/update/username`,
            emailFormData
          );
          if (response.data === "Server Busy" || !response.data) {
            alert("Something went wrong. Try again later");
          } else if (response?.status) {
            setEmailFormData({ ...emailFormData });
            alert("Changes Saved");
          }
        } catch (error) {
          console.error("Error during Username Changes: ", error);
        }
      } else {
        try {
          const response = await axios.post(`${API_URL}/update/mail`, {
            ...emailFormData,
            originalEmail: userData.email,
          });
          if (response.data === "updateEmailAdded") {
            // setNewEmail(emailFormData.email);
            setEmailFormData({ name: userData.name, email: userData.email });
            alert("Confirmation link has sent to your email id");
            // fetcher();
          } else if (response.data === "updateEmailExist") {
            alert("Confirmation link already sent to your email id");
          } else if (response.data === "userExist") {
            alert("User already exist");
          } else if (response.data === "Server Busy") {
            alert("Something went wrong. Try again later");
          }
        } catch (error) {
          console.error("Error during Email Changes: ", error);
        }
      }
    } else {
      console.log("no changes");
    }
  };
  // const fetcher = () => {
  //   let timeoutId;

  //   const checkEmailAndRefetch = () => {
  //     if ( newEmail !== userData.email) {
  //       refetchUser();
  //       timeoutId = setTimeout(checkEmailAndRefetch, 1000); // 1000 ms delay
  //     }
  //   };

  //   checkEmailAndRefetch();

  //   return () => clearTimeout(timeoutId); // Cleanup timeout on unmount or dependency
  // };

  const savePasswordChanges = () => {
    if (passwordButtonRef.current.classList.contains("change")) {
      setPasswordFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });

      alert("password updated");
    } else {
      console.log("no changes");
    }
  };

  const changeForm = (e) => {
    setFormContent(e.target.id);
  };

  useEffect(() => {
    if (formContent === "email_form") {
      emailFormRef.current.classList.add("active");
      passwordFormRef.current.classList.remove("active");
    } else if (formContent === "password_form") {
      passwordFormRef.current.classList.add("active");
      emailFormRef.current.classList.remove("active");
    }
  }, [formContent]);

  return (
    <div className="my-account">
      <h2>My Account</h2>
      <ul>
        <li id="email_form" onClick={changeForm} ref={emailFormRef}>
          Username/Email
        </li>
        <li id="password_form" onClick={changeForm} ref={passwordFormRef}>
          Password
        </li>
      </ul>
      <div className="user-update">
        {formContent === "email_form" && (
          <form key="email_form">
            <label htmlFor="name">User Name</label>
            <input
              type="text"
              name="name"
              value={emailFormData.name}
              onChange={handleEmailChange}
              required
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={emailFormData.email}
              onChange={handleEmailChange}
              required
            />

            <button
              type="button"
              ref={emailButtonRef}
              onClick={saveEmailChanges}
            >
              Save Changes
            </button>
          </form>
        )}
        {formContent === "password_form" && (
          <form key="password_form">
            <label htmlFor="current_password">Current Password</label>
            <input
              type="password"
              name="current_password"
              value={passwordFormData.current_password}
              onChange={handlePasswordChange}
              required
            />
            <label htmlFor="new_password">New Password</label>
            <input
              type="password"
              name="new_password"
              value={passwordFormData.new_password}
              onChange={handlePasswordChange}
              required
            />
            <label htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              value={passwordFormData.confirm_password}
              onChange={handlePasswordChange}
              required
            />
            <div className="form-footer">
              <Link to="#" className="forgot-password">
                Forgot password?
              </Link>

              <button
                type="button"
                ref={passwordButtonRef}
                onClick={savePasswordChanges}
              >
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
