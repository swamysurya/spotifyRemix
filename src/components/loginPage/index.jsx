import Cookies from "js-cookie";
import { useEffect, useState } from "react";
// Redirect component is replace with Navigate component
// useNaviage can be user to replace history.replace
import { useNavigate } from "react-router-dom";

import "./index.css";

const URL = "https://apis.ccbp.in/login";

const LoginPage = () => {
  // state for username and password
  const [userName, setUserName] = useState("rahul");
  const [password, setPassword] = useState("rahul@2021");
  const [errorMsg, setErrorMsg] = useState("");

  // for handling onChangevalues of username and password
  const onChangeUserName = (event) => setUserName(event.target.value);
  const onChangePassword = (event) => setPassword(event.target.value);

  // handle success login store token for later use
  const navigate = useNavigate();
  const onSubmitSuceess = (jwtToken) => {
    Cookies.set("jwt_token", jwtToken, {
      expires: 30,
      path: "/",
    });
    navigate("/", { replace: true });
  };

  // for onclick login handle
  const onLoginHandle = async (event) => {
    event.preventDefault();

    // object to send user details to verify
    const userDetails = {
      username: userName,
      password: password,
    };

    const options = {
      method: "POST",
      body: JSON.stringify(userDetails),
    };

    const response = await fetch(URL, options);
    const data = await response.json();
    console.log(data);
    if (response.ok) {
      onSubmitSuceess(data.jwt_token);
      // resetting or clear input fields
      setUserName("");
      setPassword("");
      setErrorMsg("");
    } else {
      setErrorMsg(data.error_msg);
    }
  };

  // verify user is already logined (authenticated user)

  useEffect(() => {
    const jwtToken = Cookies.get("jwt_token");
    console.log(jwtToken);
    if (jwtToken !== undefined) {
      navigate("/");
    }
  }, [navigate]);

  const renderUserNameElement = () => (
    <div className="input-field-container">
      <label className="lable-name" htmlFor="username">
        USERNAME
      </label>
      <input
        className="input-field"
        id="username"
        type="text"
        value={userName}
        onChange={onChangeUserName}
      />
    </div>
  );

  const renderpasswordElement = () => (
    <div className="input-field-container">
      <label className="lable-name" htmlFor="password">
        PASSWORD
      </label>
      <input
        className="input-field"
        id="password"
        type="password"
        value={password}
        onChange={onChangePassword}
      />
    </div>
  );

  return (
    <div className="login-page-background">
      <div className="login-card">
        <img
          alt="login website logo"
          className="spotify-remix-logo"
          src="https://res.cloudinary.com/davv8r8v4/image/upload/v1722322776/spoyifyRemix/encjbygxlrdyup0junkv.png"
        />
        <form className="login-form-container" onSubmit={onLoginHandle}>
          {renderUserNameElement()}
          {renderpasswordElement()}
          <button className="login-button" type="submit">
            Login
          </button>
        </form>
        <p className="error-messgae">{errorMsg}</p>
      </div>
    </div>
  );
};

export default LoginPage;
