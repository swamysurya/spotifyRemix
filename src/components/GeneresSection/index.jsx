import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";
const CategoriesApiURL = "https://apis2.ccbp.in/spotify-clone/categories";

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
    // console.log(apiResponse);
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

  const renderLoadingView = () => <h1>Loading</h1>;
  const renderSuccessView = () => {
    const { categories } = categoriesResponse;
    // console.log(playlists);
    return (
      <ul className="cards-container">
        {categories.map((eachItem) => (
          <Link key={eachItem.id} to={`/category/${eachItem.id}/playlists`}>
            <li>
              <img className="Geners-section-image" src={eachItem.imageUrl} />
            </li>
          </Link>
        ))}
      </ul>
    );
  };
  const renderFailureView = () => <h1>Failure</h1>;

  const renderCategory = () => {
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
      <h1>Geners & Moods </h1>
      {renderCategory()}
    </div>
  );
};

export default GeneresSection;