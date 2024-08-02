import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const SideNavBar = () => {
  //handle teh logout feature
  const navigate = useNavigate();
  const handleLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/", { replace: true });
  };

  return (
    <nav className="nav-container">
      <Link to="/">
        <img
          className="home-logo-link"
          src="https://res.cloudinary.com/davv8r8v4/image/upload/v1722416752/spoyifyRemix/navBar/llfg8i4hwxfu7tmauw5u.png"
        />
      </Link>
      <button className="logout-btn" onClick={handleLogout}>
        <img
          className="logout-icon"
          src="https://res.cloudinary.com/davv8r8v4/image/upload/v1722416752/spoyifyRemix/navBar/sqhd74j1hezkwlmbiein.png"
        />
        <p className="logout-text">Logout</p>
      </button>
    </nav>
  );
};

export default SideNavBar;
