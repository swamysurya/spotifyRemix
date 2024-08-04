import { useEffect, useState } from "react";

import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader";
import SideNavBar from "../SideNavBar";
import "./index.css";

//audio player

const apiStatusConstants = {
  initial: "INITIAL",
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};
const CategoryPlayListDetails = () => {
  // state management
  const [apiResponse, setApiResponse] = useState({});
  const [apiStatus, setApiStatus] = useState();

  let { id } = useParams();

  // updated casing
  const updateData = (data) => ({
    cards: data.playlists.items.map((eachItem) => ({
      id: eachItem.id,
      imageUrl: eachItem.images[0].url,
      name: eachItem.name,
      tracksCount: eachItem.tracks.total,
    })),
  });

  // fetch data function
  const fetchCategoryPlayListDetails = async () => {
    setApiStatus(apiStatusConstants.loading);
    const albumDetailsApiUrl = `https://apis2.ccbp.in/spotify-clone/category-playlists/${id}/`;
    const response = await fetch(albumDetailsApiUrl);

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      const updatedData = updateData(data);
      console.log(updatedData);
      setApiResponse(updatedData);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    fetchCategoryPlayListDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // for handling track

  //views
  const renderLoadingView = () => <Loader />;
  const renderSuccessView = () => {
    const { cards } = apiResponse;
    // return <h1>asjhbdihb</h1>;
    return (
      <ul className="cards-container">
        {cards.map((eachItem) => (
          <Link
            className="link-item"
            key={eachItem.id}
            to={`/playlist/${eachItem.id}`}
          >
            <li className="play-list-link-item adjust-height ">
              <img className="card-image" src={eachItem.imageUrl} />
              <p className="card-name">{eachItem.name}</p>
              <p className="card-name">{eachItem.tracksCount} tracks</p>
            </li>
          </Link>
        ))}
      </ul>
    );
  };

  const renderFailureView = () => <h1>failureView</h1>;

  const renderPlayerDetailsView = () => {
    switch (apiStatus) {
      case apiStatusConstants.loading:
        return renderLoadingView();
      case apiStatusConstants.success:
        return renderSuccessView();
      case apiStatusConstants.failure:
        return renderFailureView();
      default:
        return null;
    }
  };
  const navigate = useNavigate();
  //handle back button option
  const handleBack = () => {
    navigate("/", { replace: true });
  };

  return (
    <div className="specific-playlist-section">
      <SideNavBar />
      <div>
        <button onClick={handleBack} className="back-button">
          <FaArrowLeft />
          <span>Back</span>
        </button>
        <div className="play-list-section">{renderPlayerDetailsView()}</div>
      </div>
    </div>
  );
};

export default CategoryPlayListDetails;

{
  /* */
}
