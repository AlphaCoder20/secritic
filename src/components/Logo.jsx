import { Link } from "react-router-dom";
import logo from "../assets/logo/S-Logo-Dark.svg";

import "../styles/Logo.css";

export default function Logo() {
  return (
    <div className="logo">
      <Link to="/">
        <img src={logo} alt="SeCritic Logo" />
      </Link>
    </div>
  );
}
