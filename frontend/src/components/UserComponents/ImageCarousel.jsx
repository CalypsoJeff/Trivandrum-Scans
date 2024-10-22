import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Img1 from "/Images/pexels-tima-miroshnichenko-9574411.jpg";
import Img2 from "/Images/1677501974-96786f15-b48f-4902-9a8b-d82320c4e22c.png";
import Img3 from "/Images/SlideTrivandrumScans1.jpg";

// ImageCarousel Component
// eslint-disable-next-line react/prop-types
function ImageCarousel({ userName }) {
  // Array of imported images
  const images = [
    { url: Img1, alt: "Slide 1" },
    { url: Img2, alt: "Slide 2" },
    { url: Img3, alt: "Slide 3" },
  ];

  // Slick carousel settings
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Infinite loop
    speed: 500, // Transition speed
    slidesToShow: 1, // Show one slide at a time
    slidesToScroll: 1, // Scroll one slide at a time
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Autoplay speed (3 seconds)
    arrows: true, // Show previous/next arrows
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {" "}
      {/* Full screen carousel with relative positioning */}
      <Slider {...settings} className="h-full">
        {images.map((image, index) => (
          <div key={index} className="h-full">
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover" // Ensure the image covers both width and height
            />
          </div>
        ))}
      </Slider>
      {/* Overlay text (Welcome message) */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center bg-black bg-opacity-50">
        <h1 className="text-4xl font-bold text-white mb-4">
          {" "}
          {/* Increased font size */}
          Hey, hello <span className="text-blue-300">{userName}</span>!
        </h1>
        <p className="text-lg text-gray-200">
          Welcome back! We hope you have a great experience.
        </p>
      </div>
    </div>
  );
}

export default ImageCarousel;
