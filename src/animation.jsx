import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { motion } from "framer-motion";

import bgimage from "./assets/bg4.png";
import bgimage1 from "./assets/bg3r.png";
import bgimage2 from "./assets/bg5.png";
import bgimage3 from "./assets/bg6.png";

const images = [
  { src: bgimage, leftText: "You can never be overdressed or overeducated.", rightText: "#Oscar Wilde" },
  { src: bgimage1, leftText: "Dress like you're already famous", rightText: "#Unknown" },
  { src: bgimage2, leftText: "I don't design clothes. I design dreams", rightText: "#Ralph Lauren" },
  { src: bgimage3, leftText: "Style is a way to say who you are without having to speak.", rightText: "#Rachel Zoe" },
];

const ImageCarousel = () => (
  <div style={{
    background: "linear-gradient(to right,rgb(206, 150, 213),rgb(196, 141, 177),rgb(103, 167, 154),rgb(149, 213, 194))",
    minHeight: "100vh"
  }} >
    <div className="relative z-10 flex flex-col justify-center items-center h-[60vh] text-center px-6">
      <motion.h1
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-6xl font-extrabold tracking-tight"
        
      >
        Welcome to <span className="text-[#98FF98]">StyleMate</span>
      </motion.h1>

      <motion.p
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 1.2 }}
        className="mt-4 text-lg md:text-xl max-w-2xl text-[#dcdcdc]"
      >
        Your personal stylist — explore looks, and influencer-approved outfits.
      </motion.p>
    </div>

    {/* Carousel Section */}
    <Carousel
      showThumbs={false}
      autoPlay
      infiniteLoop
      showStatus={false}
      showIndicators={true}
      className="carousel-wrapper"
    >
      {images.map((item, index) => (
        <div
          key={index}
          className="relative w-full flex justify-center items-center px-4 py-10 "
          style={{
            background: "linear-gradient(to right,rgb(206, 150, 213),rgb(196, 141, 177),rgb(103, 167, 154),rgb(149, 213, 194))",
            minHeight: "100vh"
          }}
        >
          {/* Left Motion Text */}
          <motion.div
            className="absolute left-4 text-purple-500 text-3xl font-bold"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {item.leftText}
          </motion.div>

          {/* Image */}
          <img
            style={{ maxHeight: "80vh", maxWidth: "100vh" }}
            className="max-w-full h-auto object-contain z-10"
            src={item.src}
            alt={`Slide ${index + 1}`}
          />

          {/* Right Motion Text */}
          <motion.div
            className="absolute right-4 text-pink-500 text-3xl font-bold"
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {item.rightText}
          </motion.div>
        </div>
      ))}
    </Carousel>
  </div>
);

export default ImageCarousel; 