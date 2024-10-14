// import react compoents here
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// load components
import SideNavBar from "../SideNavBar";

//load packages here
import { FaArrowLeft } from "react-icons/fa";
import { IoPlayCircleSharp } from "react-icons/io5";
import { MdPauseCircle } from "react-icons/md";
import { HiMiniSpeakerWave } from "react-icons/hi2";

// include css
import "./index.css";

// import apiStatusConstants from utilities
import {
  apiStatusConstants,
  updateData,
  convertToSec,
  extractName,
  formatRelativeTime,
} from "../Utilities";
import Loader from "../Loader";
import FailureView from "../Retry";

const PlayListDetails = () => {
  // state for fetch data
  const [apiResponse, setApiResponse] = useState({});
  // state for api satus
  const [apiStatus, setApiStatus] = useState();

  const [progress, setProgress] = useState(0.5); // Example initial progress (50%)

  // selected track
  const [currentTrackData, setTrackData] = useState({});
  const [isPlaying, setIsPlaying] = useState(false); // Track if music is playing

  const [currentTime, setCurrentTime] = useState(0); // Track the current time of the song
  const [duration, setDuration] = useState(0); // Store the song duration

  const [volume, setVolume] = useState(1); // Track the volume level (0 to 1)

  const handleProgressChange = (event) => {
    setProgress(event.target.value);
  };

  console.log(apiResponse);
  // id for fetching spec
  let { id } = useParams();

  const audioRef = useRef(null); // Reference for the audio element

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "0:00"; // Guard against NaN
    const minutes = Math.floor(seconds / 60); // Calculate whole minutes
    const remainingSeconds = Math.floor(seconds % 60); // Calculate remaining seconds

    // Add leading zero to seconds if necessary
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
  };

  // Play or pause the current track
  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Add an event listener to handle loading metadata and set duration
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration); // Update duration when the audio metadata is loaded
    // Update duration only if it's a valid number
    const newDuration = audioRef.current.duration;
    if (!isNaN(newDuration) && newDuration > 0) {
      setDuration(newDuration); // Update duration when the audio metadata is loaded
    }
  };

  // Function to handle song click and play the selected song
  const handleSongClick = (TrackData) => {
    setTrackData(TrackData);
    setIsPlaying(false);

    // Reset song progress and duration
    setCurrentTime(0); // Reset current time to 0
    setDuration(0); // Reset duration to 0; this will be updated in onLoadedMetadata

    // Play the selected track
    if (audioRef.current) {
      setTimeout(() => {
        audioRef.current.pause(); // Pause the current track if playing
        audioRef.current.src = TrackData.trackPreviewUrl; // Change the audio source to the new track
        audioRef.current.load(); // Load the new audio track
        // Ensure state update completes before playing
        audioRef.current.play();
        setIsPlaying(true); // Set play state to true
      }, 0);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume; // Set the audio element volume
  };

  // values for view
  const { playCardImageURL, name, tracks } = apiResponse;

  // printing current selected Track
  console.log("currentTrackData", currentTrackData);

  // fetch data function
  const fetchPlaylist = async () => {
    // console.log("data fetched");
    setApiStatus(apiStatusConstants.loading);
    const specificPlaylistApiUrl = `https://apis2.ccbp.in/spotify-clone/playlists-details/${id}`;
    const response = await fetch(specificPlaylistApiUrl);
    if (response.ok) {
      const data = await response.json();
      const updatedData = updateData(data);
      // console.log("updated data", updatedData);
      setApiResponse(updatedData);
      // Set the first song as default
      setTrackData(updatedData.tracks.items[0]);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  // back button handling
  const navigate = useNavigate();

  //handle back button option
  const handleBack = () => {
    navigate("/", { replace: true });
  };

  // usefeect for fetching data
  useEffect(() => {
    fetchPlaylist();
    console.log("use1");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //pages views hee
  // loading view
  const renderLoadingView = () => <Loader />;

  //render table for large devices
  const renderTable = () => (
    <div className="playlist-table">
      <table className="table-style">
        <thead className="table-row1">
          <tr>
            <th className="sn">s.no</th>
            <th className="sn">Track</th>
            <th className="sn">Album</th>
            <th className="sn">Time</th>
            <th className="sn">Artist</th>
            <th className="sn">Added</th>
          </tr>
        </thead>
        <tbody className="table-body-section">
          {tracks.items.map((eachItem, index) => (
            <tr
              className={`table-row ${
                currentTrackData.id === eachItem.id ? "selected" : ""
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
                <p className="row-data-name">
                  {convertToSec(eachItem.duration)}
                </p>
              </td>
              <td className="row-elipsing-name5">
                <p className="row-data-name">{eachItem.artistName}</p>
              </td>
              <td className="row-elipsing-name6">
                {formatRelativeTime(eachItem.time)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  //table view for mobile view
  const rendermobileTrackList = () => (
    <ul className="track-items-container">
      {tracks.items.map((eachItem, index) => (
        <li
          className={`d-flex flex-row justify-content-between align-items-center p-2 track-name ${
            currentTrackData.id === eachItem.id ? "selected" : ""
          }`}
          key={eachItem.id}
          onClick={() => handleSongClick(eachItem)}
        >
          <div className="d-flex flex-column justify-content-center ">
            <p className="song-name">{eachItem.trackName}</p>
            <p className="singer-name">{eachItem.artistName}</p>
          </div>
          <p className="time-duration">{convertToSec(eachItem.duration)}</p>
        </li>
      ))}
    </ul>
  );

  // success view
  const renderSuccessView = () => {
    // console.log("hee trackData");
    // console.log(trackData);
    // const { trackName, movieName } = extractTrackAndMovieName(
    //   trackData.trackName
    // );
    // console.log(trackName, movieName);
    return (
      <div className="play-card-track-section">
        <div className="play-card-image-details-section">
          <img className="play-card-image" src={playCardImageURL} />
          <div className="play-card-details">
            <h3 className="editorspics-name">Editor&apos; picks</h3>
            <h1 className="play-card-name pt-3 pt-md-0">{name}</h1>
            <p className="play-card-singer-name">Arjith Singh</p>
          </div>
        </div>
        {renderTable()}
        {rendermobileTrackList()}
        {currentTrackData && renderAudioComponent()}
      </div>
    );
  };

  const renderFailureView = () => <FailureView onRetry={fetchPlaylist} />;

  // loading view component
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

  // Update current time of the song and handle seeking
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  // Seek to a specific time in the song when the slider is changed
  const handleSliderChange = (e) => {
    audioRef.current.currentTime = e.target.value;
    setCurrentTime(e.target.value); // Update the current time to reflect the slider value
  };

  // console.log("track data", currentTrackData.artistName);

  const renderAudioComponent = () => (
    <div className="audio-component-container">
      <div className="row">
        <div className="col-10 col-md-3 d-flex flex-row justify-content-start align-items-center gap-3">
          <img src={apiResponse.playCardImageURL} className="audio-icon" />
          <div className="d-flex flex-column justify-content-center">
            <p className="track-name">
              {extractName(currentTrackData.trackName)}
            </p>
            <p className="artistname">
              {currentTrackData.artistName.join(", ")}
            </p>
          </div>
        </div>
        <div className="play-pause-icon-container col-2 col-md-6 gap-3 ">
          <button className="play-pause-icon" onClick={togglePlayPause}>
            {isPlaying ? (
              <MdPauseCircle className="icon-size" />
            ) : (
              <IoPlayCircleSharp className="icon-size" />
            )}
          </button>
          <div className="music-timer">
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          {/* Slider to seek within the song */}
          <input
            className="progres-bar-styles"
            type="range"
            id="progressBar"
            min="0"
            max={duration > 0 ? duration : 0}
            value={currentTime}
            onChange={handleSliderChange}
          />
        </div>
        <div className="volume-controller-container col-md-3 gap-3">
          {/* Volume Control Slider */}
          <HiMiniSpeakerWave className="speaker-iocn" />
          <input
            className="volume-slider"
            type="range"
            min="0"
            max="1"
            id="volumeSlider"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={currentTrackData.trackPreviewUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata} // Add this line
        onEnded={() => setIsPlaying(false)} // Add this to reset play button when song ends
      />
    </div>
  );

  return (
    <div className="specific-playlist-section">
      <SideNavBar />
      <div className="playlist-details-sections">
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
