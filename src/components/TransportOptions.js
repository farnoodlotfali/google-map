
import { useState } from "react";

// images
import motor from "../assets/motor.png";
import bike from "../assets/bike.png";
import walk2 from "../assets/walk2.png";

const TransportOptions = ({ pricingValues, id, step, changeStep }) => {
  const [SelectedTrasnport, setSelectedTrasnport] = useState(null);

  const handleClick = (type) => {
    if (pricingValues.hasOwnProperty(type)) {
      setSelectedTrasnport(pricingValues[type]);
    }
  };
  
  return (
    <div
      className={`bg-white p-4 rounded-md overflow-hidden shadow-md ${
        step === id ? "max-h-full" : "max-h-[60px]"
      }`}
    >
      <div className="flex items-center mb-6">
        <div className="flex items-center w-full justify-center">
          <span className="text-xl text-gray-600">Tarnsport Options</span>
        </div>
        <button
          className="text-sm text-gray-400 font-semibold cursor-pointer"
          onClick={() => {
            if (step === id) {
              setSelectedTrasnport(null);
            } else changeStep(id);
          }}
        >
          {step === id ? "Clear" : "Edit"}
        </button>
      </div>

      <div className="flex gap-3 ">
        <div
          onClick={() => handleClick("riding")}
          className={` cursor-pointer py-2 w-full rounded-md shadow-md  ${
            SelectedTrasnport?.type === "riding"
              ? "bg-blue-400 text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <div className="w-20 h-16 mx-auto">
            <img src={motor} alt="" />
          </div>
          <div className="grid text-center text-sm mt-2 ">
            <span> {pricingValues?.riding?.price || "-"}$ </span>
            <span> {pricingValues?.riding?.time || "-"} </span>
          </div>
        </div>
        <div
          onClick={() => handleClick("cycling")}
          className={` cursor-pointer py-2 w-full rounded-md shadow-md  ${
            SelectedTrasnport?.type === "cycling"
              ? "bg-blue-400 text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <div className="w-20 h-16 mx-auto">
            <img src={bike} alt="" />
          </div>
          <div className="grid text-center text-sm mt-2 ">
            <span> {pricingValues?.cycling?.price || "-"}$ </span>
            <span> {pricingValues?.cycling?.time || "-"} min </span>
          </div>
        </div>
        <div
          onClick={() => handleClick("walking")}
          className={` cursor-pointer py-2 w-full rounded-md shadow-md  ${
            SelectedTrasnport?.type === "walking"
              ? "bg-blue-400 text-white"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <div className="w-20 h-16 mx-auto flex items-center">
            <img src={walk2} alt="" />
          </div>
          <div className="grid text-center text-sm mt-2 ">
            <span> {pricingValues?.walking?.price || "-"}$ </span>
            <span> {pricingValues?.walking?.time || "-"} min </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportOptions;
