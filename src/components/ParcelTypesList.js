import { useState } from "react";

// images
import envelope from "../assets/envelope.png";
import largebox from "../assets/large box.png";
import samllbox from "../assets/small box.png";

const images = [envelope, samllbox, largebox];
const ParcelTypesList = ({ paracels, handlePrice, id, step, changeStep }) => {
  const [selectedparcel, setSelectedParcel] = useState(null);

  return (
    <div
      className={`bg-white p-4 rounded-md ${
        step === id ? "max-h-full" : "max-h-[60px]"
      }  overflow-hidden shadow-md`}
    >
      <div className="flex items-center mb-6">
        <div className="flex items-center w-full justify-center">
          <span className="text-xl text-gray-600">Parcel`s Type</span>
        </div>
        <button
          className="text-sm text-gray-400 font-semibold cursor-pointer"
          onClick={() => {
            if (step === id) {
              setSelectedParcel(null);
            } else changeStep(id);
          }}
        >
          {step === id ? "Clear" : "Edit"}
        </button>
      </div>

      {paracels.map((paracel, i) => {
        return (
          <div
            key={paracel.id}
            onClick={() => setSelectedParcel(paracel)}
            className={`flex justify-between ${
              paracel.id === selectedparcel?.id
                ? `bg-blue-400 text-white`
                : `bg-gray-100 text-gray-400`
            } rounded-md p-3  my-2 cursor-pointer`}
          >
            <div className="flex  items-center gap-3">
              <div
                className={`w-16 h-16 ${
                  paracel.id === selectedparcel?.id
                    ? `bg-blue-200`
                    : `bg-gray-200`
                }  rounded-md`}
              >
                <img src={images[i]} alt="" />
              </div>
              <div className="text-sm">{paracel.parcel_type}</div>
            </div>
            <div className="flex flex-col text-xs text-center justify-center gap-1">
              <span>
                {paracel.parcel_min_weight} - {paracel.parcel_max_weight} kg
              </span>
              <span> {paracel.parcel_description}</span>
            </div>
          </div>
        );
      })}

      <div className="flex justify-center">
        <button
          onClick={() => handlePrice(selectedparcel)}
          className="border rounded-md  border-blue-400 text-blue-400 hover:border-white hover:text-white hover:bg-blue-400 py-3  w-1/2  "
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default ParcelTypesList;
