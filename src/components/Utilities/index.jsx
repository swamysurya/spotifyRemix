// all imports should be here
import moment from "moment";

export const apiStatusConstants = {
  initial: "INITIAL",
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};

// updated casing
export const updateData = (data) => ({
  playCardImageURL: data.images[0].url,
  name: data.name,
  tracks: {
    items: data.tracks.items.map((eachItem, index) => ({
      id: eachItem.track.id,
      time: eachItem.added_at,
      duration: eachItem.track.duration_ms,
      trackNumber: index + 1,
      trackName: eachItem.track.album.name,
      artistName: eachItem.track.artists.map((eachItem) => eachItem.name),
      trackPreviewUrl: eachItem.track.preview_url,
    })),
  },
});

export const convertToSec = (milliseconds) => {
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

// Format time in mm:ss format
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return "0:00"; // Guard against NaN
  const minutes = Math.floor(seconds / 60); // Calculate whole minutes
  const remainingSeconds = Math.floor(seconds % 60); // Calculate remaining seconds

  // Add leading zero to seconds if necessary
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${minutes}:${formattedSeconds}`;
};

//form realtive time form momentum module
export const formatRelativeTime = (date) => {
  return moment(date).fromNow();
};

export const extractName = (input) => {
  // Use a regular expression to match the text before the first opening parenthesis
  const match = input.match(/(.*?)(?:\s*\(.*\))?$/);
  return match ? match[1].trim() : "";
};
