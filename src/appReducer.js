import {
  SAVE_ORIGIN,
  SAVE_DESTINATION,
  SAVE_PARCEL,
  SET_PARCELS,
  SET_CENTER,
  SET_POLYLINE_ROUTES,
  SET_PRICING_VALUES,
  SAVE_TRANSPORT_TYPE,
} from "./types";

export default (state, action) => {
  switch (action.type) {
    case SAVE_ORIGIN:
      return {
        ...state,
        origin: action.payload,
      };
    case SAVE_DESTINATION:
      return {
        ...state,
        destination: action.payload,
      };
    case SAVE_PARCEL:
      return {
        ...state,
        parcel: action.payload,
        loading: true,
      };
    case SET_PARCELS:
      return {
        ...state,
        paracels: action.payload,
      };
    case SET_CENTER:
      return {
        ...state,
        center: action.payload,
      };
    case SET_POLYLINE_ROUTES:
      return {
        ...state,
        polylineRoutes: action.payload,
      };
    case SET_PRICING_VALUES:
      console.log(111111);
      return {
        ...state,
        loading: false,
        pricingValues: action.payload,
      };
    case SAVE_TRANSPORT_TYPE:
      return {
        ...state,
        pricingValues: action.payload,
      }; 


    default:
      return { ...state };
  }
};
