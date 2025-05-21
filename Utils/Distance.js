const axios = require("axios");
const calculateDistance = async (hopsPincode, clientCoordinates) => {
  try {
    const openWeatherApiKey = "4b9b8688eca407ea3546cf525c8f03cb";
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/zip`,
      {
        params: {
          zip: `${hopsPincode},IN`,
          appid: openWeatherApiKey
        }
      }
    );
    console.log("response : ", response.data);
    if (response.data.lat && response.data.lon) {
      const hopsCoordinates = {
        latitude: response.data.lat,
        longitude: response.data.lon,
        _id: hopsPincode // Using pincode as ID since OpenWeather API doesn't provide one
      };
      const distance = haversine(
        clientCoordinates.latitude,
        clientCoordinates.longitude,
        hopsCoordinates.latitude,
        hopsCoordinates.longitude
      );
      console.log(`Distance from client to ${hopsPincode}: ${distance} km`);
      return {
        distance,
        _id: hopsCoordinates._id
      };
    }
    console.log(`No coordinates found for pincode: ${hopsPincode}`);
    return null;
  } catch (error) {
    console.error(
      `Error calculating distance for pincode ${hopsPincode}:`,
      error.message
    );
    return null;
  }
};
const haversine = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; 
};
module.exports = {
  calculateDistance,
};