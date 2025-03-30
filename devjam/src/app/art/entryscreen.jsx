import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function EntryScreen({ startGame, carModels, selectedCar, handleCarSelection }) {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "20px",
    responsive: [
      {
        breakpoint: 640, // Mobile view
        settings: {
          slidesToShow: 2,
          centerPadding: "10px",
        }
      }
    ]
  };

  return (
    <div className="md:absolute md:inset-0 flex flex-col items-center justify-center bg-red-700 bg-opacity-90 z-10 text-white p-6 overflow-y-auto h-screen">
      <img src="https://media.formula1.com/image/upload/f_auto,c_limit,w_285,q_auto/f_auto/q_auto/fom-website/etc/designs/fom-website/images/F1_75_Logo.png" alt="F1 Logo" className="w-32 mb-6" />

      {selectedCar !== null && (
        <div onClick={startGame} className="mt-8 flex flex-col items-center cursor-pointer">
          <h3 className="text-2xl font-bold mb-4">Your Selection <span className='text-black'>[tap to start race]</span></h3>
          <img src={`https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/${carModels[selectedCar].image}`} alt={carModels[selectedCar].name} className="w-100" />
        </div>
      )}

  {/* Mobile View - Carousel */}
{/* <div className="md:hidden w-full px-6">
  <Slider {...settings}>
    {carModels.map((car, index) => (
      <div key={index} className="p-4 flex  flex-col items-center">
        <div
          className={`cursor-pointer mx-10 transition-all rounded-xl flex flex-col items-center border-4 ${
            selectedCar === index
              ? 'border-yellow-400 scale-105 shadow-lg shadow-yellow-400'
              : 'border-gray-500 hover:border-white'
          } bg-white text-black p-6 w-[150px] h-[180px]`}
          onClick={() => handleCarSelection(index)}
        >
          <img
            src={`https://media.formula1.com/content/dam/fom-website/teams/2025/${car.image}-logo.png`}
            alt={`${car.name} Logo`}
            className="h-12 w-12 mb-2"
          />
          <div className="text-base text-center font-bold">{car.name}</div>
          <img
            src={`https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/${car.image}.png`}
            alt={car.name}
            className="h-16 mt-3"
          />
        </div>
      </div>
    ))}
  </Slider>
</div> */}


<div className="w-full md:hidden block h-[60%] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 p-4">
          {carModels.map((car, index) => (
            <div
            key={index}
            className={`p-4 cursor-pointer transition-all rounded-lg flex flex-col items-center border-4 ${
              selectedCar === index ? 'border-yellow-400 scale-110 shadow-lg shadow-yellow-400' : 'border-gray-500 hover:border-white'
            } bg-white text-black`}
            onClick={() => handleCarSelection(index)}
            >
              {/* <div className="relative ">
          
   


                <img
                  src={`https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/${car.image}.png`}                  alt={car.name}
                  fill
                  className="object-contain"
                />
              </div> */}
           
              <img src={`https://media.formula1.com/content/dam/fom-website/teams/2025/${car.image}-logo.png`} alt={`${car.name} Logo`} className="h-12 w-12 mb-2" />
            <div className="h-16 flex items-center justify-center text-center font-bold text-lg">{car.name}</div>
            <img src={`https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/${car.image}.png`} alt={car.name} className="h-12 mt-2" />
       
            </div>
          ))}
        </div>
      </div>
      {/* Desktop View - Grid */}
      <div className="hidden md:grid grid-cols-2 md:grid-cols-5 gap-6">
        {carModels.map((car, index) => (
          <div
            key={index}
            className={`p-4 cursor-pointer transition-all rounded-lg flex flex-col items-center border-4 ${
              selectedCar === index ? 'border-yellow-400 scale-110 shadow-lg shadow-yellow-400' : 'border-gray-500 hover:border-white'
            } bg-white text-black`}
            onClick={() => handleCarSelection(index)}
          >
            <img src={`https://media.formula1.com/content/dam/fom-website/teams/2025/${car.image}-logo.png`} alt={`${car.name} Logo`} className="h-12 w-12 mb-2" />
            <div className="h-16 flex items-center justify-center text-center font-bold text-lg">{car.name}</div>
            <img src={`https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2025/${car.image}.png`} alt={car.name} className="h-12 mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}
