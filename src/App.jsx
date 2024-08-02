import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// pages

import AlbumDetails from "./components/AlbumDetails";
import CategoryPlayListDetails from "./components/CategoryPlayListDetails";
import Home from "./components/Home";
import LoginPage from "./components/loginPage";
import PlayListDetails from "./components/PlayListdetails";
// css import
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route exact path="/" element={<ProtectedRoute element={Home} />} />
      <Route
        exact
        path="/playlist/:id/"
        element={<ProtectedRoute element={PlayListDetails} />}
      />
      <Route
        exact
        path="/category/:id/playlists"
        element={<ProtectedRoute element={CategoryPlayListDetails} />}
      />
      <Route
        exact
        path="/albums/:id"
        element={<ProtectedRoute element={AlbumDetails} />}
      />
    </Routes>
  );
}

export default App;
