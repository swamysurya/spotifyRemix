import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
const newReleaseApiURL = "https://apis2.ccbp.in/spotify-clone/new-releases";

//api constants
const apiStatusConstants = {
  initial: "INITIAL",
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};
const NewRelaseSection = () => {
  //state management
  const [newRelseasesResponse, setNewReleasesResponse] = useState({});
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const updateData = (data) => ({
    albums: data.albums.items.map((eachItem) => ({
      id: eachItem.id,
      imageUrl: eachItem.images[0].url,
      name: eachItem.name,
    })),
  });

  // fetch function
  const fetchNewReleases = async () => {
    setApiStatus(apiStatusConstants.loading);
    const apiResponse = await fetch(newReleaseApiURL);
    // console.log(apiResponse);
    const data = await apiResponse.json();

    // check the fetch is done successfull or not
    if (apiResponse.ok) {
      const updatedData = updateData(data);
      //   console.log("jrere");
      //   console.log(updateData);
      setNewReleasesResponse(updatedData);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  //perform fetching of data
  useEffect(() => {
    fetchNewReleases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderLoadingView = () => <h1>Loading</h1>;
  const renderSuccessView = () => {
    const { albums } = newRelseasesResponse;
    // console.log(playlists);
    return (
      <ul className="cards-container">
        {albums.map((eachItem) => (
          <Link
            className="link-item"
            key={eachItem.id}
            to={`/albums/${eachItem.id}`}
          >
            <li>
              <img
                className="new-relsease-section-images"
                src={eachItem.imageUrl}
              />
              <p>{eachItem.name}</p>
            </li>
          </Link>
        ))}
      </ul>
    );
  };
  const renderFailureView = () => <h1>Failure</h1>;

  const renderNewRelseases = () => {
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
      <h1>New releases </h1>
      {renderNewRelseases()}
    </div>
  );
};

export default NewRelaseSection;
