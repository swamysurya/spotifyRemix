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
      <ul className="cards-container">
        {playlists.map((eachItem) => (
          <Link
            className="link-item"
            key={eachItem.id}
            to={`/playlist/${eachItem.id}`}
          >
            <li className="play-list-link-item">
              <img className="card-image" src={eachItem.imageUrl} />
              <p className="card-name">{eachItem.cardName}</p>
            </li>
          </Link>
        ))}
      </ul>
    );
  };
  const renderFailureView = () => <h1>Failure</h1>;

  const renderEditorPicks = () => {
    // const apiStatus = apiStatusConstants.loading;
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
      <div className="render-playlist-section">{renderEditorPicks()}</div>
    </div>
  );
};

export default EditorSection;
