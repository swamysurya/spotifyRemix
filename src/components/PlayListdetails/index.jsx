import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../Loader";
import SideNavBar from "../SideNavBar";
import "./index.css";

//audio player
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const apiStatusConstants = {
  initial: "INITIAL",
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};
const PlayListDetails = () => {
  // state management
  const [apiResponse, setApiResponse] = useState({});
  const [apiStatus, setApiStatus] = useState();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [selectedTrackId, setSelectedTrackId] = useState(null);
  const [trackData, setTrackData] = useState({});
  const audioRef = useRef(null);

  let { id } = useParams();

  // updated casing
  const updateData = (data) => ({
    playCardImageURL: data.images[0].url,
    name: data.name,
    tracks: {
      items: data.tracks.items.map((eachItem, index) => ({
        id: eachItem.track.id,
        time: eachItem.added_at,
        duration: eachItem.track.duration_ms,
        trackNumber: index + 1,
        trackName: eachItem.track.album.name,
        artistName: eachItem.track.artists[0].name,
        trackPreviewUrl: eachItem.track.preview_url,
      })),
    },
  });

  // fetch data function
  const fetchPlaylist = async () => {
    setApiStatus(apiStatusConstants.loading);
    const specificPlaylistApiUrl = `https://apis2.ccbp.in/spotify-clone/playlists-details/${id}`;
    const response = await fetch(specificPlaylistApiUrl);
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
    fetchPlaylist();
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
    console.log("here track", trackdata);
    setCurrentTrack(trackdata.trackPreviewUrl);
    setSelectedTrackId(trackdata.id);
    setTrackData(trackdata);
  };

  const convertToSec = (milliseconds) => {
    // Calculate total seconds from milliseconds
    const totalSeconds = Math.floor(milliseconds / 1000);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Format seconds to be always two digits
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

    // Return the formatted time string
    return `${minutes}:${formattedSeconds}`;
  };

  // manipulate date function

  function formatRelativeTime(date) {
    return moment(date).fromNow();
  }

  // extract movie name
  const extractTrackAndMovieName = (text) => {
    // Regular expression to match the track and movie name
    const regex = /^(.*?) \(From "(.*?)"\)$/;

    // Apply the regex to the text
    const match = text.match(regex);

    // Check if the regex matched and return the results
    if (match && match.length === 3) {
      const trackName = match[1].trim();
      const movieName = match[2].trim();
      return { trackName, movieName };
    }

    // Return null if the regex didn't match
    return null;
  };
  //views
  const renderLoadingView = () => <Loader />;
  const { playCardImageURL, name, tracks } = apiResponse;
  console.log(trackData);

  const renderSuccessView = () => {
    // const { trackName, movieName } = extractTrackAndMovieName(
    //   trackData.trackName
    // );
    // console.log(trackName, movieName);
    return (
      <div className="play-card-track-section">
        <div className="play-card-image-details">
          <img className="play-card-image" src={playCardImageURL} />
          <div className="card-details">
            <h3 className="play-details-heading">Editor&apos; picks</h3>
            <h1 className="play-card-name">{name}</h1>
            <p className="play-details-heading">Arjith Singh</p>
          </div>
        </div>
        <div>
          <table className="table-style">
            <thead>
              <tr>
                <th></th>
                <th>Track</th>
                <th>Album</th>
                <th>Time</th>
                <th>Artist</th>
                <th>Added</th>
              </tr>
            </thead>
            <tbody>
              {tracks.items.map((eachItem, index) => (
                <tr
                  className={`table-row ${
                    selectedTrackId === eachItem.id ? "selected" : ""
                  }`}
                  key={eachItem.id}
                  onClick={() => handleSongClick(eachItem)}
                >
                  <td className="row-elipsing-name1">{index + 1}</td>
                  <td className="row-elipsing-name2">
                    <p className="row-data-name">{eachItem.trackName}</p>
                  </td>
                  <td className="row-elipsing-name3">
                    <p className="row-data-name">{eachItem.trackName}</p>
                  </td>
                  <td className="row-elipsing-name4">
                    {convertToSec(eachItem.duration)}
                  </td>
                  <td className="row-elipsing-name5">{eachItem.artistName}</td>
                  <td className="row-elipsing-name6">
                    {formatRelativeTime(eachItem.time)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {currentTrack && (
          <div className="audio-component">
            <div className="player-image-details">
              <img className="player-component-image" src={playCardImageURL} />
              <div>
                <p>sun ra hahai</p>
                <p> asique2</p>
              </div>
            </div>
            <AudioPlayer
              autoPlay
              className="main-audio"
              src={currentTrack}
              onPlay={(e) => console.log("onPlay")}
              // other props here
            />
          </div>
        )}
      </div>
    );
  };
  const renderFailureView = () => <h1>failureView</h1>;

  const renderPlayerDetailsView = () => {
    // const apiStatus = apiStatusConstants;
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

export default PlayListDetails;

{
  /*<audio ref={audioRef} src={currentTrack} controls /> */
}
