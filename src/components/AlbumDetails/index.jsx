// import react compoents here
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
  extractName,
  formatTime,
  convertToSec,
} from "../Utilities";
import Loader from "../Loader";
import FailureView from "../Retry";

const AlbumDetails = () => {
  // state management
  const [apiResponse, setApiResponse] = useState({});
  const [apiStatus, setApiStatus] = useState();

  // track data to store
  const [currentTrackData, setTrackData] = useState({});
  const [currentTrack, setCurrentTrack] = useState(null);
  const audioRef = useRef(null);

  let { id } = useParams();

  // audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const { playCardImageURL, name, popularity, tracks } = apiResponse;

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

  // updated casing
  const updateData = (data) => ({
    playCardImageURL: data.images[0].url,
    name: data.name,
    popularity: data.popularity,
    tracks: {
      items: data.tracks.items.map((eachItem) => ({
        id: eachItem.id,
        artists: eachItem.artists.map((eachItem) => eachItem.name),
        trackNumber: eachItem.track_number,
        duration: eachItem.duration_ms,
        trackName: eachItem.name,
        trackPreviewUrl: eachItem.preview_url,
      })),
    },
  });

  // const { playCardImageURL, name, tracks } = apiResponse;

  // fetch data function
  const fetchAlbumDetails = async () => {
    setApiStatus(apiStatusConstants.loading);
    const albumDetailsApiUrl = `https://apis2.ccbp.in/spotify-clone/album-details/${id}`;
    const response = await fetch(albumDetailsApiUrl);
    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      const updatedData = updateData(data);
      // console.log("ALBUM DETAILS DATA", updatedData);
      setApiResponse(updatedData);
      // Set the first song as default
      setTrackData(updatedData.tracks.items[0]);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  //pages views hee

  useEffect(() => {
    fetchAlbumDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //handle click of track
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

  //render table for large devices
  const renderTable = () => (
    <div className="playlist-table">
      <table className="table-style">
        <thead className="table-row1">
          <tr>
            <th className="sn">#</th>
            <th className="sn">Track</th>
            <th className="sn">Time</th>
            <th className="sn">Popularity</th>
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
              <td className="row-elipsing-name4">
                {convertToSec(eachItem.duration)}
              </td>
              <td className="row-elipsing-name5">{popularity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const rendermobileTrackList = () => (
    <ul className="track-items-container">
      {tracks.items.map((eachItem, index) => (
        <li
          className={`d-flex flex-row justify-content-between align-items-center p-2 track-name ${
            currentTrackData.id === eachItem.id ? "selected" : ""
          }`}
          key={eachItem.id}
          // onClick={() => handleSongClick(eachItem)}
        >
          <div className="d-flex flex-column justify-content-center ">
            <p className="song-name">{eachItem.trackName}</p>
            <p className="singer-name">{eachItem.artists.join(" ")}</p>
          </div>
          <p className="time-duration">{convertToSec(eachItem.duration)}</p>
        </li>
      ))}
    </ul>
  );

  // loading view
  const renderLoadingView = () => <Loader />;

  const renderSuccessView = () => (
    <div className="play-card-track-section">
      <div className="play-card-image-details-section">
        <img className="play-card-image" src={playCardImageURL} />
        <div className="play-card-details">
          <h3 className="editorspics-name">New Releases</h3>
          <h1 className="play-card-name pt-3 pt-md-0">{name}</h1>
          <p className="play-card-singer-name">Arjith Singh</p>
        </div>
      </div>
      {renderTable()}
      {rendermobileTrackList()}
      {currentTrackData && renderAudioComponent()}
    </div>
  );

  // Seek to a specific time in the song when the slider is changed
  const handleSliderChange = (e) => {
    audioRef.current.currentTime = e.target.value;
    setCurrentTime(e.target.value); // Update the current time to reflect the slider value
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume; // Set the audio element volume
  };

  // Update current time of the song and handle seeking
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const renderAudioComponent = () => (
    <div className="audio-component-container">
      <div className="row">
        <div className="col-10 col-md-3 d-flex flex-row justify-content-start align-items-center gap-3">
          <img src={apiResponse.playCardImageURL} className="audio-icon" />
          <div className="d-flex flex-column justify-content-center">
            <p className="track-name">
              {extractName(currentTrackData.trackName)}
            </p>
            <p className="artistname">{currentTrackData.artists.join(", ")}</p>
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
      />
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

  const renderFailureView = () => <FailureView onRetry={fetchAlbumDetails} />;

  // back button handling
  const navigate = useNavigate();

  //handle back button option
  const handleBack = () => {
    navigate("/", { replace: true });
  };

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

export default AlbumDetails;
