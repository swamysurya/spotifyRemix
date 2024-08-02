import EditorSection from "../EditorSection";
import GeneresSection from "../GeneresSection";
import NewRelaseSection from "../NewReleaseSection";
import SideNavBar from "../SideNavBar";

//import css here
import "./index.css";
const Home = () => {
  return (
    <div className="home-section-container">
      <SideNavBar />
      <div>
        <EditorSection />
        <GeneresSection />
        <NewRelaseSection />
      </div>
    </div>
  );
};

export default Home;
