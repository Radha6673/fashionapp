import Navbar from "./Navbar";
import ImageCarousel from "./animation";

const Dashboard = () => {
  return (
    <div style={{background:"black"}}>
      <div className="flex-grow-1 p-4">
        <Navbar />
        <ImageCarousel />
      </div>
    </div>
  );
};

export default Dashboard;
