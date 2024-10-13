import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
const CategoriesApiURL = "https://apis2.ccbp.in/spotify-clone/categories";

//components
import Loader from "../Loader";
//api constants
const apiStatusConstants = {
  initial: "INITIAL",
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};
const GeneresSection = () => {
  //state management
  const [categoriesResponse, setCategoryResponse] = useState({});
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  const updateData = (data) => ({
    categories: data.categories.items.map((eachItem) => ({
      id: eachItem.id,
      imageUrl: eachItem.icons[0].url,
    })),
  });

  // fetch function
  const fetchCategories = async () => {
    setApiStatus(apiStatusConstants.loading);
    const apiResponse = await fetch(CategoriesApiURL);
    // console.log("apiResponse");
    const data = await apiResponse.json();
    // console.log(data);
    // check the fetch is done successfull or not
    if (apiResponse.ok) {
      const updatedData = updateData(data);
      //   console.log("jrere");
      //   console.log(updateData);
      setCategoryResponse(updatedData);
      setApiStatus(apiStatusConstants.success);
    } else {
      setApiStatus(apiStatusConstants.failure);
    }
  };

  //perform fetching of data
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderLoadingView = () => <Loader />;
  const renderSuccessView = () => {
    const { categories } = categoriesResponse;
    // console.log("playlists");
    return (
      <ul className="genere-cards-container row">
        {categories.map((eachItem) => (
          <li
            key={eachItem.id}
            className="genere-section-card col-6 col-md-3 col-lg-2"
          >
            <Link to={`/category/${eachItem.id}/playlists`}>
              <img className="Geners-section-image" src={eachItem.imageUrl} />
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
        <button className="try-again-button" onClick={fetchCategories}>
          Try Again
        </button>
      </div>
    </div>
  );

  const renderCategory = () => {
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
      <h1 className="editor-heading">Geners & Moods </h1>
      <div className="render-playlist-section">{renderCategory()}</div>
    </div>
  );
};

export default GeneresSection;
