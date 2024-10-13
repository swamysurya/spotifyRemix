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
    console.log("fetching");
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
  const renderLoadingView = () => (
    <div className="internal-loader-container loader-height w-100">
      <img
        className="loader-image"
        src="https://res.cloudinary.com/davv8r8v4/image/upload/v1722587666/spoyifyRemix/cvilrfq4lvtqd4mv4wig.png"
      />
      <p className="loading-text">Loading...</p>
    </div>
  );
  const renderSuccessView = () => {
    const { cards } = apiResponse;
    // return <h1>asjhbdihb</h1>;
    return (
      <ul className="cards-container row w-100">
        {cards.map((eachItem) => (
          <li className="link-item col-6 col-md-3 col-lg-2" key={eachItem.id}>
            <Link
              className="play-list-link-item"
              to={`/playlist/${eachItem.id}`}
            >
              <img className="card-image" src={eachItem.imageUrl} />
              <div className="d-flex flex-column justify-content-center align-items-center">
                <p className="album-name">{eachItem.name}</p>
                <p className="track-count">{eachItem.tracksCount} tracks</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  const renderFailureView = () => (
    <div className="failure-container loader-height">
      <div>
        <img
          className="alert-icon"
          src="https://res.cloudinary.com/davv8r8v4/image/upload/v1725555794/spoyifyRemix/nlujog8xruvrsqbq7rgv.png"
        />
        <p>Something went wrong. Please try again</p>
        <button
          className="try-again-button"
          onClick={fetchCategoryPlayListDetails}
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const renderPlayerDetailsView = () => {
    // const apiStatus = apiStatusConstants.failure;
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
  const handleBackInCategoory = () => {
    console.log("back to new");
    navigate("/", { replace: true });
  };

  return (
    <div className="specific-playlist-section">
      <SideNavBar />
      <div className="playlist-details-sections">
        <button onClick={handleBackInCategoory} className="back-button">
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
