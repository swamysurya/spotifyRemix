import "./index.css";

// import { Container } from 'react-bootstrap'
// import { Navbar } from 'react-bootstrap'
// import { Nav } from 'react-bootstrap'
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";
// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';

const TopNavBar = () => {
  return (
    <nav className="top-nav-container p-3 fixed-top">
      <Link to="/">
        <img
          className=""
          src="https://res.cloudinary.com/davv8r8v4/image/upload/v1722416752/spoyifyRemix/navBar/llfg8i4hwxfu7tmauw5u.png"
        />
      </Link>
      <GiHamburgerMenu />
    </nav>
  );
};

export default TopNavBar;
