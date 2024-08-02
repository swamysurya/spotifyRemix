import Cookies from "js-cookie";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ element: Component, ...rest }) => {
  //   console.log(rest)
  const navigate = useNavigate();
  const token = Cookies.get("jwt_token");

  useEffect(() => {
    if (token === undefined) {
      navigate("/login");
    }
  }, [navigate, token]);

  if (token === undefined) {
    return null; // or some loading indicator
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;
