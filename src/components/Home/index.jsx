import EditorSection from "../EditorSection";
import GeneresSection from "../GeneresSection";
import NewRelaseSection from "../NewReleaseSection";
import SideNavBar from "../SideNavBar";
import TopNavBar from "../TopNavBar";

//import css here
import "./index.css";
const Home = () => {
  return (
    <div className="home-section-container">
      <SideNavBar />
      <TopNavBar />
      <div className="sections-container pt-5 pr-3 pr-md-4">
        <EditorSection />
        <GeneresSection />
        <NewRelaseSection />
      </div>
    </div>
  );
};

export default Home;
