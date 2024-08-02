import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import SideNavBar from "../SideNavBar";
import "./index.css";

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
  const renderLoadingView = () => <h1>loading</h1>;
  const renderSuccessView = () => {
    const { cards } = apiResponse;
    // return <h1>asjhbdihb</h1>;
    return (
      <ul>
        {cards.map((eachItem) => (
          <Link key={eachItem.id} to={`/playlist/${eachItem.id}`}>
            <li>
              <img src={eachItem.imageUrl} />
              <p>{eachItem.tracksCount}</p>
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

  return (
    <div className="specific-playlist-section">
      <SideNavBar />
      <div className="">
        <button className="back-button">
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
