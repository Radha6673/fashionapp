import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Register";
import Login from "./login";
import Dashboard from "./Dashboard";
import About from "./about";
import Contact  from "./contact";
import Explore from "./explore";
import InfluencerLogin from "./InfluencerLogin";
import InfluencerHome from "./InfluencerHome";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard/>} />
        <Route path="/Register" element={<Register />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/about" element={<About/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/explore" element={<Explore/>}/>
        <Route path="/InfluencerLogin" element={<InfluencerLogin/>}/>
        <Route path="/InfluencerHome" element={<InfluencerHome/>}/>


      </Routes>
    </BrowserRouter>
  );
}

export default App;
