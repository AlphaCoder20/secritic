import { useEffect, useRef, useState } from "react";
import "../styles/Profile.css";

export default function Profile() {
  const buttonRef = useRef(null);
  const [userData, setUserData] = useState({
    Name: "Conquerror",
    Email: "conquerror@gmail.com",
  });
  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
  });

  useEffect(() => {
    setUserData({ ...userData, Password: "12" });
    setFormData(userData);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  useEffect(() => {
    if (formData.Name === userData.Name && formData.Email === userData.Email) {
      buttonRef.current.classList.remove("change");
    } else {
      buttonRef.current.classList.add("change");
    }
  }, [formData, userData]);

  const saveChanges = () => {
    if (buttonRef.current.classList.contains("change")) {
      setUserData(formData);
      alert("changes saved");
    } else {
      console.log("no changes");
    }
  };

  return (
    <>
      <div className="profile-page">
        <div className="profile-menu">
          <h2>My Profile</h2>
          <ul>
            <li className="active">My Account</li>
            <li>My Ratings & Reviews</li>
            <li>Log Out</li>
          </ul>
        </div>
        <div className="profile-content">
          <div className="my-account">
            <h2>My Account</h2>
            <ul>
              <li className="active">Username/Email</li>
              <li>Password</li>
            </ul>
            <div className="user-update">
              <form>
                <label htmlFor="name">User Name</label>
                <input
                  type="text"
                  name="Name"
                  value={formData.Name}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="Email"
                  value={formData.Email}
                  onChange={handleChange}
                  required
                />

                <button type="button" ref={buttonRef} onClick={saveChanges}>
                  Save Changes
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
