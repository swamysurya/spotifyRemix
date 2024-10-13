import SideNavBar from "../SideNavBar";

import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./index.css";

const NotFound = () => {
  const navigate = useNavigate();
  //handle back button option
  const handleBack = () => {
    console.log("back to new");
    navigate("/", { replace: true });
  };

  return (
    <div className="not-found-container">
      <SideNavBar />
      <div className="row side-container">
        <button className="back-button" onClick={handleBack}>
          <FaArrowLeft />
          <span>Back</span>
        </button>
      </div>
      <div className="not-found d-flex flex-column justify-content-center align-items-center">
        <img
          className="FnotFImage"
          src="https://res.cloudinary.com/davv8r8v4/image/upload/v1725873358/lnuvbebjbq9oatoikcud.png"
        />
        <h1 className="notfound-name">Page Not Found</h1>
      </div>
    </div>
  );
};

export default NotFound;
