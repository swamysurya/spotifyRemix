import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

//componets
import Loader from "../Loader";
import "./index.css";
const FeaturedPlayListApiURL =
  "https://apis2.ccbp.in/spotify-clone/featured-playlists";

//api constants
const apiStatusConstants = {
  initial: "INITIAL",
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};
const EditorSection = () => {
  //state management
  const [playListResponse, setPlayListResponse] = useState({});
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const updateData = (data) => ({
    playlists: data.playlists.items.map((eachItem) => ({
      id: eachItem.id,
      imageUrl: eachItem.images[0].url,
      cardName: eachItem.name,
    })),
  });

  // fetch function
  const fetchPlaylist = async () => {
    setApiStatus(apiStatusConstants.loading);
    const apiResponse = await fetch(FeaturedPlayListApiURL);
    console.log(apiResponse);
    const data = await apiResponse.json();
    // check the fetch is done successfull or not
    if (apiResponse.ok) {
      const updatedData = updateData(data);
      //   console.log(data);
      setPlayListResponse(updatedData);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  //perform fetching of data
  useEffect(() => {
    fetchPlaylist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderLoadingView = () => <Loader />;
  const renderSuccessView = () => {
    const { playlists } = playListResponse;
    // console.log(playlists);
    return (
      <ul className="cards-container row">
        {playlists.map((eachItem) => (
          <li className="link-item col-6 col-md-3 col-lg-2" key={eachItem.id}>
            <Link
              // we are using bootsrap grid system for media queries

              className="play-list-link-item"
              to={`/playlist/${eachItem.id}`}
            >
              <img className="card-image" src={eachItem.imageUrl} />
              <p className="card-name text-center">{eachItem.cardName}</p>
            </Link>
          </li>
        ))}
      </ul>
    );
  };
  const renderFailureView = () => (
    <div className="failure-container">
      <div>
        <img
          className="alert-icon"
          src="https://res.cloudinary.com/davv8r8v4/image/upload/v1725555794/spoyifyRemix/nlujog8xruvrsqbq7rgv.png"
        />
        <p>Something went wrong. Please try again</p>
        <button className="try-again-button" onClick={fetchPlaylist}>
          Try Again
        </button>
      </div>
    </div>
  );

  const renderEditorPicks = () => {
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

  return (
    <div className="editors-section">
      <h1 className="editor-heading">Editor&apos;s picks</h1>
      <div className="render-playlist-section ">{renderEditorPicks()}</div>
    </div>
  );
};

export default EditorSection;
