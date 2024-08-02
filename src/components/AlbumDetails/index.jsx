import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useParams } from "react-router-dom";
import SideNavBar from "../SideNavBar";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};
const AlbumDetails = () => {
  // state management
  const [apiResponse, setApiResponse] = useState({});
  const [apiStatus, setApiStatus] = useState();
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(null);

  let { id } = useParams();

  // updated casing
  const updateData = (data) => ({
    playCardImageURL: data.images[0].url,
    name: data.name,
    popularity: data.popularity,
    tracks: {
      items: data.tracks.items.map((eachItem) => ({
        id: eachItem.id,
        trackNumber: eachItem.track_number,
        duration: eachItem.duration_ms,
        trackName: eachItem.name,
        trackPreviewUrl: eachItem.preview_url,
      })),
    },
  });

  // fetch data function
  const fetchAlbumDetails = async () => {
    setApiStatus(apiStatusConstants.loading);
    const albumDetailsApiUrl = `https://apis2.ccbp.in/spotify-clone/album-details/${id}`;
    const response = await fetch(albumDetailsApiUrl);
    if (response.ok) {
      const data = await response.json();
      //   console.log(data);
      const updatedData = updateData(data);
      console.log(updatedData);
      setApiResponse(updatedData);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    fetchAlbumDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // for handling track

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.play();
    }
  }, [currentTrack]);

  // handle click of track
  const handleSongClick = (trackdata) => {
    setCurrentTrack(trackdata.trackPreviewUrl);
  };

  //views
  const renderLoadingView = () => <h1>loading</h1>;
  const { playCardImageURL, name, popularity, tracks } = apiResponse;
  console.log(tracks);
  const renderSuccessView = () => (
    <div>
      <div className="play-card-image-details">
        <img src={playCardImageURL} />
        <div className="card-details">
          <h3>New Releases</h3>
          <h1>{name}</h1>
          <p>Arjith Singh</p>
        </div>
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Track</th>
              <th>Time</th>
              <th>Popularity</th>
            </tr>
          </thead>
          <tbody>
            {tracks.items.map((eachItem) => (
              <tr key={eachItem.id} onClick={() => handleSongClick(eachItem)}>
                <td>{eachItem.trackNumber}</td>
                <td>{eachItem.trackName}</td>
                <td>{eachItem.duration}</td>
                <td>{popularity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {currentTrack && <audio ref={audioRef} src={currentTrack} controls />}
    </div>
  );
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

export default AlbumDetails;

{
  /* */
}
