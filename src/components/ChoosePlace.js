import { useRef, useState } from "react";
import { Autocomplete } from "@react-google-maps/api";

const initialInfoPalce = {
  details: "",
  phone: "",
  name: "",
};

const ChoosePlace = ({
  step,
  img,
  title,
  isDestination = false,
  id,
  changeStep,
  confirmFunction,
  onPlaceChanged,
  setAutocomplete,
  data,
}) => {
  const inputRef = useRef();
  const [infoPlace, setInfoPlace] = useState(initialInfoPalce);

  const handleOnChange = (e) => {
    setInfoPlace((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOnsave = () => {
    confirmFunction({
      ...infoPlace,
      [inputRef.current.name]: inputRef.current.value,
    });
    changeStep(id + 1);
  };

  const clearDetail = () => {
    inputRef.current.value = "";
    setInfoPlace(initialInfoPalce);
  };


  return (
    <div
      className={`bg-white p-4 rounded-md gap-3 flex flex-col ${
        step === id ? "max-h-full" : "max-h-[75px]"
      }  overflow-hidden shadow-md`}
    >
      <div className="flex items-center mb-4">
        {!data || data.address === null || data.address === undefined   ? (
          <div className="flex items-center w-full justify-center">
            <img src={img} alt="" />
            <span className="text-xl text-gray-600">{title}</span>
          </div>
        ) : (
          <div className="flex flex-col  w-full justify-center">
            <span className="text-xl text-center text-gray-600">{title}</span>
            <div className="flex text-gray-400">
              <img className="w-5 h-5" src={img} alt="" />
              {data.address}
            </div>
          </div>
        )}

        <button
          className="text-sm text-gray-400 font-semibold cursor-pointer"
          onClick={() => {
            if (step === id) {
              clearDetail();
            } else changeStep(id);
          }}
        >
          {step === id ? "Clear" : "Edit"}
        </button>
      </div>
      <Autocomplete
        onLoad={(autoCop) => setAutocomplete(autoCop)}
        onPlaceChanged={() => onPlaceChanged(id)}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Address"
          name="address"
          className="bg-gray-100 p-3 w-full rounded-none outline-none border-b border-b-transparent focus:border-blue-300"
        />
      </Autocomplete>

      <input
        type="text"
        placeholder="Detals"
        name="details"
        className="bg-gray-100 p-3 w-full rounded-none outline-none border-b border-b-transparent focus:border-blue-300"
        value={infoPlace.details}
        onChange={handleOnChange}
      />
      <div className="flex gap-3">
        <input
          type="number"
          placeholder="phone"
          className="bg-gray-100 p-3 w-full rounded-none outline-none border-b border-b-transparent focus:border-blue-300"
          name="phone"
          value={infoPlace.phone}
          onChange={handleOnChange}
        />
        <input
          type="text"
          placeholder="Name"
          className="bg-gray-100 p-3 w-full rounded-none outline-none border-b border-b-transparent focus:border-blue-300"
          name="name"
          value={infoPlace.name}
          onChange={handleOnChange}
        />
      </div>
      {isDestination && (
        <div className="">
          <span className="text-xs text-gray-300">Delivery Approval by:</span>
          <div className="flex gap-5">
            <div className="flex items-center">
              <label htmlFor="SMS Confirmation">SMS Confirmation</label>
              <input
                type="radio"
                id="SMS Confirmation"
                name="approval"
                value="SMS Confirmation"
                onChange={handleOnChange}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="Recipients Signature">Recipients Signature</label>
              <input
                type="radio"
                id="Recipients Signature"
                name="approval"
                value="Recipients Signature"
                onChange={handleOnChange}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-3 mt-5">
        <button className="border border-gray-400 text-gray-400 rounded-md p-3 w-full">
          Choose from Favourite
        </button>
        <button
          onClick={() => handleOnsave()}
          className="border rounded-md p-3 w-full  border-blue-400 text-blue-400 hover:border-white hover:text-white hover:bg-blue-400 "
        >
          Confirm {title}
        </button>
      </div>
    </div>
  );
};

export default ChoosePlace;
