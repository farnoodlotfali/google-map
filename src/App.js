/* global google */
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Polyline,
} from "@react-google-maps/api";
import { collection, getDocs } from "firebase/firestore";
import { db, functions } from "./firebase";
import { useEffect, useReducer, useState } from "react";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { httpsCallable } from "firebase/functions";

// reducer
import appReducer from "./appReducer";

// components
import ChoosePlace from "./components/ChoosePlace";
import ParcelTypesList from "./components/ParcelTypesList";
import TransportOptions from "./components/TransportOptions";
import Spinner from "./components/Spinner";

// img
import pinBlue from "./assets/2.png";
import pinOrange from "./assets/7.png";

// types
import {
  SAVE_DESTINATION,
  SAVE_ORIGIN,
  SAVE_PARCEL,
  SET_CENTER,
  SET_PARCELS,
  SET_POLYLINE_ROUTES,
  SET_PRICING_VALUES,
} from "./types";

const initialState = {
  origin: null,
  destination: null,
  parcel: null,
  paracels: [],
  center: { lat: 48.8584, lng: 2.2945 },
  polylineRoutes: [],
  pricingValues: null,
  transportType: null,
  loading: false,
};

const libraries = ["places", "geometry", ""];

const App = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries: libraries,
  });

  const [state, dispatch] = useReducer(appReducer, initialState);
  const {
    paracels,
    center,
    parcel,
    polylineRoutes,
    origin,
    destination,
    pricingValues,
    loading,
  } = state;

  const [map, setMap] = useState(null);
  const [step, setStep] = useState(0);
  const [autocomplete, setAutocomplete] = useState(null);
  const [autocomplete1, setAutocomplete1] = useState(null);
  useEffect(() => {
    getBearerParcels();
  }, []);

  // get bearerParcels from firebase
  const getBearerParcels = async () => {
    const apiParcels = await getDocs(collection(db, "bearerParcels"));
    dispatch({
      type: SET_PARCELS,
      payload: apiParcels.docs.map((doc) => ({ ...doc.data(), id: doc.id })),
    });
    /*
    // first method get images
    // const storage = getStorage();
    // const storageRef = ref(storage);
    // const imagesRef = ref(storageRef, "parcelsImage");
    // const fileName = "AEK5G5Y5QyxWw37IvJXd.png";
    // const spaceRef = ref(imagesRef, fileName);
    // paracel.docs.map((doc) => {
    //   const starsRef = ref(storage, doc.data().parcel_img_url);
    //   getDownloadURL(spaceRef)
    //     .then((url) => {
    //       console.log(url);
    //       // Insert url into an <img> tag to "download"
    //     })
    //     .catch((error) => {
    //       console.log(error.code);
    //       // A full list of error codes is available at
    //       // https://firebase.google.com/docs/storage/web/handle-errors
    //       switch (error.code) {
    //         case 'storage/object-not-found':
    //           // File doesn't exist
    //           break;
    //         case 'storage/unauthorized':
    //           // User doesn't have permission to access the object
    //           break;
    //         case 'storage/canceled':
    //           // User canceled the upload
    //           break;

    //         // ...

    //         case 'storage/unknown':
    //           // Unknown error occurred, inspect the server response
    //           break;
    //       }
    //     });
    //   console.log(doc.data().parcel_img_url);
    // })
    */

    /*
    // second method get images
    // const starsRef = ref(storage, 'parcelsImage/VcIZCHegdnzxW0jowMt2.png');
   
    // Get the download URL
    getDownloadURL(starsRef)
      .then((url) => {
        console.log(url);
        // Insert url into an <img> tag to "download"
      })
      .catch((error) => {
        console.log(error.code);
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object-not-found':
            // File doesn't exist
            break;
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            break;
          case 'storage/canceled':
            // User canceled the upload
            break;

          // ...

          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            break;
        }
      });
      */
  };

  // get function which name is (pricing) from firebase
  const calcePrice = httpsCallable(functions, "pricing");

  const handlePrice = (selectedparcel) => {
    dispatch({
      type: SAVE_PARCEL,
      payload: selectedparcel,
    });

    calcePrice({
      origin: {
        lat: origin.lat,
        lng: origin.lng,
      },
      destination: {
        lat: destination.lat,
        lng: destination.lng,
      },
      vehicle_type: selectedparcel.vehicle_type,
      parcel_type: selectedparcel.parcel_type,
      parcel_description: selectedparcel.parcel_description,
      parcel_min_weight: selectedparcel.parcel_min_weight,
      parcel_max_weight: selectedparcel.parcel_max_weight,
    }).then((result) => {
      dispatch({
        type: SET_PRICING_VALUES,
        payload: result.data,
      });
      changeStep(3);
    });
  };

  // loaded polyline
  const onLoad = (polyline) => {
    // console.log('polyline: ', polyline)
  };

  // options of polyline
  const options1 = {
    strokeColor: "#1A0D6F",
    // strokeOpacity: 0.5,
    strokeWeight: 2,
    fillColor: "#1A0D6F",
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: 30000,
    paths: polylineRoutes,
    zIndex: 1,
    strokeOpacity: 0,
    icons: [
      {
        icon: {
          path: "M 0,-1 0,1",
          strokeOpacity: 1,
          scale: 4,
        },
        offset: "5px",
        repeat: "25px",
      },
    ],
    map: map,
  };

  // autocomplete place change lisenter
  const onPlaceChanged = async (which) => {
    const allAutoComp = [autocomplete, autocomplete1];
    const choseAuto = allAutoComp[which];
    // first method
    await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?place_id=${
        choseAuto.getPlace().place_id
      }&key=${process.env.REACT_APP_API_KEY}`
    )
      .then(async (res) => await res.json())
      .then((jRes) => {
        // console.log(jRes.results[0].geometry.location);
        dispatch({
          type: SET_CENTER,
          payload: jRes.results[0].geometry.location,
        });
        let newArrayRoutes = [...polylineRoutes];
        newArrayRoutes[which] = jRes.results[0].geometry.location;
        dispatch({
          type: SET_POLYLINE_ROUTES,
          payload: newArrayRoutes,
        });
      });

    /* second method
    const service = new google.maps.places.PlacesService(map);
    service.getDetails(
      {
        placeId: choseAuto.getPlace().place_id,
      },
      function (place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {


          console.log(place, status);
          setcenter(place.geometry.location);
          let Ar = [...polylineRoutes];
          Ar[which] = place.geometry.location;
          // setRoutes(prev => ([...prev, rrr.results[0].geometry.location]))
          setRoutes(Ar);

        }
      }
     
    );
     */
  };

  // change step of process
  const changeStep = (val) => {
    setStep(val);
  };

  // save origin detail
  const saveOrigin = (info) => {
    dispatch({
      type: SAVE_ORIGIN,
      payload: { ...info, ...polylineRoutes[0] },
    });
  };

  // save destination detail
  const saveDestination = (info) => {
    dispatch({
      type: SAVE_DESTINATION,
      payload: { ...info, ...polylineRoutes[1] },
    });
  };

  // map loading error
  if (loadError) {
    return <div className="text-red-500">error happening!</div>;
  }
  if (!isLoaded) {
    return <div className="text-yellow-500">loading...</div>;
  }

  return (
    <div className="app flex bg-gray-50 min-h-screen">
      {loading && <Spinner />}
      <div className="w-1/3 p-2">
        <div className="flex flex-col gap-3  ">
          <ChoosePlace
            data={origin}
            changeStep={changeStep}
            step={step}
            id={0}
            title={"Origin"}
            img={pinBlue}
            onPlaceChanged={onPlaceChanged}
            setAutocomplete={setAutocomplete}
            confirmFunction={saveOrigin}
          />
          <ChoosePlace
            data={destination}
            changeStep={changeStep}
            step={step}
            id={1}
            title={"Destination"}
            img={pinOrange}
            isDestination
            onPlaceChanged={onPlaceChanged}
            setAutocomplete={setAutocomplete1}
            confirmFunction={saveDestination}
          />

          <ParcelTypesList
            paracels={paracels}
            changeStep={changeStep}
            handlePrice={handlePrice}
            id={2}
            step={step}
          />

          <TransportOptions
            id={3}
            changeStep={changeStep}
            step={step}
            pricingValues={pricingValues}
          />
        </div>
      </div>
      <div className="w-2/3">
        <GoogleMap
          center={center}
          zoom={12}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Polyline onLoad={onLoad} path={polylineRoutes} options={options1} />
          {polylineRoutes.map((Route, i) => {
            return (
              <Marker
                icon={i === 0 ? pinBlue : pinOrange}
                position={Route}
                key={i}
              />
            );
          })}
        </GoogleMap>
      </div>
    </div>
  );
};

export default App;

