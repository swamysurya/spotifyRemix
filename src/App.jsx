import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

//To include react bootstrap css
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import 'bootstrap/dist/css/bootstrap.min.css';

// pages

import AlbumDetails from "./components/AlbumDetails";
import CategoryPlayListDetails from "./components/CategoryPlayListDetails";
import Home from "./components/Home";
import LoginPage from "./components/loginPage";
import PlayListDetails from "./components/PlayListdetails";
import NotFound from "./components/NotFound";
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
